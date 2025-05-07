import { useMapStore } from '@/stores/useMapStore';
import { getDongInfoByCode, getDongNameByCode, DongInfo } from '@/utils/dongCodeMap';
import { useMemo } from 'react';

/**
 * 현재 선택된 행정동 정보를 가져오는 커스텀 훅
 * @returns 선택된 행정동 관련 정보와 유틸리티 함수
 */
export function useDongInfo() {
  const { selectedDongCode } = useMapStore();

  // 선택된 행정동 정보 (코드를 기반으로 계산)
  const selectedDongInfo = useMemo<DongInfo | null>(() => {
    return getDongInfoByCode(selectedDongCode);
  }, [selectedDongCode]);

  // 선택된 행정동 이름 (간단한 접근용)
  const selectedDongName = useMemo<string | null>(() => {
    return getDongNameByCode(selectedDongCode);
  }, [selectedDongCode]);

  return {
    // 선택된 행정동 정보
    selectedDongCode,
    selectedDongName,
    selectedDongInfo,
    
    // 행정동 선택 여부
    isSelected: !!selectedDongCode,
    
    // 다른 파라미터 추가 가능
  };
} 