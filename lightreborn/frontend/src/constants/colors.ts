// 대시보드 전체에서 사용할 색상 테마
export const colors = {
  // 주요 색상
  primary: {
    light: "#E8F1FF",
    main: "#6B9AFF",
    dark: "#4B7BFF",
    contrastText: "#FFFFFF",
  },
  // 보조 색상
  secondary: {
    light: "#FFF8E6",
    main: "#FFD166",
    dark: "#FFBA33",
    contrastText: "#333333",
  },
  // 상태 색상
  status: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#FF5252",
    info: "#2196F3",
    pending: "#9E9E9E",
  },
  // 차트 색상
  chart: {
    blue: "#6B9AFF",
    lightBlue: "#A1C0FF",
    yellow: "#FFD166",
    orange: "#FF9F66",
    purple: "#B57EDC",
    green: "#66D7B8",
    gray: "#E0E0E0",
    lightGray: "#F5F5F5",
  },
  // 텍스트 색상
  text: {
    primary: "#333333",
    secondary: "#757575",
    disabled: "#BDBDBD",
    hint: "#9E9E9E",
  },
  // 배경 색상
  background: {
    default: "#FFFFFF",
    paper: "#F9FAFC",
    light: "#F5F7FA",
  },
  // 테이블 색상
  table: {
    header: "#F5F7FA",
    border: "#E0E0E0",
    hover: "#F9FAFC",
  },
}

// 상담 유형별 색상
export const consultationTypeColors = {
  정기상담: colors.chart.blue,
  초기상담: colors.chart.orange,
  위기상담: colors.chart.purple,
}

// 지역별 색상
export const regionColors = {
  양주동: colors.chart.blue,
  물금읍: colors.chart.lightGray,
  동면: colors.chart.lightBlue,
  삼성동: colors.chart.gray,
  평산동: colors.chart.gray,
  덕계동: colors.chart.gray,
  상북면: colors.chart.gray,
  중앙동: colors.chart.gray,
  하북면: colors.chart.gray,
  서창동: colors.chart.gray,
  강서동: colors.chart.gray,
  소주동: colors.chart.gray,
  원동면: colors.chart.gray,
}

// 성별 색상
export const genderColors = {
  남: "#6B9AFF",
  여: "#FF9F66",
}

// 홍보 유형별 색상
export const promotionTypeColors = {
  편의점: colors.chart.gray,
  마트: colors.chart.yellow,
  카페: colors.chart.gray,
  PC방: colors.chart.gray,
  학교: colors.chart.gray,
  현수막: colors.chart.gray,
}
