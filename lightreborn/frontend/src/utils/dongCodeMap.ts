// 양산시 행정동 코드와 이름 매핑
export interface DongInfo {
  code: string;    // 행정동 코드 (예: "4833025300")
  name: string;    // 행정동 이름 (예: "물금읍")
  fullName: string; // 전체 이름 (예: "경상남도 양산시 물금읍")
}

// 코드 -> 동 정보 매핑
export const dongCodeMap: Record<string, DongInfo> = {
  "48330110": { 
    code: "48330110", 
    name: "물금읍", 
    fullName: "경상남도 양산시 물금읍" 
  },
  "48330120": { 
    code: "48330120", 
    name: "동면", 
    fullName: "경상남도 양산시 동면" 
  },
  "48330130": { 
    code: "48330130", 
    name: "원동면", 
    fullName: "경상남도 양산시 원동면" 
  },
  "48330140": { 
    code: "48330140", 
    name: "상북면", 
    fullName: "경상남도 양산시 상북면" 
  },
  "48330150": { 
    code: "48330150", 
    name: "하북면", 
    fullName: "경상남도 양산시 하북면" 
  },
  "48330250": { 
    code: "48330250", 
    name: "중앙동", 
    fullName: "경상남도 양산시 중앙동" 
  },
  "48330253": { 
    code: "48330253", 
    name: "양주동", 
    fullName: "경상남도 양산시 양주동" 
  },
  "48330256": { 
    code: "48330256", 
    name: "삼성동", 
    fullName: "경상남도 양산시 삼성동" 
  },
  "48330259": { 
    code: "48330259", 
    name: "강서동", 
    fullName: "경상남도 양산시 강서동" 
  },
  "48330262": { 
    code: "48330262", 
    name: "서창동", 
    fullName: "경상남도 양산시 서창동" 
  },
  "48330265": { 
    code: "48330265", 
    name: "소주동", 
    fullName: "경상남도 양산시 소주동" 
  },
  "48330268": { 
    code: "48330268", 
    name: "평산동", 
    fullName: "경상남도 양산시 평산동" 
  },
  "48330271": { 
    code: "48330271", 
    name: "덕계동", 
    fullName: "경상남도 양산시 덕계동" 
  },
};

// 이름으로 조회할 수 있는 맵 생성
export const dongNameMap: Record<string, DongInfo> = 
  Object.values(dongCodeMap).reduce((acc, dongInfo) => {
    acc[dongInfo.name] = dongInfo;
    return acc;
  }, {} as Record<string, DongInfo>);

/**
 * 행정동 코드로 동 이름 조회
 * @param code 행정동 코드 (예: "4833025300")
 * @returns 행정동 이름 (예: "물금읍") 또는 코드를 찾을 수 없을 경우 null
 */
export function getDongNameByCode(code: string | null): string | null {
  if (!code) return null;
  return dongCodeMap[code]?.name || null;
}

/**
 * 행정동 이름으로 동 코드 조회
 * @param name 행정동 이름 (예: "물금읍")
 * @returns 행정동 코드 (예: "4833025300") 또는 이름을 찾을 수 없을 경우 null
 */
export function getDongCodeByName(name: string | null): string | null {
  if (!name) return null;
  return dongNameMap[name]?.code || null;
}

/**
 * 행정동 코드로 동 정보 전체 조회
 * @param code 행정동 코드 (예: "4833025300")
 * @returns DongInfo 객체 또는 코드를 찾을 수 없을 경우 null
 */
export function getDongInfoByCode(code: string | null): DongInfo | null {
  if (!code) return null;
  return dongCodeMap[code] || null;
}

/**
 * 행정동 이름으로 동 정보 전체 조회
 * @param name 행정동 이름 (예: "물금읍")
 * @returns DongInfo 객체 또는 이름을 찾을 수 없을 경우 null
 */
export function getDongInfoByName(name: string | null): DongInfo | null {
  if (!name) return null;
  return dongNameMap[name] || null;
}

// 다른 형식의 코드나 이름으로 매핑하는 경우를 위한 준비
export function initializeDongMap(geoJsonFeatures: any[]): void {
  // GeoJSON 데이터로부터 dongCodeMap을 동적으로 만듭니다.
  // 필요한 경우 추후 구현
} 