import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { Smile, Heart, MessageCircle } from "./icons"
import { theme } from "../styles/theme"

interface DiaryListItemProps {
  diary: {
    id: number
    date: string
    content: string
    emotion: string
    image: any
    aiAnalysis: boolean
    likes: number
    comments: number
  }
}

const DiaryListItem = ({ diary }: DiaryListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.textContent}>
          <View style={styles.header}>
            <Text style={styles.date}>{diary.date}</Text>
          </View>
          <Text style={styles.description} numberOfLines={3}>
            {diary.content}
          </Text>
          <View style={styles.tags}>
            <View style={[styles.emotionTag, styles.tagSpacing]}>
              <Smile color={theme.colors.primary} size={12} />
              <Text style={styles.emotionText}>{diary.emotion}</Text>
            </View>
            {diary.aiAnalysis && (
              <View style={styles.aiTag}>
                <Text style={styles.aiText}>AI 분석</Text>
              </View>
            )}
          </View>
        </View>

        {diary.image && (
          <View style={styles.imageContainer}>
            <Image source={diary.image} style={styles.image} />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={[styles.footerAction, styles.footerSpacing]}>
          <Heart color="#9CA3AF" size={12} />
          <Text style={[styles.footerText, styles.footerTextSpacing]}>
            {diary.likes}
          </Text>
        </View>
        <View style={styles.footerAction}>
          <MessageCircle color="#9CA3AF" size={12} />
          <Text style={[styles.footerText, styles.footerTextSpacing]}>
            {diary.comments}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  contentWrapper: {
    flexDirection: "row",
    padding: 16,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    // gap 제거
  },
  emotionTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tagSpacing: {
    marginRight: 8, // emotionTag와 aiTag 사이 간격
  },
  emotionText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  aiTag: {
    backgroundColor: "rgba(241, 178, 159, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  aiText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    // gap 제거
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    // gap 제거
  },
  footerSpacing: {
    marginRight: 16, // 좋아요와 댓글 아이템 사이 간격
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  footerTextSpacing: {
    marginLeft: 4, // 아이콘과 숫자 사이 간격
  },
})

export default DiaryListItem
