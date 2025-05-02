package com.ssafy.backend.youth_consultation.entity;

import lombok.Getter;

@Getter
public enum Answer {
    YES("예"),
    NO("아니오"),
    HOBBY_ONLY("보통은 집에 있지만, 나의 취미생활만을 위해 외출함."),
    CONVENIENCE_STORE("보통은 집에 있지만, 인근 편의점 등에는 외출함."),
    ROOM_ONLY("나의 방에서 나오지만, 집 밖으로는 나가지 않음."),
    SELDOM_LEAVE("나의 방에서 거의 나오지 않음."),
    NOT_APPLICABLE("해당사항 없음."),
    DOES_NOT_APPLY("해당되지 않는다."),
    HARDLY_APPLIES("별로 해당되지 않는다."),
    NEUTRAL("어느쪽도 아니다."),
    APPLIES_SLIGHTLY("조금 해당된다."),
    APPLIES_STRONGLY("매우 해당된다.");

    private final String label;

    Answer(String label) {
        this.label = label;
    }
}
