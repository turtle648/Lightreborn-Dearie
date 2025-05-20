package com.ssafy.backend.common.utils;

import com.ssafy.backend.common.utils.enums.FileType;

import java.util.EnumMap;
import java.util.Map;

/**
 * 파일 업로드 시 헤더명(한글)과 엔티티 필드명을 매핑하는 유틸리티 클래스입니다.
 * <p>
 * 각 {@link FileType}에 따라 필요한 헤더 이름을 정의하고,
 * 해당 헤더가 어떤 필드로 매핑되어야 하는지를 Map 형태로 제공합니다.
 * <br>
 * 예: "청년 1인 세대수" → "youthHouseholdCount"
 */
public class HeaderMapping {

    /**
     * 파일 종류별(header 파일 종류: 청년 인구, 홍보물, 복지기관 등)에 대한 헤더 매핑 정보
     * key: FileType
     * value: Map<CSV 헤더 이름, DTO/Entity 필드명>
     */
    public static final EnumMap<FileType, Map<String,String>> HEADER_ALIAS = new EnumMap<>(FileType.class);

    private HeaderMapping() {} //인스턴스화 방지

    static
    {
        // 청년 인구 파일
        HEADER_ALIAS.put(FileType.POPULATION, Map.of(
                "청년 1인 세대수",                "youthHouseholdCount",
                "남자 1인 세대수",                "youthMaleHouseholdCount",
                "여자 1인 세대수",                "youthFemaleHouseholdCount",
                "청년 인구 현황",                 "youthPopulation",
                "남자 인구 현황",                 "youthMalePopulation",
                "여자 인구 현황",                 "youthFemalePopulation",
                "데이터 기준 날짜",               "baseDate",
                "행정동 코드",                   "hangjungCode",
                "행정동 이름",                   "hangjungName"
        ));

        // 홍보물 파일
        HEADER_ALIAS.put(FileType.PROMOTION, Map.ofEntries(
                Map.entry("주소", "address"),
                Map.entry("위도", "latitude"),
                Map.entry("경도", "longitude"),
                Map.entry("게시 상태", "isPublished"),
                Map.entry("상태 변경 시각", "createdAt"),
                Map.entry("홍보물 위치", "promotionPlaceType"),
                Map.entry("행정동 코드", "hangjungCode"),
                Map.entry("행정동 이름", "hangjungName"),
                Map.entry("장소명", "promotionSpotName"),
                Map.entry("홍보물 유형", "promotionType"),
                Map.entry("홍보물 내용", "promotionInformation")
        ));


        // 복지기관 파일
        HEADER_ALIAS.put(FileType.WELFARE_CENTER, Map.of(
                "기관 이름",       "organizationName",
                "종류",           "type",
                "주소",           "address",
                "전화번호",        "phoneNumber",
                "위도",           "latitude",
                "경도",           "longitude",
                "행정동 코드",     "hangjungCode",
                "행정동 이름",     "hangjungName"
        ));
    }

    /**
     * 주어진 파일 유형에 해당하는 헤더 매핑 정보를 반환합니다.
     *
     * @param fileType 파일 종류 (청년 인구, 홍보물, 복지기관 등)
     * @return 헤더 이름과 필드명을 매핑한 Map
     */
    public static Map<String,String> getHeaderMapping(FileType fileType) {
        return HEADER_ALIAS.get(fileType);
    }

}