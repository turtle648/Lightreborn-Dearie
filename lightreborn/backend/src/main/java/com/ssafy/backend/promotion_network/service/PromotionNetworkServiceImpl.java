package com.ssafy.backend.promotion_network.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.exception.file.MissingHeadersException;
import com.ssafy.backend.common.utils.FileParserUtils;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import com.ssafy.backend.common.utils.parser.RawFileParser;
import com.ssafy.backend.promotion_network.entity.PromotionStatus;
import com.ssafy.backend.promotion_network.entity.PromotionType;
import com.ssafy.backend.promotion_network.model.response.*;
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
        Long hangjungId = hangjungsRepository.findHangjungsIdByHangjungCode(dongCode.toString());
        List<PromotionStatus> list = promotionStatusRepository.findByHangjungsId(hangjungId);
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

    @Override
    public Map<String, Double> calculatePromotionTypeRatio(Long dongCode) {

        List<PromotionResponseDTO> dtoList = selectPromotions(dongCode);

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
        Long hangjungId = hangjungsRepository.findHangjungsIdByHangjungCode(dongCode.toString());

        List<PromotionStatus> list = promotionStatusRepository.findByHangjungsId(hangjungId);
        List<PromotionResponseDTO> dtoList = list.stream().map(this::convertToDTO).toList();

        Map<String, Double> typeRatio = calculatePromotionTypeRatio(dongCode);

        PromotionSummaryResponse summary = new PromotionSummaryResponse();
        summary.setPromotions(dtoList);
        summary.setTypeRatio(typeRatio);
        summary.setPopulationPerPromotions(calculatePromotionPerYouth());
        return summary;
    }

    @Override
    public List<PromotionPerYouthDto> calculatePromotionPerYouth() {

        List<PromotionPerYouthDto> result = new ArrayList<>();

        List<Hangjungs> allHangjungs = hangjungsRepository.findAll();

        for (Hangjungs h : allHangjungs) {
            Long dongCode = Long.parseLong(h.getHangjungCode());
            Long hangjungId = h.getId();

            // 1. 홍보물 개수
            int promotionCount = promotionStatusRepository.findByHangjungsId(hangjungId).size();

            // 2. 청년 인구 수
            Optional<YouthPopulation> opt = youthPopulationRepository.findLatestByHangjungCode(dongCode);
            if (opt.isEmpty()) continue;

            int youthPop = opt.get().getYouthPopulation();

            // 3. 비율 계산
            double ratio = (youthPop == 0) ? 0.0 : (promotionCount * 100.0) / youthPop;
            double rounded = Math.round(ratio * 10.0) / 10.0;

            result.add(new PromotionPerYouthDto(dongCode, h.getHangjungName(), rounded));
        }
            return result;
    }


}
