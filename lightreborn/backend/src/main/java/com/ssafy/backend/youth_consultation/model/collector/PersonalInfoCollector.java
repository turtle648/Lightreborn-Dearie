package com.ssafy.backend.youth_consultation.model.collector;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

@Slf4j
@ToString
@Getter
public class PersonalInfoCollector {
    private String name;
    private LocalDate birthDate;
    private String emergencyContent;
    private String phoneNumber;

    @JsonIgnore
    private final Map<String, Consumer<String>> fieldMap = new HashMap<>();
    @JsonIgnore
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    public PersonalInfoCollector() {
        fieldMap.put("이름", val -> this.name = val);
        fieldMap.put("전화번호", val -> this.phoneNumber = val);
        fieldMap.put("비상연락망", val -> this.emergencyContent = val);
        fieldMap.put("생년월일", val -> this.birthDate = LocalDate.parse(val, formatter));
    }

    public void add(String label, String value) {
        Consumer<String> setter = fieldMap.get(label);

        if(setter != null) {
            setter.accept(value);
        } else {
            throw new IllegalArgumentException();
        }
    }
}
