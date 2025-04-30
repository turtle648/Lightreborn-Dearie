import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { ChevronDown } from "../components/icons"
import { LinearGradient } from "expo-linear-gradient" // 필요 시 설치: expo install expo-linear-gradient

const { width, height } = Dimensions.get("window")

// windowContainer 크기
const WINDOW_W = width * 0.8
const WINDOW_H = height * 0.6

// frame 위치·크기 (percent → 숫자)
const FRAME_TOP = WINDOW_H * 0.1        // 10%
const FRAME_LEFT = WINDOW_W * 0.075     // 7.5%
const FRAME_W = WINDOW_W * 0.85         // 85%
const FRAME_H = WINDOW_H * 0.6          // 60%

// 커튼 등 애니메이션 시작·끝 좌표
const CURTAIN_START_LEFT = -width * 0.5
const CURTAIN_END_LEFT = -WINDOW_W * 0.2
const CURTAIN_START_RIGHT = width
const CURTAIN_END_RIGHT = WINDOW_W * 0.8

// 식물과 메시지 위치
const PLANTS_END_Y = WINDOW_H * 0.6     // bottom: 20%  → translateY 계산 끝값
const MESSAGE_BOTTOM = WINDOW_H * 0.1   // 10%

interface IntroAnimationProps {
  onComplete: () => void
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [showSkip, setShowSkip] = useState(false)

  // Animated.Value를 useRef에 담아 “렌더 때마다 새로 생성” 문제 방지
  const windowOpacity = useRef(new Animated.Value(0)).current
  const windowScale = useRef(new Animated.Value(0.9)).current
  const curtainLeftAnim = useRef(new Animated.Value(CURTAIN_START_LEFT)).current
  const curtainRightAnim = useRef(new Animated.Value(CURTAIN_START_RIGHT)).current
  const plantsAnim = useRef(new Animated.Value(height)).current
  const messageOpacity = useRef(new Animated.Value(0)).current
  const skipButtonOpacity = useRef(new Animated.Value(0)).current
  const skipButtonPosition = useRef(new Animated.Value(20)).current

  useEffect(() => {
    // 전체 시퀀스
    Animated.sequence([
      // 1) 창 등장
      Animated.parallel([
        Animated.timing(windowOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(windowScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // 2) 커튼 열림
      Animated.parallel([
        Animated.timing(curtainLeftAnim, {
          toValue: CURTAIN_END_LEFT,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(curtainRightAnim, {
          toValue: CURTAIN_END_RIGHT,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // 3) 식물 슬라이드 업
      Animated.timing(plantsAnim, {
        toValue: PLANTS_END_Y,
        duration: 1000,
        useNativeDriver: true,
      }),
      // 4) 메시지 페이드 인
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    // “시작하기” 버튼 등장
    const timer = setTimeout(() => {
      setShowSkip(true)
      Animated.parallel([
        Animated.timing(skipButtonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(skipButtonPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.windowContainer}>
        {/* 밤하늘 배경 */}
        <LinearGradient
          colors={["#0a1a2a", "#0a1a2a"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* 창 프레임 */}
        <Animated.View
          style={[
            styles.windowFrame,
            {
              opacity: windowOpacity,
              transform: [{ scale: windowScale }],
            },
          ]}
        >
          {/* 창문 칸막이 */}
          <View style={styles.windowPanes}>
            <View style={styles.pane} />
            <View style={styles.pane} />
            <View style={styles.pane} />
            <View style={styles.pane} />
          </View>
        </Animated.View>

        {/* 커튼 */}
        <Animated.View
          style={[
            styles.leftCurtain,
            { transform: [{ translateX: curtainLeftAnim }] },
          ]}
        />
        <Animated.View
          style={[
            styles.rightCurtain,
            { transform: [{ translateX: curtainRightAnim }] },
          ]}
        />

        {/* 식물 */}
        <Animated.View
          style={[
            styles.plantsContainer,
            { transform: [{ translateY: plantsAnim }] },
          ]}
        >
          <View style={styles.plant1} />
          <View style={styles.plant2} />
        </Animated.View>

        {/* 메시지 */}
        <Animated.View
          style={[
            styles.messageContainer,
            { opacity: messageOpacity },
          ]}
        >
          <Text style={styles.messageTitle}>오늘 하루도 수고하셨어요</Text>
          <Text style={styles.messageSubtitle}>당신의 마음을 기록해보세요</Text>
        </Animated.View>
      </View>

      {/* 시작하기 버튼 */}
      {showSkip && (
        <Animated.View
          style={[
            styles.skipButtonContainer,
            {
              opacity: skipButtonOpacity,
              transform: [{ translateY: skipButtonPosition }],
            },
          ]}
        >
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={styles.skipButtonText}>시작하기</Text>
            <ChevronDown color="#FFF" size={16} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  windowContainer: {
    width: WINDOW_W,
    height: WINDOW_H,
    position: "relative",
  },
  windowFrame: {
    position: "absolute",
    top: FRAME_TOP,
    left: FRAME_LEFT,
    width: FRAME_W,
    height: FRAME_H,
    borderWidth: 4,
    borderColor: "#1a2a3a",
    borderRadius: 8,
    backgroundColor: "#0a1a2a",
    overflow: "hidden",
  },
  windowPanes: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pane: {
    width: "50%",
    height: "50%",
    borderColor: "#1a2a3a",
    borderWidth: 2,
  },
  leftCurtain: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WINDOW_W * 0.25,
    height: "100%",
    backgroundColor: "rgba(26,42,58,0.5)",
  },
  rightCurtain: {
    position: "absolute",
    top: 0,
    right: 0,
    width: WINDOW_W * 0.25,
    height: "100%",
    backgroundColor: "rgba(26,42,58,0.5)",
  },
  plantsContainer: {
    position: "absolute",
    bottom: PLANTS_END_Y,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },
  plant1: {
    width: 30,
    height: 50,
    backgroundColor: "#1a3a2a",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  plant2: {
    width: 30,
    height: 40,
    backgroundColor: "#2a4a3a",
    borderRadius: 20,
  },
  messageContainer: {
    position: "absolute",
    bottom: MESSAGE_BOTTOM,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  messageSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  skipButtonContainer: {
    position: "absolute",
    bottom: 40,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  skipButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginRight: 8,
  },
})

export default IntroAnimation
