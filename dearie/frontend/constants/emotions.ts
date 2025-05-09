/**
 * 감정 관련 상수
 */

export interface Emotion {
  name: string
  emoji: string
  color: string
  description: string
}

export const EMOTIONS: Emotion[] = [
  {
    name: "기쁨",
    emoji: "😊",
    color: "#FFD700",
    description: "행복하고 만족스러운 감정",
  },
  {
    name: "슬픔",
    emoji: "😢",
    color: "#6495ED",
    description: "상실감이나 실망감을 느끼는 감정",
  },
  {
    name: "화남",
    emoji: "😠",
    color: "#FF6347",
    description: "분노나 짜증을 느끼는 감정",
  },
  {
    name: "불안",
    emoji: "😰",
    color: "#FFA500",
    description: "걱정이나 두려움을 느끼는 감정",
  },
  {
    name: "평온",
    emoji: "😌",
    color: "#98FB98",
    description: "차분하고 안정된 감정",
  },
  {
    name: "지루함",
    emoji: "😑",
    color: "#A9A9A9",
    description: "흥미나 관심이 없는 감정",
  },
  {
    name: "설렘",
    emoji: "😍",
    color: "#FF69B4",
    description: "기대감이나 흥분을 느끼는 감정",
  },
  {
    name: "감사",
    emoji: "🙏",
    color: "#9370DB",
    description: "고마움을 느끼는 감정",
  },
  {
    name: "놀람",
    emoji: "😲",
    color: "#00BFFF",
    description: "예상치 못한 일에 대한 반응",
  },
  {
    name: "혼란",
    emoji: "😵",
    color: "#BA55D3",
    description: "이해하기 어렵거나 복잡한 상황에서 느끼는 감정",
  },
  {
    name: "희망",
    emoji: "🌈",
    color: "#87CEEB",
    description: "좋은 일이 일어날 것이라는 기대감",
  },
  {
    name: "피곤",
    emoji: "😴",
    color: "#778899",
    description: "에너지가 부족하거나 지친 상태",
  },
]
