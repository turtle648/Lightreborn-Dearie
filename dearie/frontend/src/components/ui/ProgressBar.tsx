import { View, StyleSheet } from "react-native"
import { theme } from "../../styles/theme"

interface ProgressBarProps {
  progress: number
  color?: string
}

export const ProgressBar = ({ progress, color = theme.colors.primary }: ProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
})
