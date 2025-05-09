/**
 * 일기 관련 API 호출 함수
 */

import type { DiaryEntry, DiaryAnalysis } from "@/types/diary"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

/**
 * 일기 목록을 가져오는 함수
 */
export async function getDiaries(page = 1, limit = 10): Promise<DiaryEntry[]> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/diaries?page=${page}&limit=${limit}`)
    // if (!response.ok) throw new Error('Failed to fetch diaries')
    // return await response.json()

    // 오프라인 지원을 위한 로컬 스토리지 폴백
    if (typeof window !== "undefined") {
      const storedDiaries = localStorage.getItem("diaries")
      if (storedDiaries) {
        const allDiaries = JSON.parse(storedDiaries) as DiaryEntry[]
        return allDiaries.slice((page - 1) * limit, page * limit)
      }
    }

    // 목업 데이터 반환
    return getMockDiaries()
  } catch (error) {
    console.error("일기 목록을 가져오는 중 오류 발생:", error)
    return getMockDiaries()
  }
}

/**
 * 특정 일기를 가져오는 함수
 */
export async function getDiary(id: string | number): Promise<DiaryEntry | null> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/diaries/${id}`)
    // if (!response.ok) throw new Error('Failed to fetch diary')
    // return await response.json()

    // 오프라인 지원을 위한 로컬 스토리지 폴백
    if (typeof window !== "undefined") {
      const storedDiaries = localStorage.getItem("diaries")
      if (storedDiaries) {
        const allDiaries = JSON.parse(storedDiaries) as DiaryEntry[]
        const diary = allDiaries.find((d) => d.id.toString() === id.toString())
        if (diary) return diary
      }
    }

    // 목업 데이터에서 찾기
    const mockDiaries = getMockDiaries()
    return mockDiaries.find((d) => d.id.toString() === id.toString()) || null
  } catch (error) {
    console.error(`ID ${id}의 일기를 가져오는 중 오류 발생:`, error)
    return null
  }
}

/**
 * 일기를 저장하는 함수
 */
export async function saveDiary(diary: Omit<DiaryEntry, "id" | "date">): Promise<DiaryEntry> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/diaries`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(diary)
    // })
    // if (!response.ok) throw new Error('Failed to save diary')
    // return await response.json()

    // 오프라인 지원을 위한 로컬 스토리지 저장
    if (typeof window !== "undefined") {
      const storedDiaries = localStorage.getItem("diaries")
      const allDiaries = storedDiaries ? (JSON.parse(storedDiaries) as DiaryEntry[]) : []

      const newDiary: DiaryEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...diary,
      }

      allDiaries.unshift(newDiary)
      localStorage.setItem("diaries", JSON.stringify(allDiaries))

      return newDiary
    }

    // 폴백 (실제로는 실행되지 않음)
    return {
      id: Date.now(),
      date: new Date().toISOString(),
      ...diary,
    }
  } catch (error) {
    console.error("일기를 저장하는 중 오류 발생:", error)
    throw error
  }
}

/**
 * 일기 분석을 요청하는 함수
 */
export async function analyzeDiary(content: string): Promise<DiaryAnalysis> {
  try {
    // 실제 구현에서는 fetch 사용
    // const response = await fetch(`${API_BASE_URL}/analyze`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content })
    // })
    // if (!response.ok) throw new Error('Failed to analyze diary')
    // return await response.json()

    // 목업 분석 결과 반환
    return {
      emotions: [
        { name: "슬픔", value: 65 },
        { name: "불안", value: 20 },
        { name: "평온", value: 15 },
      ],
      keywords: ["무기력", "고립감", "위안", "자기수용"],
      summary:
        "무기력함과 고립감을 느끼지만 자연과 여유를 통해 위안을 찾고 자기 수용으로 나아가는 과정이 담겨 있습니다.",
      recommendation: "가벼운 산책이나 명상을 통해 자연과 연결되는 시간을 더 가져보는 것이 도움이 될 수 있습니다.",
    }
  } catch (error) {
    console.error("일기 분석 중 오류 발생:", error)
    throw error
  }
}

// 목업 데이터
function getMockDiaries(): DiaryEntry[] {
  return [
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
      content:
        "오랜만에 친구들과 만나 웃고 떠들었다. 일상의 소소한 이야기들이 이렇게 즐거울 수 있다는 것을 새삼 느꼈다.",
      image: "/backyard-friendship.png",
      emotion: "기쁨",
      likes: 8,
      comments: 1,
    },
  ]
}
