// src/components/DailyMission.tsx
import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native"
import { theme } from "../styles/theme"

export interface Mission {
  id: number
  title: string
  description: string
  difficulty: string
  category: string
  icon: React.ComponentType<any>
  color: string
}

interface DailyMissionProps {
  mission: Mission
  style?: ViewStyle
}

const DailyMission: React.FC<DailyMissionProps> = ({ mission, style }) => {
  const Icon = mission.icon

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: mission.color }, style]}
      activeOpacity={0.8}
    >
      {/* 아이콘 */}
      <View style={styles.iconWrapper}>
        <Icon color={mission.color} size={24} />
      </View>

      {/* 텍스트 영역 */}
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.description}>{mission.description}</Text>
        <Text style={styles.difficulty}>{`난이도: ${mission.difficulty}`}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  difficulty: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.gray[500],
  },
})

export default DailyMission
