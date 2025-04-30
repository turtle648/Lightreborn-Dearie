import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Settings } from "../components/icons"
import { theme } from "../styles/theme"
import { Tab } from "../components/ui/Tabs"

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = React.useState(0)

  // 활동 데이터 예시
  const activities = [
    {
      id: 1,
      title: "카페 501",
      date: "2025.04.23",
      description:
        "따뜻한 차 한 잔, 창밖의 풍경, 조용한 음악 같은 일상의 작은 행복에 마음을 전달한 감정입니다.",
    },
    {
      id: 2,
      title: "5분 명상하기",
      date: "2025.04.22",
      description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
    },
  ]

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader} />
          <View style={styles.profileContent}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../../assets/placeholder.png")}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>윌리님</Text>
                <Text style={styles.subtitle}>일기 작성 30일째</Text>
              </View>
              <TouchableOpacity style={styles.settingsButton}>
                <Settings color="#1F2937" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>42</Text>
                <Text style={styles.statLabel}>작성한 일기</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>15</Text>
                <Text style={styles.statLabel}>완료한 미션</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>연속 작성일</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emotion Stats */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>감정 통계</Text>

          <View style={styles.tabsContainer}>
            <Tab
              tabs={["주간", "월간", "연간"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>

          <View style={styles.statsGraphContainer}>
            <Image
              source={require("../../assets/placeholder.png")}
              style={styles.statsGraph}
              resizeMode="contain"
            />
          </View>

          <View style={styles.emotionLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#60A5FA" }]}
              />
              <Text style={styles.legendText}>슬픔</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#34D399" }]}
              />
              <Text style={styles.legendText}>평온</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FBBF24" }]}
              />
              <Text style={styles.legendText}>불안</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#F87171" }]}
              />
              <Text style={styles.legendText}>화남</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#A78BFA" }]}
              />
              <Text style={styles.legendText}>기쁨</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 활동</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>더보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesList}>
            {activities.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.activityItem,
                  idx !== activities.length - 1 && { marginBottom: 16 },
                ]}
              >
                <Image
                  source={require("../../assets/placeholder.png")}
                  style={styles.activityImage}
                />
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDate}>{item.date}</Text>
                  </View>
                  <Text
                    style={styles.activityDescription}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  profileCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    height: 80,
    backgroundColor: theme.colors.primary,
  },
  profileContent: {
    padding: 16,
    paddingTop: 0,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: -40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameContainer: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  seeMoreText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  statsGraphContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGraph: {
    width: "100%",
    height: "100%",
  },
  emotionLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: {
    alignItems: "center",
  },
  legendColor: {
    width: 16,
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  activitiesList: {
    // gap 제거 → map 안에서 marginBottom으로 대체
  },
  activityItem: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  activityImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  activityDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  activityDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
})

export default ProfileScreen
