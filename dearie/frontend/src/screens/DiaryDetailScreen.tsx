import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  Smile,
  Frown,
  Meh,
} from "../components/icons"
import { theme } from "../styles/theme"
import { Tab, TabView } from "../components/ui/Tabs"
import { ProgressBar } from "../components/ui/ProgressBar"
import { Badge } from "../components/ui/Badge"
import { LinearGradient } from "expo-linear-gradient"  // expo install expo-linear-gradient

const DiaryDetailScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = (route.params as { id: number }) || {}

  const [activeTab, setActiveTab] = useState(0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  // 샘플 데이터 (실제론 API 호출)
  const diary = {
    id,
    date: "2025/04/23 (화)",
    content: `오늘은 눈을 뜨는 것조차 힘들었다.…`,
    image: require("../../assets/placeholder.png"),
    emotion: "슬픔",
    aiAnalysis: {
      emotions: [
        { name: "슬픔", value: 65, icon: Frown, color: "#3B82F6" },
        { name: "불안", value: 20, icon: Meh, color: "#F59E0B" },
        { name: "평온", value: 15, icon: Smile, color: "#10B981" },
      ],
      keywords: ["무기력", "고립감", "위안", "자기수용"],
      summary:
        "무기력함과 고립감을 느끼지만 자연과 여유를 통해 위안을 찾고 자기 수용으로 나아가는 과정이 담겨 있습니다.",
      recommendation:
        "가벼운 산책이나 명상을 통해 자연과 연결되는 시간을 더 가져보는 것이 도움이 될 수 있습니다.",
    },
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Share color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 이미지 + 그라데이션 오버레이 */}
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={diary.image}
            style={styles.imageBackground}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            {/* 날짜 & 배지 */}
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>{diary.date}</Text>
              <View style={styles.badgeRow}>
                <Badge
                  label={diary.emotion}
                  variant="primary"
                  style={styles.badgeMargin}
                />
                <Badge label="AI 분석 완료" variant="secondary" />
              </View>
            </View>

            {/* 본문 */}
            <Text style={styles.bodyText}>{diary.content}</Text>

            {/* 좋아요 / 댓글 / 저장 */}
            <View style={styles.actionRow}>
              <View style={styles.leftActionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { marginRight: 16 }]}
                  onPress={() => setLiked(!liked)}
                >
                  <Heart
                    color={liked ? theme.colors.primary : "#6B7280"}
                    fill={liked ? theme.colors.primary : "none"}
                    size={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MessageCircle color="#6B7280" size={24} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setSaved(!saved)}
              >
                <Bookmark
                  color={saved ? theme.colors.primary : "#6B7280"}
                  fill={saved ? theme.colors.primary : "none"}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 탭 뷰 */}
          <View style={styles.tabsWrapper}>
            <Tab
              tabs={["AI 분석", "추천"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <TabView activeTab={activeTab}>
              {/* AI 분석 */}
              <View style={styles.tabContent}>
                <View style={styles.analysisCard}>
                  <Text style={styles.sectionTitle}>감정 분석</Text>
                  <View>
                    {diary.aiAnalysis.emotions.map((e, i) => {
                      const Icon = e.icon
                      return (
                        <View
                          key={i}
                          style={{
                            marginBottom:
                              i === diary.aiAnalysis.emotions.length - 1
                                ? 0
                                : 12,
                          }}
                        >
                          <View style={styles.emotionHeaderRow}>
                            <View style={styles.emotionLabelRow}>
                              <Icon color={e.color} size={16} />
                              <Text style={styles.emotionLabelText}>
                                {e.name}
                              </Text>
                            </View>
                            <Text style={styles.emotionValueText}>
                              {e.value}%
                            </Text>
                          </View>
                          <ProgressBar progress={e.value} color={e.color} />
                        </View>
                      )
                    })}
                  </View>

                  <Text style={[styles.sectionTitle, styles.mt24]}>
                    키워드
                  </Text>
                  <View style={styles.keywordRow}>
                    {diary.aiAnalysis.keywords.map((kw, i) => (
                      <Badge
                        key={i}
                        label={kw}
                        variant="outline"
                        style={styles.badgeMargin}
                      />
                    ))}
                  </View>

                  <Text style={[styles.sectionTitle, styles.mt8]}>
                    요약
                  </Text>
                  <Text style={styles.summaryText}>
                    {diary.aiAnalysis.summary}
                  </Text>
                </View>
              </View>

              {/* 추천 탭 */}
              <View style={styles.tabContent}>
                <View style={styles.analysisCard}>
                  <Text style={styles.sectionTitle}>추천 활동</Text>
                  <Text style={styles.summaryText}>
                    {diary.aiAnalysis.recommendation}
                  </Text>

                  <View>
                    {["5분 명상하기", "가벼운 산책하기", "감사일기 쓰기"].map(
                      (act, i, arr) => (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.activityBtn,
                            { marginBottom: i === arr.length - 1 ? 0 : 12 },
                          ]}
                        >
                          <Smile size={16} color={theme.colors.primary} />
                          <Text
                            style={[styles.activityText, { marginLeft: 8 }]}
                          >
                            {act}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              </View>
            </TabView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 10,
  },

  imageWrapper: { height: 280, width: "100%" },
  imageBackground: { flex: 1, resizeMode: "cover" },

  contentWrapper: {
    marginTop: -64,
    paddingBottom: 40,
  },

  card: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  dateRow: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
  },
  badgeMargin: {
    marginRight: 8,
  },

  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
    marginBottom: 20,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(229,231,235,0.5)",
    paddingTop: 16,
  },
  leftActionRow: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 4,
  },

  tabsWrapper: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  tabContent: {
    marginTop: 16,
  },

  analysisCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  mt24: { marginTop: 24 },
  mt8: { marginTop: 8 },

  emotionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  emotionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emotionLabelText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 6,
  },
  emotionValueText: {
    fontSize: 14,
    color: "#4B5563",
  },

  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },

  keywordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },

  activityBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
  },
  activityText: {
    fontSize: 14,
    color: "#4B5563",
  },
})

export default DiaryDetailScreen
