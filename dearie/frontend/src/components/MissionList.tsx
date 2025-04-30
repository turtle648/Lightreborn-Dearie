import { View, StyleSheet, FlatList } from "react-native"
import { Sparkles, Clock, Award } from "./icons"
import { theme } from "../styles/theme"
import DailyMission from "./DailyMission"

interface MissionListProps {
  category?: string
}

const MissionList = ({ category }: MissionListProps) => {
  // Sample data
  const allMissions = [
    {
      id: 1,
      title: "오늘의 추천 미션",
      description: "창문 밖 풍경을 5분간 바라보며 깊게 호흡하기",
      difficulty: "쉬움",
      category: "mindfulness",
      icon: Sparkles,
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: "감정 표현하기",
      description: "오늘 느낀 감정을 3가지 단어로 표현해보기",
      difficulty: "보통",
      category: "emotion",
      icon: Award,
      color: "#F59E0B",
    },
    {
      id: 3,
      title: "5분 명상하기",
      description: "조용한 곳에서 5분간 명상하며 마음 가다듬기",
      difficulty: "보통",
      category: "mindfulness",
      icon: Clock,
      color: "#3B82F6",
    },
    {
      id: 4,
      title: "감사일기 쓰기",
      description: "오늘 감사했던 일 3가지 적어보기",
      difficulty: "쉬움",
      category: "emotion",
      icon: Sparkles,
      color: "#10B981",
    },
    {
      id: 5,
      title: "산책하기",
      description: "15분 동안 천천히 걸으며 주변 환경 관찰하기",
      difficulty: "쉬움",
      category: "activity",
      icon: Award,
      color: "#8B5CF6",
    },
  ]

  const filteredMissions = category ? allMissions.filter((mission) => mission.category === category) : allMissions

  return (
    <FlatList
      data={filteredMissions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <DailyMission mission={item} />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100, // Extra padding for tab bar
  },
  separator: {
    height: 16,
  },
})

export default MissionList
