package com.ssafy.backend.welfare_center.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.common.vo.Coordinate;
import com.ssafy.backend.welfare_center.entity.PartnerOrganization;
import com.ssafy.backend.welfare_center.model.response.WelfareCenterResponseDTO;
import com.ssafy.backend.welfare_center.repository.WelfareCenterRepository;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import com.ssafy.backend.youth_population.entity.YouthPopulation;
import com.ssafy.backend.youth_population.repository.HangjungsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WelfareCenterServiceImpl implements WelfareCenterService {

    private final List<RawFileParser> rawFileParsers;
    private final ObjectMapper objectMapper;
    private RawFileParser fileParser;
    private final WelfareCenterRepository welfareCenterRepository;
    private final HangjungsRepository hangjungsRepository;

    @Override
    public List<WelfareCenterResponseDTO> uploadAndProcess(MultipartFile file) throws IOException {

        //1. 알맞은 파서 선택
        fileParser = FileParserUtils.resolveParser(Objects.requireNonNull(file.getOriginalFilename()), rawFileParsers);
        
        //2. 파일 유효성 검증
        Set<String> missingHeaders = FileParserUtils.findMissingHeaders(fileParser.extractHeaders(file), HeaderMapping.getHeaderMapping(FileType.WELFARE_CENTER).keySet());
        if(!missingHeaders.isEmpty()) {
            log.error("올바르지 않은 협력 기관 데이터를 업로드했습니다.");
            throw new MissingHeadersException(missingHeaders);
        }

        return parseAndMapFile(file);
    }

    @Override
    public List<WelfareCenterResponseDTO> parseAndMapFile(MultipartFile file) throws IOException {
        
        //3. 파일 파싱
        List<Map<String,String>> rows = fileParser.parse(file, FileType.WELFARE_CENTER);

        log.info("파싱 성공 Object Mapper entity 변환");

        //4. 기존 객체 조회
        List<Coordinate> coordinatesList = rows.stream()
                .map(r-> new Coordinate(Double.valueOf(r.get("latitude")), Double.valueOf(r.get("longitude"))))
                .toList();

        // 4-1. 각 좌표(latitude + longitude)에 대해 개별 검색 조건 Specification 생성
        List<Specification<PartnerOrganization>> specs = coordinatesList.stream()
                .map(k -> (Specification<PartnerOrganization>)
                        (root, q, cb) ->
                                (
                                        cb.and(
                                                cb.equal(root.get("latitude"), k.latitude()),
                                                cb.equal(root.get("longitude"), k.longitude())
                                        )
                                )
                ).toList();

        // 4-2. 여러 조건을 OR로 묶어 하나의 Combined Specification으로 결합
        // => (lat1 AND lon1) OR (lat2 AND lon2) OR ...
        Specification<PartnerOrganization> combinedSpecs = specs.stream()
                .reduce(Specification::or)
                .orElse((root, q, cb) -> cb.disjunction());

        // 4-3. DB에서 해당 좌표들에 해당하는 기존 PartnerOrganization 조회
        List<PartnerOrganization> existing = welfareCenterRepository.findAll(combinedSpecs);

        // 4-4. 조회된 결과를 좌표 기반으로 Map에 정리 (Coordinate → PartnerOrganization)
        Map<Coordinate, PartnerOrganization> existingMap = existing.stream()
                .collect(Collectors.toMap(
                        wp -> new Coordinate(
                                wp.getLatitude(),
                                wp.getLongitude()
                        ),
                        wp -> wp
                ));

        List<PartnerOrganization> toSave = new ArrayList<>();

        //5. 저장할 데이터 생성 & 업데이트
        for(Map<String, String> row : rows) {
            Coordinate key = new Coordinate(Double.valueOf(row.get("latitude")), Double.valueOf(row.get("longitude")));
            PartnerOrganization org = existingMap.get(key);

            if(org != null)
            {
                if(!Objects.equals(org.getPhoneNumber(), row.get("phoneNumber")))
                {
                    //5-1. 새로 업로드 된 값으로 업데이트
                    PartnerOrganization patch = objectMapper.convertValue(row, PartnerOrganization.class);

                    PartnerOrganization updated = patch.toBuilder()
                                    .id(org.getId())
                                    .hangjungs(org.getHangjungs())
                                    .build();

                    toSave.add(updated);
                }
            }
            else
            {
                //5-2. 연관 관계가진 필드 제외하고 매핑
                PartnerOrganization newOrg = objectMapper.convertValue(row, PartnerOrganization.class);

                //5-3. 행정(@ManyToOne) 찾아주기
                String hanjungCode = row.get("hangjungCode");
                Hangjungs h = hangjungsRepository.findByHangjungCode(hanjungCode)
                        .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음" + hanjungCode));

                newOrg.assignHangjungs(h);

                toSave.add(newOrg);
            }

        }

        List<PartnerOrganization> saved = welfareCenterRepository.saveAll(toSave);

        return saved.stream()
                .map(e -> {
                    WelfareCenterResponseDTO wcDTO = objectMapper.convertValue(e, WelfareCenterResponseDTO.class);
                    wcDTO.setHangjungId(e.getHangjungs().getId());
                    return wcDTO;
                }).toList();
    }
}
