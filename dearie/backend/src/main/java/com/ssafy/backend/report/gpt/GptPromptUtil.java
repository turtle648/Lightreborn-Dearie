package com.ssafy.backend.report.gpt;

import com.ssafy.backend.diary.model.dto.response.GetDiaryReportDTO;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class GptPromptUtil {
    public static String makePrompt(List<GetDiaryReportDTO> diaries) {
        StringBuilder sb = new StringBuilder();

        sb.append("너는 공감을 바탕으로 작성된 일기 내용을 따뜻하고 섬세하게 읽고, 그에 맞는 진심 어린 응원의 말을 전하는 역할을 맡고 있어.\n");
        sb.append("아래 규칙을 반드시 지켜서 JSON으로만 답변해.\n");
        sb.append("1. comment: 감정 흐름 요약(3~4문장) + '|' + 공감 응원 메시지(3~4문장)\n");
        sb.append("2. emotionScores: 기쁨, 슬픔, 분노, 불안, 평온(총합 100)\n");
        sb.append("3. 우울하거나 지친 감정이 드러난 경우, 너무 무겁지 않게 바깥 활동(산책, 햇빛 쬐기 등)을 가볍게 제안해주는 것도 좋아.\n");
        sb.append("4. 이모티콘은 1~2개만, 과하지 않게\n");
        sb.append("5. 반드시 아래 예시와 같은 JSON만 반환\n\n");

        sb.append("예시:\n");
        sb.append("{\n");
        sb.append("  \"comment\": \"이번 주는 슬픔이 많았어요. ... | 힘내세요! 😊...\",\n");
        sb.append("  \"emotionScores\": {\n");
        sb.append("    \"기쁨\": 10,\n");
        sb.append("    \"슬픔\": 70,\n");
        sb.append("    \"분노\": 10,\n");
        sb.append("    \"불안\": 5,\n");
        sb.append("    \"평온\": 5\n");
        sb.append("  }\n");
        sb.append("}\n\n");

        sb.append("아래는 최근 일주일간 일기야.\n");
        int i = 1;
        for (GetDiaryReportDTO d : diaries) {
            if (d.getContent() != null) {
                String date = d.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE);
                sb.append(i++).append("일차 (").append(date).append("): ")
                        .append(d.getContent()).append("\n");
            }
        }
        return sb.toString();
    }
}