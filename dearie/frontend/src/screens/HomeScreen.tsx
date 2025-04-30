// src/screens/HomeScreen.tsx

import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"         // expo install expo-linear-gradient
import { Bell, ChevronRight } from "react-native-feather"     // 아이콘 라이브러리 예시
import DailyMission, { Mission as DailyMissionType } from "../components/DailyMission"
import { DiaryCard } from "../components/DiaryCard"
import { theme } from "../styles/theme"

// ——— 더미 미션 데이터 (모두 Bell 아이콘 사용) ———
const dummyMissions: DailyMissionType[] = [
  {
    id: 1,
    title: "5분 명상하기",
    description: "조용한 곳에서 눈을 감고 5분간 호흡에 집중해 보세요.",
    difficulty: "쉬움",
    category: "mindfulness",
    icon: Bell,
    color: theme.colors.primary,
  },
  {
    id: 2,
    title: "감정 표현하기",
    description: "오늘 느낀 감정을 3가지 단어로 적어보세요.",
    difficulty: "보통",
    category: "emotion",
    icon: Bell,
    color: theme.colors.gray[500],
  },
  {
    id: 3,
    title: "10분 산책하기",
    description: "밖으로 나가 주변을 둘러보며 10분간 걸어보세요.",
    difficulty: "쉬움",
    category: "activity",
    icon: Bell,
    color: theme.colors.gray[700],
  },
]

// ——— 더미 다이어리 데이터 ———
const dummyDiaries = [
  {
    id: "1",
    title: "행복한 봄날",
    date: "2025-04-30",
    content: "따뜻한 햇살 아래에서 친구들과 산책하며 기분이 좋았습니다.",
    images: [],
  },
  {
    id: "2",
    title: "집에서의 휴식",
    date: "2025-04-29",
    content: "비가 오길래 집에서 차 한 잔과 함께 독서를 즐겼습니다.",
    images: [],
  },
]

export default function HomeScreen({ navigation }) {
  const missions = dummyMissions
  const diaries = dummyDiaries

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={require("../../assets/night-window.jpg")}
            style={styles.headerImage}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Dearie</Text>
              <TouchableOpacity style={styles.bellButton}>
                <Bell color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.greetingContainer}>
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                style={styles.greetingGradient}
              />
              <View style={styles.greetingContent}>
                <Text style={styles.greetingTitle}>안녕하세요,</Text>
                <Text style={styles.greetingSubtitle}>
                  오늘 하루는 어떠셨나요?
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 오늘의 미션 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘의 미션</Text>
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate("Mission")}
            >
              <Text style={styles.seeMoreText}>더보기</Text>
              <ChevronRight color={theme.colors.gray[500]} size={16} />
            </TouchableOpacity>
          </View>
          <View style={styles.missionList}>
            {missions.map((mission, idx) => (
              <DailyMission
                key={mission.id}
                mission={mission}
                style={{ marginBottom: idx === missions.length - 1 ? 0 : 12 }}
              />
            ))}
          </View>
        </View>

        {/* 최근 일기 */}
        <View style={[styles.sectionContainer, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 일기</Text>
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate("Diary")}
            >
              <Text style={styles.seeMoreText}>더보기</Text>
              <ChevronRight color={theme.colors.gray[500]} size={16} />
            </TouchableOpacity>
          </View>
          <View style={styles.diaryList}>
            {diaries.map((diary, idx) => (
              <DiaryCard
                key={diary.id}
                diary={diary}
                style={{ marginBottom: idx === diaries.length - 1 ? 0 : 24 }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { height: 260 },
  headerImage: { flex: 1, justifyContent: "space-between" },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  bellButton: { padding: 8 },

  greetingContainer: {
    position: "relative",
    height: 80,
    justifyContent: "flex-end",
  },
  greetingGradient: { ...StyleSheet.absoluteFillObject },
  greetingContent: { paddingHorizontal: 16, paddingBottom: 12 },
  greetingTitle: { fontSize: 20, color: "#fff", fontWeight: "600" },
  greetingSubtitle: { fontSize: 14, color: "#fff", marginTop: 4 },

  sectionContainer: { paddingHorizontal: 16, paddingTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  seeMoreButton: { flexDirection: "row", alignItems: "center" },
  seeMoreText: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginRight: 4,
  },

  missionList: {},
  lastSection: { marginBottom: 32 },
  diaryList: {},
})
