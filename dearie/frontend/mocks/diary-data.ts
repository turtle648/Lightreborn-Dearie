/**
 * 일기 목업 데이터
 */

import type { DiaryEntry, DiaryAnalysis } from "@/types/diary"

export const mockDiaries: DiaryEntry[] = [
  {
    id: 1,
    date: "2025-04-23T12:00:00Z",
    content:
      "오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다. 아무도 나를 기다리지 않는다는 생각이 들자, 하루를 시작할 이유가 없어 보였다. 하지만 창문 밖으로 들어오는 햇살이 내 얼굴을 비추자 조금씩 마음이 움직이기 시작했다.",
    image: "/images/window-view.png",
    emotion: "슬픔",
    likes: 5,
    comments: 2,
  },
  {
    id: 2,
    date: "2025-04-22T15:30:00Z",
    content:
      "카페 창밖으로 노을이 지는 모습을 바라보며 오랜만에 마음의 여유를 느꼈다. 따뜻한 차 한잔과 함께하는 시간이 소중하게 느껴졌다.",
    image: "/images/window-view-2.png",
    emotion: "평온",
    likes: 12,
    comments: 4,
  },
  {
    id: 3,
    date: "2025-04-21T18:45:00Z",
    content: "오랜만에 친구들과 만나 웃고 떠들었다. 일상의 소소한 이야기들이 이렇게 즐거울 수 있다는 것을 새삼 느꼈다.",
    image: "/backyard-friendship.png",
    emotion: "기쁨",
    likes: 8,
    comments: 1,
  },
]

export const mockDiaryAnalysis: DiaryAnalysis = {
  emotions: [
    { name: "슬픔", value: 65 },
    { name: "불안", value: 20 },
    { name: "평온", value: 15 },
  ],
  keywords: ["무기력", "고립감", "위안", "자기수용"],
  summary: "무기력함과 고립감을 느끼지만 자연과 여유를 통해 위안을 찾고 자기 수용으로 나아가는 과정이 담겨 있습니다.",
  recommendation: "가벼운 산책이나 명상을 통해 자연과 연결되는 시간을 더 가져보는 것이 도움이 될 수 있습니다.",
}

export const mockDiaryComments = [
  {
    id: 1,
    author: "마음지기",
    avatar: "/mystical-forest-spirit.png",
    content: "힘든 하루였지만 작은 빛을 발견한 것 같아요. 내일은 더 나아질 거예요.",
    date: "2025-04-23T14:30:00Z",
    likes: 3,
  },
  {
    id: 2,
    author: "나",
    avatar: "/diverse-professional-profiles.png",
    content: "맞아요, 작은 것에서 위안을 찾는 연습을 해야겠어요.",
    date: "2025-04-23T15:45:00Z",
    likes: 1,
  },
]
