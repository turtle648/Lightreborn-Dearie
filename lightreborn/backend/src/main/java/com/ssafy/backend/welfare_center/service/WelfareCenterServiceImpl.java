package com.ssafy.backend.welfare_center.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.common.vo.Coordinate;
import com.ssafy.backend.welfare_center.entity.PartnerOrganization;
import com.ssafy.backend.welfare_center.model.response.*;
import com.ssafy.backend.welfare_center.repository.WelfareCenterRepository;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import com.ssafy.backend.youth_population.entity.YouthPopulation;
import com.ssafy.backend.youth_population.repository.HangjungsRepository;
import com.ssafy.backend.youth_population.repository.YouthPopulationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final YouthPopulationRepository youthPopulationRepository;
    private final HangjungsRepository hangjungsRepository;

    @Override
    public List<WelfareCenterDTO> uploadAndProcess(MultipartFile file) throws IOException {

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
    public List<WelfareCenterDTO> parseAndMapFile(MultipartFile file) throws IOException {

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
                    WelfareCenterDTO wcDTO = objectMapper.convertValue(e, WelfareCenterDTO.class);
                    wcDTO.setHangjungId(e.getHangjungs().getId());
                    return wcDTO;
                }).toList();
    }

    /**
     * 전체 협력기관 위치 조회
     */
    @Override
    public List<WelfareCenterLocationDTO> getAllWelfareCenterLocations() {
        return welfareCenterRepository.findAll().stream()
                .map(center -> WelfareCenterLocationDTO.builder()
                        .organizationName(center.getOrganizationName())
                        .latitude(center.getLatitude())
                        .longitude(center.getLongitude())
                        .build())
                .toList();
    }

    /**
     * 특정 행정동의 협력기관 위치 조회
     */
    @Override
    public List<WelfareCenterLocationDTO> getWelfareCenterLocationsByDong(String dongCode) {
        Hangjungs hangjungs = hangjungsRepository.findByHangjungCode(dongCode)
                .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음: " + dongCode));
        Long hangjungsId = hangjungs.getId();
        return welfareCenterRepository.findByHangjungsId(hangjungsId).stream()
                .map(center -> WelfareCenterLocationDTO.builder()
                        .organizationName(center.getOrganizationName())
                        .latitude(center.getLatitude())
                        .longitude(center.getLongitude())
                        .build())
                .toList();
    }

    /**
     * 행정동별 청년 인구 1만명당 협력기관 수 계산
     */
    @Override
    public List<WelfareCenterYouthStatsDTO> getYouthRatioByDong(String dongCode) {
        Hangjungs hangjungs = hangjungsRepository.findByHangjungCode(dongCode)
                .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음: " + dongCode));
        Long hangjungsId = hangjungs.getId();
        // 행정동 청년 인구 합계 계산
        int youthPopulation = youthPopulationRepository.findAll().stream()
                .filter(p -> p.getHangjungs().getId().equals(hangjungsId))
                .mapToInt(YouthPopulation::getYouthPopulation)
                .sum();
        // 행정동 협력기관 수
        long centerCount = welfareCenterRepository.countByHangjungsId(hangjungsId);
        // 비율 계산
        double ratio = youthPopulation != 0 ? (double) centerCount / youthPopulation * 10_000 : 0.0;
        // 행정동 이름 조회
        String regionName = hangjungs.getHangjungName();
        return List.of(WelfareCenterYouthStatsDTO.builder()
                .regionCode(hangjungsId)
                .regionName(regionName)
                .averageValue(null)
                .regionValue(round(ratio))
                .build());
    }

    /**
     * 행정동별 평균 대비 협력기관 현황 계산
     */
    @Override
    public List<WelfareCenterYouthStatsDTO> getAverageComparisonByDong(String dongCode) {
        Hangjungs hangjungs = hangjungsRepository.findByHangjungCode(dongCode)
                .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음: " + dongCode));
        Long hangjungsId = hangjungs.getId();
        List<YouthPopulation> allPopulations = youthPopulationRepository.findAll();
        // 전체 청년 인구 합계
        int totalYouthPopulation = allPopulations.stream()
                .mapToInt(YouthPopulation::getYouthPopulation)
                .sum();
        // 전체 협력기관 수
        long totalCenterCount = welfareCenterRepository.count();
        // 전체 평균 비율
        double averageRatio = totalYouthPopulation != 0 ? (double) totalCenterCount / totalYouthPopulation * 10_000 : 0.0;
        // 해당 행정동 데이터
        int youthPopulation = allPopulations.stream()
                .filter(p -> p.getHangjungs().getId().equals(hangjungsId))
                .mapToInt(YouthPopulation::getYouthPopulation)
                .sum();
        long centerCount = welfareCenterRepository.countByHangjungsId(hangjungsId);
        double regionRatio = youthPopulation != 0 ? (double) centerCount / youthPopulation * 10_000 : 0.0;
        String regionName = hangjungs.getHangjungName();
        return List.of(WelfareCenterYouthStatsDTO.builder()
                .regionCode(hangjungsId)
                .regionName(regionName)
                .averageValue(round(averageRatio))
                .regionValue(round(regionRatio))
                .build());
    }

    /**
     * 특정 행정동 협력기관 상세 리스트
     */
    @Override
    public List<WelfareCenterDetailDTO> getWelfareCenterDetailsByDong(String dongCode) {
        Hangjungs hangjungs = hangjungsRepository.findByHangjungCode(dongCode)
                .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음: " + dongCode));
        Long hangjungsId = hangjungs.getId();
        return welfareCenterRepository.findByHangjungsId(hangjungsId).stream()
                .map(center -> WelfareCenterDetailDTO.builder()
                        .id(center.getId())
                        .hangjungId(center.getHangjungs().getId())
                        .address(center.getAddress())
                        .organizationName(center.getOrganizationName())
                        .type(center.getType())
                        .phoneNumber(center.getPhoneNumber())
                        .build())
                .toList();
    }

    /**
     * 전체 협력기관 상세 리스트
     */
    @Override
    public List<WelfareCenterDetailDTO> getAllWelfareCenterDetails() {
        return welfareCenterRepository.findAll().stream()
                .map(center -> WelfareCenterDetailDTO.builder()
                        .id(center.getId())
                        .hangjungId(center.getHangjungs().getId())
                        .address(center.getAddress())
                        .organizationName(center.getOrganizationName())
                        .type(center.getType())
                        .phoneNumber(center.getPhoneNumber())
                        .build())
                .toList();
    }

    /**
     * 전체 협력기관 상세 리스트 다운로드
     */
    @Override
    public List<WelfareCenterExportDTO> getAllWelfareCenterExportData() {
        List<PartnerOrganization> entities = welfareCenterRepository.findAll();
        return entities.stream().map(p -> {
            WelfareCenterExportDTO dto = new WelfareCenterExportDTO();
            dto.setOrganizationName(p.getOrganizationName());
            dto.setType(p.getType());
            dto.setAddress(p.getAddress());
            dto.setPhoneNumber(p.getPhoneNumber());
            return dto;
        }).toList();
    }

    /**
     * 대시보드 통합 요약 데이터
     */
    @Override
    public WelfareCenterSummaryDTO getDashboardSummary() {
        List<YouthPopulation> allPopulations = youthPopulationRepository.findAll();
        List<PartnerOrganization> allCenters = welfareCenterRepository.findAll();

        // 1. 전체 청년 인구 합계
        int totalYouthPop = allPopulations.stream()
                .mapToInt(YouthPopulation::getYouthPopulation)
                .sum();

        // 2. 전체 협력기관 수
        long totalCenterCount = allCenters.size();

        // 3. 평균 계산
        double averageRatio = totalYouthPop != 0 ? (double) totalCenterCount / totalYouthPop * 10_000 : 0.0;
        averageRatio = round(averageRatio);

        // 4. 행정동별 통계 계산
        Map<Long, Integer> youthPopMap = allPopulations.stream()
                .collect(Collectors.groupingBy(
                        yp -> yp.getHangjungs().getId(),
                        Collectors.summingInt(YouthPopulation::getYouthPopulation)
                ));

        Map<Long, String> regionNameMap = hangjungsRepository.findAll().stream()
                .collect(Collectors.toMap(Hangjungs::getId, Hangjungs::getHangjungName));

        Map<Long, Long> centerCountMap = allCenters.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getHangjungs().getId(),
                        Collectors.counting()
                ));

        List<WelfareCenterYouthStatsDTO> perRegionStats = youthPopMap.entrySet().stream()
                .map(entry -> {
                    Long regionId = entry.getKey();
                    int youthPop = entry.getValue();
                    long centerCount = centerCountMap.getOrDefault(regionId, 0L);
                    double ratio = youthPop != 0 ? (double) centerCount / youthPop * 10_000 : 0.0;
                    return WelfareCenterYouthStatsDTO.builder()
                            .regionCode(regionId)
                            .regionName(regionNameMap.getOrDefault(regionId, "알 수 없음"))
                            .regionValue(round(ratio))
                            .build();
                })
                .toList();

        // 5. exportDetails 추가
        List<WelfareCenterExportDTO> exportDetails = getAllWelfareCenterExportData();

        // 6. 요약 DTO 빌드
        return WelfareCenterSummaryDTO.builder()
                .locations(getAllWelfareCenterLocations())
                .averageValue(averageRatio)
                .perRegionStats(perRegionStats)
                .details(getAllWelfareCenterDetails())
                .exportDetails(exportDetails)
                .build();
    }

    /**
     * 소수점 1자리 반올림 유틸 메서드
     */
    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
