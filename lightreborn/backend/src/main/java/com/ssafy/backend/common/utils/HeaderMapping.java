package com.ssafy.backend.common.utils;

import com.ssafy.backend.common.utils.enums.FileType;

import java.util.EnumMap;
import java.util.Map;

public class HeaderMapping {

    public static final EnumMap<FileType, Map<String,String>> HEADER_ALIAS = new EnumMap<>(FileType.class);

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

        ));
    }

    public static Map<String,String> getHeaderMapping(FileType fileType) {
        return HEADER_ALIAS.get(fileType);
    }

}