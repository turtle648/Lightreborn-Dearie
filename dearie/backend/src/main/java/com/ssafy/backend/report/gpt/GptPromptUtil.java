package com.ssafy.backend.report.gpt;

import com.ssafy.backend.diary.model.dto.response.GetDiaryReportDTO;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class GptPromptUtil {

    public static String makePrompt(List<GetDiaryReportDTO> diaries) {
        StringBuilder sb = new StringBuilder();

        // 역할 설명 강화
        sb.append("당신은 사용자의 일기와 감정 흐름을 정성껏 읽고, 진심 어린 공감과 따뜻한 위로를 전하는 AI 상담사입니다.\n");
        sb.append("답변은 JSON 형식으로만 하며, 다음 항목과 지침을 반드시 지켜야 합니다:\n\n");

        // 응답 형식 및 규칙
        sb.append("1. comment: 사건 감정 요약 + '|' + 공감 응원 메시지\n");
        sb.append("   - 최근 일기를 바탕으로 사건과 감정의 흐름을 **5~6문장 이상** 섬세하게 요약합니다.\n");
        sb.append("   - 이어서 **'|' 기호를 기준으로** 공감과 응원의 메시지를 **3~4문장 이상** 따뜻하게 작성합니다.\n");
        sb.append("   - 너무 짧거나 단순한 문장은 지양하며, 진심과 공감이 느껴지도록 자세히 씁니다.\n\n");

        sb.append("2. emotionScores:\n");
        sb.append("   - 항목: 기쁨, 슬픔, 분노, 불안, 평온 → **반드시 모두 포함**하며, 총합은 **100**입니다.\n");
        sb.append("   - 일기에서 나타난 감정의 흐름을 기반으로 **감정 간 점수 차이를 명확히 표현**합니다.\n\n");

        sb.append("3. 기타 지침:\n");
        sb.append("   - 사용자가 지쳐보이는 경우, 가볍게 바깥 활동(산책, 햇빛 쬐기 등)을 제안해도 좋습니다.\n");
        sb.append("   - 이모티콘은 공감이 느껴질 수 있도록 1~2개 정도만 적절히 사용하세요.\n");
        sb.append("   - 너무 간단하거나 형식적인 위로 문구는 피합니다.\n\n");

        // 예시 추가
        sb.append("예시:\n");
        sb.append("{\n");
        sb.append("  \"comment\": \"이번 주는 유난히 감정의 파도가 심했던 한 주였던 것 같아요. 하루하루가 버겁게 느껴지고, 무기력한 감정에 휩싸인 순간도 많았을 거예요. 특히 어떤 날은 감정을 억누르기조차 어려운 시간이었을지도 몰라요. 하지만 그런 속에서도 당신은 일기를 쓰며 마음을 표현해내려 했고, 그것만으로도 충분히 용기 있는 행동이에요. | 당신의 진심이 느껴져서 마음이 아프기도 하고 동시에 존경스럽기도 했어요. 잠시 햇살 좋은 날에 가볍게 산책을 나서보는 건 어때요? 바람 한 줄기가 위로가 될 수도 있어요. 당신은 혼자가 아니에요. 🌿😊\",\n");
        sb.append("  \"emotionScores\": {\n");
        sb.append("    \"기쁨\": 15,\n");
        sb.append("    \"슬픔\": 40,\n");
        sb.append("    \"분노\": 20,\n");
        sb.append("    \"불안\": 15,\n");
        sb.append("    \"평온\": 10\n");
        sb.append("  }\n");
        sb.append("}\n\n");

        // 사용자 일기 삽입
        sb.append("아래는 사용자가 최근 7일간 작성한 일기입니다. 일기를 읽고 위 기준에 따라 진심 어린 분석을 해주세요.\n\n");
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
