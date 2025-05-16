package com.ssafy.backend.youth_population.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import com.ssafy.backend.youth_population.entity.YouthPopulation;
import com.ssafy.backend.youth_population.model.dto.response.*;
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

        // 4-1. 각 좌표(hangjungCode + hangjungName)에 대해 개별 검색 조건 Specification 생성
        List<Specification<YouthPopulation>> specs = hangjungKeySet.stream()
                .map(k -> (Specification<YouthPopulation>) (root, q, cb) ->
                        cb.and(
                                cb.equal(root.get("hangjungs").get("hangjungCode"), k.hanjungCode()),
                                cb.equal(root.get("hangjungs").get("hangjungName"), k.hangjungName())
                        )
                )
                .toList();

        // 4-2. 여러 조건을 OR로 묶어 하나의 Combined Specification으로 결합
        // => (code1 AND name1) OR (code2 AND name2) OR ...
        Specification<YouthPopulation> combinedSpec = specs.stream()
                .reduce(Specification::or)
                .orElse((root, q, cb) -> cb.disjunction());

        // 4-3. DB에서 해당 좌표들에 해당하는 기존 YouthPopulation 조회
        List<YouthPopulation> existing = youthPopulationRepository.findAll(combinedSpec);

        // 4-4. 조회된 결과를 좌표 기반으로 Map에 정리 (HangjungKey → YouthPopulation)
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
                    //5-1. 새로 업로드 된 값으로 업데이트
                    YouthPopulation patch = objectMapper.convertValue(row, YouthPopulation.class);

                    YouthPopulation updated = patch.toBuilder()
                            .id(yp.getId())
                            .hangjungs(yp.getHangjungs())
                            .build();

                    toSave.add(updated);
                }

            }
            else {
                //5-2. 연관 관계가진 필드 제외하고 매핑
                YouthPopulation created = objectMapper.convertValue(row, YouthPopulation.class);

                //5-3. 행정(@ManyToOne) 찾아주기
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

    @Override
    public YouthHouseholdRatioDTO getYouthHouseholdRatioByDongCode(Long dongCode) {
        YouthPopulation yp = youthPopulationRepository.findLatestByHangjungCode(dongCode)
                .orElseThrow(() -> new IllegalArgumentException("해당 행정동의 인구 데이터가 없습니다."));

        // 선택한 행정동의 청년 1인 가구 비율
        float ratio = (float) yp.getYouthHouseholdCount() / yp.getYouthPopulation() * 100;
        // 선택한 행정동의 청년 1인 가구 성비
        float maleRatio = (float) yp.getYouthMaleHouseholdCount() / yp.getYouthMalePopulation() * 100;
        float femaleRatio = (float) yp.getYouthFemaleHouseholdCount() / yp.getYouthFemalePopulation() * 100;

        return YouthHouseholdRatioDTO.builder()
                .youthSingleHouseholdRatio(
                        YouthHouseholdRatioDTO.Ratio.builder()
                                .unit("%")
                                .value(round(ratio))
                                .male(round(maleRatio))
                                .female(round(femaleRatio))
                                .build()
                )
                .build();
    }

    @Override
    public YouthStatsByRegionDTO getYouthDistributionByDongCode(Long dongCode) throws IOException {
        YouthPopulation yp = youthPopulationRepository.findLatestByHangjungCode(dongCode)
                .orElseThrow(() -> new IllegalArgumentException("해당 행정동의 인구 데이터가 없습니다."));

        // 전체 양산시 청년 인구 수
        int dongYouthPop = yp.getYouthPopulation();
        int totalYouthPop = youthPopulationRepository.sumAllYouthPopulation();
        float ratio = (float) dongYouthPop / totalYouthPop * 100;

        return YouthStatsByRegionDTO.builder()
                .region(yp.getHangjungs().getHangjungName())
                .youthPopulationRatio(
                        YouthStatsByRegionDTO.Ratio.builder()
                                .unit("%")
                                .value(round(ratio))
                                .build()
                )
                .build();
    }

    @Override
    public List<YouthRegionDistributionDTO> getYouthDistributionAllRegions() throws IOException {
        List<YouthPopulation> all = youthPopulationRepository.findLatestYouthPopulations();

        // 가장 최신 날짜 데이터만 고려해 필터링
        Map<String, YouthPopulation> latestByRegion = all.stream()
                .collect(Collectors.toMap(
                        yp -> yp.getHangjungs().getHangjungName(),
                        yp -> yp,
                        (yp1, yp2) -> yp1.getBaseDate().isAfter(yp2.getBaseDate()) ? yp1 : yp2
                ));

        return latestByRegion.values().stream().map(yp -> {
            float ratio = (float) yp.getYouthPopulation() / 1000f;
            return YouthRegionDistributionDTO.builder()
                    .region(yp.getHangjungs().getHangjungName())
                    .perPopulation(round(ratio))
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public YouthDashboardSummaryDTO getInitialDashboardData() throws IOException {
        List<YouthPopulation> latestYouthPopulations = youthPopulationRepository.findLatestYouthPopulations();

        // 바로 stream 처리
        List<YouthRegionDistributionDTO> regionData = latestYouthPopulations.stream().map(yp -> {
            float ratio = (float) yp.getYouthPopulation() / 1000f;
            return YouthRegionDistributionDTO.builder()
                    .region(yp.getHangjungs().getHangjungName())
                    .perPopulation(round(ratio))
                    .build();
        }).toList();

        float max = regionData.stream().map(YouthRegionDistributionDTO::getPerPopulation).max(Float::compare).orElse(0f);
        float min = regionData.stream().map(YouthRegionDistributionDTO::getPerPopulation).min(Float::compare).orElse(0f);

        YouthPopulation central = youthPopulationRepository.findLatestByHangjungCode(48330250L)
                .orElseThrow(() -> new IllegalArgumentException("행정동 코드 [48330250]에 해당하는 인구 데이터가 없습니다."));

        float youthRatio = (float) central.getYouthPopulation() / youthPopulationRepository.sumAllYouthPopulation() * 100;

        YouthHouseholdRatioDTO.Ratio householdRatio = getYouthHouseholdRatioByDongCode(48330250L).getYouthSingleHouseholdRatio();
        YouthStatsByRegionDTO.HouseholdRatio convertedHouseholdRatio = YouthStatsByRegionDTO.HouseholdRatio.builder()
                .unit(householdRatio.getUnit())
                .value(householdRatio.getValue())
                .male(householdRatio.getMale())
                .female(householdRatio.getFemale())
                .build();

        return YouthDashboardSummaryDTO.builder()
                .ratioByAdministrativeDistrict(YouthDashboardSummaryDTO.RatioByAdministrativeDistrict.builder()
                        .baseDate(central.getBaseDate())
                        .unitLabel("천명당 비율 (%)")
                        .regionData(regionData)
                        .maxValue(round(max))
                        .minValue(round(min))
                        .build())
                .youthStatsByRegion(YouthStatsByRegionDTO.builder()
                        .region(central.getHangjungs().getHangjungName())
                        .youthPopulationRatio(YouthStatsByRegionDTO.Ratio.builder()
                                .unit("%")
                                .value(round(youthRatio))
                                .build())
                        .youthSingleHouseholdRatio(convertedHouseholdRatio)
                .build())
                .build();
    }


    @Override
    public List<YouthPopulationRecentDataDTO> getYouthPopulationRecentData() throws IOException {
        List<YouthPopulation> latestData = youthPopulationRepository.findLatestYouthPopulations();
        int totalYouth = latestData.stream()
                .mapToInt(yp -> yp.getYouthPopulation() != null ? yp.getYouthPopulation() : 0)
                .sum();

        return latestData.stream().map(yp -> {

            int youth = yp.getYouthPopulation() != null ? yp.getYouthPopulation() : 0;
            int male = yp.getYouthMalePopulation() != null ? yp.getYouthMalePopulation() : 0;
            int female = yp.getYouthFemalePopulation() != null ? yp.getYouthFemalePopulation() : 0;

            int onePerson = yp.getYouthHouseholdCount() != null ? yp.getYouthHouseholdCount() : 0;
            int maleOne = yp.getYouthMaleHouseholdCount() != null ? yp.getYouthMaleHouseholdCount() : 0;
            int femaleOne = yp.getYouthFemaleHouseholdCount() != null ? yp.getYouthFemaleHouseholdCount() : 0;

            return YouthPopulationRecentDataDTO.builder()
                    .baseDate(yp.getBaseDate())
                    .dongName(yp.getHangjungs().getHangjungName())
                    .dongCode(yp.getHangjungs().getHangjungCode())
                    .youthPopulation(youth)
                    .maleYouth(male)
                    .femaleYouth(female)
                    .youthOnePersonHousehold(onePerson)
                    .maleOnePersonHousehold(maleOne)
                    .femaleOnePersonHousehold(femaleOne)
                    .build();
        }).toList();
    }

    // 비율 계산 : 소수점 아래 한 자리 나타나게 반올림
    private float round(float value) {
        return Math.round(value * 10f) / 10f;
    }
}
