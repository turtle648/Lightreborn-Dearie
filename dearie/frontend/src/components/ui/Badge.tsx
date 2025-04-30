import React from "react"
import { View, Text, StyleSheet, ViewStyle } from "react-native"
import { theme } from "../../styles/theme"

interface BadgeProps {
  label: string
  variant?: "primary" | "secondary" | "outline"
  style?: ViewStyle | ViewStyle[]
}

export const Badge = ({ label, variant = "primary", style }: BadgeProps) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>  {/* style prop을 통해 여분의 스타일 적용 가능 */}
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  primary: {
    backgroundColor: "rgba(241, 178, 159, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(241, 178, 159, 0.2)",
  },
  secondary: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  outline: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  primaryText: {
    color: theme.colors.primary,
  },
  secondaryText: {
    color: "#6B7280",
  },
  outlineText: {
    color: "#6B7280",
  },
})
