package com.ssafy.backend.promotion_network.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDataDTO {

    private String address;           // 주소
    private double latitude;         // 위도
    private double longitude;        // 경도

    private boolean isPosted;        // 게시 상태
    private String statusChangedAt;  // 상태 변경 시각 (String 또는 LocalDateTime)

    private String locationType;     // 홍보물 위치 (예: 카페, 약국)
    private String dongCode;           // 행정동 코드
    private String dongName;         // 행정동 이름
    private String placeName;        // 장소명

    private String promotionType;    // 홍보물 유형 (포스터, 현수막, X배너 등)
    private String promotionContent; // 홍보물 내용
}
