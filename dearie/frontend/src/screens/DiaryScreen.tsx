import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search } from "../components/icons"
import { theme } from "../styles/theme"
import DiaryListItem from "../components/DiaryListItem"
import { useNavigation } from "@react-navigation/native"

const DiaryScreen = () => {
  const navigation = useNavigation()
  const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">("latest")

  // Sample data
  const diaries = [
    {
      id: 1,
      date: "2025/04/23 (화)",
      content:
        "오늘은 눈을 뜨는 것조차 힘들었다. 무언가 해야 할 일이 분명히 있었던 것 같은데, 머릿속은 안개처럼 뿌옇고, 손끝 하나 움직이는 싫었다.",
      emotion: "슬픔",
      image: require("../../assets/placeholder.png"),
      aiAnalysis: true,
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      date: "2025/04/22 (월)",
      content:
        "카페 창밖으로 노을이 지는 모습을 바라보며 오랜만에 마음의 여유를 느꼈다. 따뜻한 차 한잔과 함께하는 시간이 소중하게 느껴졌다.",
      emotion: "평온",
      image: require("../../assets/placeholder.png"),
      aiAnalysis: true,
      likes: 12,
      comments: 4,
    },
    {
      id: 3,
      date: "2025/04/21 (일)",
      content:
        "오랜만에 친구들과 만나 웃고 떠들었다. 일상의 소소한 이야기들이 이렇게 즐거울 수 있다는 것을 새삼 느꼈다.",
      emotion: "기쁨",
      image: require("../../assets/placeholder.png"),
      aiAnalysis: true,
      likes: 8,
      comments: 1,
    },
  ]

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 일기</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.searchButton, styles.headerActionSpacing]}
            onPress={() => {/* 검색 로직 */}}
          >
            <Search color="#1F2937" size={20} />
          </TouchableOpacity>

          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() =>
                setSelectedSort(selectedSort === "latest" ? "oldest" : "latest")
              }
            >
              <Text style={styles.sortText}>
                {selectedSort === "latest" ? "최신순" : "오래된순"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Diary List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.diaryList}>
          {diaries.map((diary, idx) => (
            <TouchableOpacity
              key={diary.id}
              onPress={() =>
                navigation.navigate(
                  "DiaryDetail" as never,
                  { id: diary.id } as never
                )
              }
              style={{
                marginBottom: idx === diaries.length - 1 ? 0 : 16,
              }}
            >
              <DiaryListItem diary={diary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionSpacing: {
    marginRight: 8, // gap 대신 첫 번째 버튼에만 마진 적용
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  sortContainer: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: 20,
    overflow: "hidden",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 14,
    color: theme.colors.gray[700],
  },
  content: {
    flex: 1,
  },
  diaryList: {
    padding: 16,
    // gap 제거 → map 안에서 marginBottom으로 대체
  },
})

export default DiaryScreen
