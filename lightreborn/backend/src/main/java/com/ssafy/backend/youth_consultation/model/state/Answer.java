package com.ssafy.backend.youth_consultation.model.state;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

@Getter
public enum Answer {
    YES("예", 2, groupA()),
    NO("아니오", 3, groupA()),
    HOBBY_ONLY("보통은 집에 있지만, 나의 취미생활만을 위해 외출함.", 2, groupB()),
    CONVENIENCE_STORE("보통은 집에 있지만, 인근 편의점 등에는 외출함.", 3, groupB()),
    ROOM_ONLY("나의 방에서 나오지만, 집 밖으로는 나가지 않음.", 4, groupB()),
    SELDOM_LEAVE("나의 방에서 거의 나오지 않음.", 5, groupB()),
    NOT_APPLICABLE("해당사항 없음.", 6, groupB()),
    DOES_NOT_APPLY("해당되지 않는다.", 2, groupC()),
    HARDLY_APPLIES("별로 해당되지 않는다.", 3, groupC()),
    NEUTRAL("어느쪽도 아니다.", 4, groupC()),
    APPLIES_SLIGHTLY("조금 해당된다.", 5, groupC()),
    APPLIES_STRONGLY("매우 해당된다.", 6, groupC());

    private final String label;
    private final Integer colNum;
    private final Set<String> applicableQuestionCodes;

    Answer(String label, Integer colNum, Set<String> applicableQuestionCodes) {
        this.label = label;
        this.colNum = colNum;
        this.applicableQuestionCodes = applicableQuestionCodes;
    }

    public static Optional<Answer> findByQuestionCodeAndColNum(String questionCode, int colNum) {
        return Arrays.stream(values())
                .filter(a -> a.colNum == colNum && a.applicableQuestionCodes.contains(questionCode))
                .findFirst();
    }

    private static Set<String> groupA() {
        return Set.of("가");
    }

    private static Set<String> groupB() {
        return Set.of("나");
    }

    private static Set<String> groupC() {
        return Set.of("다", "라", "마", "바", "사", "아", "자", "차", "카");
    }

}
