package com.ssafy.backend.survey.model.dto.response;

import com.ssafy.backend.survey.model.entity.SurveyOption;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OptionDTO {
    private Long optionId;
    private String optionText;

    public static OptionDTO from (SurveyOption option) {
        return OptionDTO.builder()
                .optionId(option.getId())
                .optionText(option.getOptionText())
                .build();
    }
}
