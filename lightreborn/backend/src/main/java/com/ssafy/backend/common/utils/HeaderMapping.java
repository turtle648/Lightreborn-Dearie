package com.ssafy.backend.common.utils;

import com.ssafy.backend.common.utils.enums.FileType;

import java.util.EnumMap;
import java.util.Map;

public class HeaderMapping {

    public static final EnumMap<FileType, Map<String,String>> HEADER_ALIAS = new EnumMap<>(FileType.class);

    private HeaderMapping() {}

    static
    {
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

        HEADER_ALIAS.put(FileType.PROMOTION, Map.of(
                "주소",                           "address",
                "위도",                           "latitude",
                "경도",                           "longitude",
                "게시 상태",                        "isPublished",
                "상태 변경 시각",                 "createdAt",
                "홍보물 유형",                   "promotionType",
                "행정동 코드",                   "hangjungCode",
                "행정동 이름",                   "hangjungName"
        ));
    }

    public static Map<String,String> getHeaderMapping(FileType fileType) {
        return HEADER_ALIAS.get(fileType);
    }

}