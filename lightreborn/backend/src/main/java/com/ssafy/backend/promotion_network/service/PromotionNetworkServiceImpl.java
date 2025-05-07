package com.ssafy.backend.promotion_network.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.promotion_network.entity.PromotionStatus;
import com.ssafy.backend.promotion_network.entity.PromotionType;
import com.ssafy.backend.promotion_network.model.response.PromotionDetailByRegionDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionNetworkResponseDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionResponseDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionSummaryResponse;
import com.ssafy.backend.promotion_network.repository.PromotionStatusRepository;
import com.ssafy.backend.promotion_network.repository.PromotionTypeRepository;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import com.ssafy.backend.youth_population.entity.YouthPopulation;
import com.ssafy.backend.youth_population.repository.HangjungsRepository;
import com.ssafy.backend.youth_population.repository.YouthPopulationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromotionNetworkServiceImpl implements PromotionNetworkService {

    private final List<RawFileParser> rawFileParsers;
    private final YouthPopulationRepository youthPopulationRepository;
    private RawFileParser fileParser;
    private final ObjectMapper objectMapper;
    private final HangjungsRepository hangjungsRepository;
    private final PromotionTypeRepository promotionTypeRepository;
    private final PromotionStatusRepository promotionStatusRepository;

    @Override
    public List<PromotionNetworkResponseDTO> uploadAndProcess(MultipartFile file) throws IOException {
        //1. 알맞은 파서 선택
        fileParser = FileParserUtils.resolveParser(Objects.requireNonNull(file.getOriginalFilename()), rawFileParsers);

        //2. 파일 유효성 검증
        Set<String> missing = FileParserUtils.findMissingHeaders(fileParser.extractHeaders(file), HeaderMapping.getHeaderMapping(FileType.PROMOTION).keySet());
        if(!missing.isEmpty()) {
            log.error("올바르지 않은 홍보 네트워크망 데이터를 업로드했습니다.");
            throw new MissingHeadersException(missing);
        }

        return parseAndMapFile(file);
    }

    @Override
    public List<PromotionNetworkResponseDTO> parseAndMapFile(MultipartFile file) throws IOException {

        //3. 파일 파싱
        List<Map<String, String>> rows = fileParser.parse(file, FileType.PROMOTION);

        log.info("파싱 성공 Object Mapper entity 변환");

        //4. 기존 객체 조회
        Set<String> addresses = rows.stream()
                .map(r -> r.get("address"))
                .collect(Collectors.toSet());
        List<PromotionStatus> existingList = promotionStatusRepository.findAllByAddressIn(addresses);
        Map<String, PromotionStatus> exisitingMap = existingList.stream()
                .collect(Collectors.toMap(PromotionStatus::getAddress, ps -> ps));
        
        List<PromotionStatus> toSave = new ArrayList<>();

        //5. 저장할 데이터 생성 & 업데이트
        for(Map<String, String> row : rows) {
            String address = row.get("address");
            PromotionStatus existing = exisitingMap.get(address);

            //5-1. 변경시각 확인
            LocalDate newTime = LocalDate.parse(row.get("createdAt"));

            if(existing != null) {

                boolean isNewer = newTime.isAfter(existing.getCreatedAt());
                if(isNewer)
                {
                    //5-2. 업데이트가 필요한 정보면 업데이트
                    Boolean isPublished = Boolean.valueOf(row.get("isPublished"));
                    String updatedPromotionType = row.get("promotionType");

                    PromotionType newPromotionType = promotionTypeRepository
                            .findByType(updatedPromotionType)
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "유효하지 않은 홍보 유형: " + updatedPromotionType
                            ));

                    PromotionStatus updated = existing.toBuilder()
                            // 새 PromotionType 엔티티를 그대로 주입
                            .promotionType(newPromotionType)
                            // 게시 상태 변경
                            .isPublished(isPublished)
                            .createdAt(newTime)
                            .build();

                    toSave.add(updated);
                }
            }
            else {
                //5-3. 업데이트가 필요하지않고 새로 생성되어야 하는 entity면 추가
                
                PromotionStatus created = objectMapper.convertValue(row, PromotionStatus.class);

                //6-1. 행정(@ManyToOne) 찾아주기
                String hangjungCode = row.get("hangjungCode");
                Hangjungs h = hangjungsRepository.findByHangjungCode(hangjungCode)
                        .orElseThrow(() -> new EntityNotFoundException("행정동을 찾을 수 없음" + hangjungCode));

                //6-2. 프로모션타입(@ManyToOne) 찾아주기
                String promotionType = row.get("promotionType");
                PromotionType pt = promotionTypeRepository.findByType(promotionType)
                        .orElseThrow(() -> new EntityNotFoundException("홍보 유형을 찾을 수 없음" + promotionType));

                created.assignHangjungs(h);
                created.assignPromotionType(pt);

                toSave.add(created);
            }
        }

        //7. DB에 저장
        List<PromotionStatus> saved = promotionStatusRepository.saveAll(toSave);

        //8. DTO 반환
        return saved.stream()
                .map(e ->{
                    PromotionNetworkResponseDTO psDto = objectMapper.convertValue(e, PromotionNetworkResponseDTO.class);
                    psDto.setHangjungId(e.getHangjungs().getId());
                    psDto.setPromotionTypeId(e.getPromotionType().getId());
                    return psDto;
                }).toList();
    }

    @Override
    public List<PromotionResponseDTO> selectPromotions(Long dongCode) {
        List<PromotionStatus> list = promotionStatusRepository.findByHangjungsId((long) dongCode);
        return list.stream().map(this::convertToDTO).toList();
    }

    // entity -> DTO로 형변환
    private PromotionResponseDTO convertToDTO(PromotionStatus status) {
        PromotionResponseDTO dto = new PromotionResponseDTO();
        dto.setAddress(status.getAddress());
        dto.setIsPublished(status.getIsPublished());
        dto.setCreatedAt(status.getCreatedAt());

        // 문자열로 매핑
        if (status.getPromotionType() != null) {
            dto.setPromotionType(status.getPromotionType().getType()); // 예: 약국
        } else {
            dto.setPromotionType(null); // 혹시모를 예외 처리
        }

        return dto; // 연관 관계 주의
    }

    public Map<String, Double> calculatePromotionTypeRatio(List<PromotionResponseDTO> dtoList) {
        int total = dtoList.size();

        // 타입별 개수 집계
        Map<String, Long> countMap = dtoList.stream()
                .filter(dto -> dto.getPromotionType() != null)
                .collect(Collectors.groupingBy(PromotionResponseDTO::getPromotionType, Collectors.counting()));

        // 비율로 변환 (소수점 첫째 자리까지)
        Map<String, Double> ratioMap = new HashMap<>();
        for (Map.Entry<String, Long> entry : countMap.entrySet()) {
            double ratio = (entry.getValue() * 100.0) / total;
            ratioMap.put(entry.getKey(), Math.round(ratio * 10.0) / 10.0); // 반올림: 10.0 = 소수점 첫째자리
        }

        return ratioMap;
    }

    public PromotionSummaryResponse getPromotionSummary(Long dongCode) {
        List<PromotionStatus> list = promotionStatusRepository.findByHangjungsId((long) dongCode);
        List<PromotionResponseDTO> dtoList = list.stream().map(this::convertToDTO).toList();

        Map<String, Double> typeRatio = calculatePromotionTypeRatio(dtoList);

        PromotionSummaryResponse summary = new PromotionSummaryResponse();
        summary.setPromotions(dtoList);
        summary.setTypeRatio(typeRatio);
        return summary;
    }


    @Override
    public PromotionDetailByRegionDTO getPromotionDetail(Long dongCode) throws IOException {
        // 1. 홍보물 리스트 조회
        List<PromotionStatus> statusList = promotionStatusRepository.findByHangjungsId(dongCode);
        List<PromotionResponseDTO> dtoList = statusList.stream()
                .map(this::convertToDTO)
                .toList();

        // 2. 유형별 개수 집계
        Map<String, Integer> typeCountMap = new HashMap<>();
        for (PromotionResponseDTO dto : dtoList) {
            typeCountMap.merge(dto.getPromotionType(), 1, Integer::sum);
        }

        // 3. 청년 인구 수 및 비율
        YouthPopulation yp = youthPopulationRepository.findLatestByHangjungCode(dongCode)
                .orElseThrow(() -> new IllegalArgumentException("해당 행정동의 인구 데이터가 없습니다."));
        int youthPopulation = yp.getYouthPopulation();
        int totalYouthPopulation = youthPopulationRepository.sumAllYouthPopulation();
        double youthRatio = (double) youthPopulation / totalYouthPopulation * 100;

        // 4. 홍보물 / 청년 수
        double promotionPerYouth = youthPopulation == 0 ? 0.0 :
                (double) dtoList.size() / youthPopulation;

        return PromotionDetailByRegionDTO.builder()
                .region(yp.getHangjungs().getHangjungName())
                .regionCode(yp.getHangjungs().getId())
                .youthPopulation(youthPopulation)
                .youthRatio(String.format("%.1f", youthRatio))
                .promotionCount(dtoList.size())
                .promotionPerYouth(Math.round(promotionPerYouth * 1000.0) / 1000.0) // 소수점 셋째자리
                .promotionList(dtoList)
                .promotionTypeDistribution(typeCountMap)
                .build();
    }


}
