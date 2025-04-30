import React, { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { theme } from "../styles/theme"
import { BookOpen } from "../components/icons"

const SplashScreen = () => {
  // Animated.Value를 useRef에 담아 렌더링마다 다시 생성되지 않도록 고정
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const textOpacityAnim = useRef(new Animated.Value(0)).current
  const textPositionAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.sequence([
      // 아이콘 등장 애니메이션
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // 텍스트 페이드인+슬라이드 업
      Animated.parallel([
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textPositionAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [scaleAnim, opacityAnim, textOpacityAnim, textPositionAnim])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <BookOpen width={120} height={120} />
      </Animated.View>

      <Animated.View
        style={{
          opacity: textOpacityAnim,
          transform: [{ translateY: textPositionAnim }],
        }}
      >
        <Text style={styles.title}>Dearie</Text>
        <Text style={styles.subtitle}>당신의 마음을 기록하세요</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
})

export default SplashScreen
