/**
 * 일기 관련 타입 정의
 */

export interface DiaryEntry {
  id: number
  date: string
  content: string
  image?: string
  emotion?: string
  likes: number
  comments: number
}

export interface DiaryAnalysis {
  emotions: {
    name: string
    value: number
  }[]
  keywords: string[]
  summary: string
  recommendation: string
}

export interface DiaryComment {
  id: number
  author: string
  avatar?: string
  content: string
  date: string
  likes: number
}
