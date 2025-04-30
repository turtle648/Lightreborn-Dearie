// src/components/DiaryCard.tsx

import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from "react-native"
import { theme } from "../styles/theme"

export interface Diary {
  id: string
  title: string
  date: string
  content: string
  images?: ImageSourcePropType[]
}

interface DiaryCardProps {
  diary: Diary
  style?: ViewStyle
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ diary, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.8}>
      {/* 날짜 */}
      <Text style={styles.date}>{diary.date}</Text>
      {/* 제목 */}
      <Text style={styles.title}>{diary.title}</Text>
      {/* 내용 미리보기 */}
      <Text style={styles.content} numberOfLines={2}>
        {diary.content}
      </Text>
      {/* 이미지가 있으면 첫 번째만 표시 */}
      {diary.images && diary.images.length > 0 && (
        <Image source={diary.images[0]} style={styles.image} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: theme.colors.gray[500],
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: theme.colors.gray[600],
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
})
