package com.ssafy.backend.youth_population.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import com.ssafy.backend.youth_population.entity.YouthPopulation;
import com.ssafy.backend.youth_population.model.dto.response.YouthPopulationResponseDTO;
import com.ssafy.backend.youth_population.model.dto.vo.HangjungKey;
import com.ssafy.backend.youth_population.repository.HangjungsRepository;
import com.ssafy.backend.youth_population.repository.YouthPopulationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class YouthPopulationServiceImpl implements YouthPopulationService {

    private final List<RawFileParser> rawFileParsers;
    private RawFileParser fileParser;
    private final YouthPopulationRepository youthPopulationRepository;
    private final HangjungsRepository hangjungsRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<YouthPopulationResponseDTO> uploadAndProcess(MultipartFile file) throws IOException{

        //1. 알맞은 파서 선택
        fileParser = FileParserUtils.resolveParser(Objects.requireNonNull(file.getOriginalFilename()), rawFileParsers);

        Set<String> missing = FileParserUtils.findMissingHeaders(fileParser.extractHeaders(file), HeaderMapping.getHeaderMapping(FileType.POPULATION).keySet());
        if(!missing.isEmpty()) {
            log.error("올바르지 않은 청년 인구 데이터를 업로드했습니다.");
            throw new MissingHeadersException(missing);
        }

        return parseAndMapFile(file);
    }

    @Override
    public List<YouthPopulationResponseDTO> parseAndMapFile(MultipartFile file) throws IOException {

        //3. 파일 파싱
        List<Map<String, String>> rows = fileParser.parse(file, FileType.POPULATION);

        log.info("파싱 성공 Object Mapper entity 변환");

        //4. 기존 객체 조회
        Set<HangjungKey> hangjungKeySet = rows.stream()
                .map(r -> new HangjungKey(r.get("hangjungCode"), r.get("hangjungName")))
                .collect(Collectors.toSet());

        List<Specification<YouthPopulation>> specs = hangjungKeySet.stream()
                .map(k -> (Specification<YouthPopulation>) (root, q, cb) ->
                        cb.and(
                                cb.equal(root.get("hangjungs").get("hangjungCode"), k.hanjungCode()),
                                cb.equal(root.get("hangjungs").get("hangjungName"), k.hangjungName())
                        )
                )
                .toList();

        //4-2. 여러 Specification 을 OR로 묶기
        Specification<YouthPopulation> combinedSpec = specs.stream()
                .reduce(Specification::or)
                .orElse((root, q, cb) -> cb.disjunction());

        List<YouthPopulation> existing = youthPopulationRepository.findAll(combinedSpec);

        Map<HangjungKey, YouthPopulation> existingMap = existing.stream()
                .collect(Collectors.toMap(
                        yp -> new HangjungKey(
                                yp.getHangjungs().getHangjungCode(),
                                yp.getHangjungs().getHangjungName()
                        ),
                        yp->yp
                ));

        List<YouthPopulation> toSave = new ArrayList<>();

        //5. 저장할 데이터 생성 & 업데이트
        for(Map<String, String> row : rows) {
            HangjungKey key = new HangjungKey(row.get("hangjungCode"), row.get("hangjungName"));
            LocalDate incomingDate = LocalDate.parse(row.get("baseDate"));
            YouthPopulation yp = existingMap.get(key);

            if(yp != null)
            {
                if(incomingDate.isAfter(yp.getBaseDate()))
                {
                    //새로 업로드 된 값으로 업데이트
                    YouthPopulation patch = objectMapper.convertValue(row, YouthPopulation.class);

                    YouthPopulation updated = patch.toBuilder()
                            .id(yp.getId())
                            .hangjungs(yp.getHangjungs())
                            .build();

                    toSave.add(updated);
                }

            }
            else {
                // 1. 연관 관계가진 필드 제외하고 매핑
                YouthPopulation created = objectMapper.convertValue(row, YouthPopulation.class);

                //2. 행정(@ManyToOne) 찾아주기
                String hanjungCode = row.get("hangjungCode");
                Hangjungs h = hangjungsRepository.findByHangjungCode(hanjungCode)
                        .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음" + hanjungCode));

                created.assignHangjungs(h);

                toSave.add(created);
            }
        }

        List<YouthPopulation> saved = youthPopulationRepository.saveAll(toSave);

        return saved.stream()
                .map(e ->{
                    YouthPopulationResponseDTO ypDto = objectMapper.convertValue(e, YouthPopulationResponseDTO.class);
                    ypDto.setHangjungsId(e.getHangjungs().getId());

                    return ypDto;
                }).toList();
    }
}
