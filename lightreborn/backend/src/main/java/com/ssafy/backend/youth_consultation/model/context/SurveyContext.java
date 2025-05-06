package com.ssafy.backend.youth_consultation.model.context;

import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.youth_consultation.model.entity.SurveyQuestion;
import com.ssafy.backend.youth_consultation.model.collector.PersonalInfoCollector;
import com.ssafy.backend.youth_consultation.model.collector.SurveyAnswerCollector;
import com.ssafy.backend.youth_consultation.model.state.Answer;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Getter
public class SurveyContext {
    private final Map<String, SurveyQuestion> questions;
    private final SurveyAnswerCollector answers;
    private final PersonalInfoCollector personalInfoCollector;

    private static final String LAST_QUESTION = "타 현재 주요 고민 내용을 입력해주세요.";
    private static final String RE_QUESTION_CODE = "[가-카]";

    public SurveyContext(Map<String, SurveyQuestion> questions, MultipartFile file) throws IOException {
        this.questions = questions;
        this.answers = new SurveyAnswerCollector();
        this.personalInfoCollector = new PersonalInfoCollector();

        this.build(file);
    }

    private void build(MultipartFile file) throws IOException {
        File convFile = File.createTempFile("upload-", ".docx");
        file.transferTo(convFile);

        try (FileInputStream fis = new FileInputStream(convFile);
             XWPFDocument doc = new XWPFDocument(fis)) {

            for (IBodyElement element : doc.getBodyElements()) {
                if (!(element instanceof XWPFTable)) continue;

                XWPFTable table = (XWPFTable) element;
                for (XWPFTableRow row : table.getRows()) {
                    handleRow(table.getRows(), row);
                }
            }
        }

        log.info("[SpeechServiceImpl] 워드 파싱 완료 {}", answers);
    }

    private void handleRow(List<XWPFTableRow> rows, XWPFTableRow row) {
        List<XWPFTableCell> cells = row.getTableCells();
        if (cells.isEmpty()) return;

        String title = cells.get(0).getText().trim();

        if (title.equals(LAST_QUESTION)) {
            handleFreeTextAnswer(rows, row);
        } else if (questions.containsKey(title)) {
            handleGeneralAnswer(cells, title);
        } else if (title.matches(RE_QUESTION_CODE)) {
            handleGroupAnswer(cells, title);
        }
    }


    private void handleFreeTextAnswer(List<XWPFTableRow> rows, XWPFTableRow row) {
        int idx = rows.indexOf(row);
        if (idx + 1 >= rows.size()) return;
        String answer = rows.get(idx + 1).getTableCells().get(0).getText().trim();
        answers.addAnswerText(questions.get(LAST_QUESTION), answer);
    }

    private void handleGeneralAnswer(List<XWPFTableCell> cells, String title) {
        String answer = FileParserUtils.normalize(cells.get(1).getText());
        try {
            personalInfoCollector.add(title, answer);
        } catch (IllegalArgumentException e) {
            answers.addAnswerChoice(questions.get(title), answer);
        }
    }

    private void handleGroupAnswer(List<XWPFTableCell> cells, String title) {
        title += " " + cells.get(1).getText();
        if (!questions.containsKey(title)) return;

        SurveyQuestion question = questions.get(title);
        String questionCode = question.getQuestionCode();

        for (int idx = 2; idx < cells.size(); idx++) {
            String cellText = FileParserUtils.normalize(cells.get(idx).getText());
            if (cellText.isBlank()) continue;

            Answer.findByQuestionCodeAndColNum(questionCode, idx)
                    .ifPresent(answer -> answers.addAnswerChoice(question, answer.getLabel()));
        }
    }
}
