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
import com.ssafy.backend.youth_population.repository.HangjungsRepository;
import com.ssafy.backend.youth_population.repository.YouthPopulationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class YouthPopulationServiceImpl implements YouthPopulationService {

    private final List<RawFileParser> rawFileParsers;
    private final YouthPopulationRepository youthPopulationRepository;
    private final HangjungsRepository hangjungsRepository;
    private final ObjectMapper objectMapper;
    private RawFileParser fileParser;
    private String extension;

    @Override
    public List<YouthPopulationResponseDTO> uploadAndProcess(MultipartFile file) throws IOException{

        //1. 알맞은 파서 선택
        fileParser = FileParserUtils.resolveParser(file.getOriginalFilename(), rawFileParsers);

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

        //4. 엔티티 매핑 및 저장
        List<YouthPopulation> entities = rows.stream()
                .map(row -> {

                    // 1. 연관 관계가진 필드 제외하고 매핑
                    YouthPopulation yp = objectMapper.convertValue(row, YouthPopulation.class);

                    //2. 행정(@ManyToOne) 찾아주기
                    String hanjungCode = row.get("hangjungCode");
                    Hangjungs h = hangjungsRepository.findByHangjungCode(hanjungCode)
                            .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음" + hanjungCode));

                    yp.assignHangjungs(h);
                    return yp;
                })
                .filter(yp -> !youthPopulationRepository.existsByHangjungs_Id(yp.getHangjungs().getId()))
                .toList();

        //DB에 저장
        List<YouthPopulation> saved = youthPopulationRepository.saveAll(entities);

        return saved.stream()
                .map(e ->{
                    YouthPopulationResponseDTO ypDto = objectMapper.convertValue(e, YouthPopulationResponseDTO.class);
                    ypDto.setHangjungsId(e.getHangjungs().getId());

                    return ypDto;
                }).toList();
    }
}
