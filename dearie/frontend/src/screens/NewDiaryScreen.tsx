import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Smile,
  Send,
} from "../components/icons"
import { theme } from "../styles/theme"
import EmotionSelector from "../components/EmotionSelector"
import { Modal } from "../components/ui/Modal"

const NewDiaryScreen = () => {
  const navigation = useNavigation()
  const [content, setContent] = useState("")
  const [showEmotionSelector, setShowEmotionSelector] = useState(false)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    // 실제론 API 호출
    setTimeout(() => {
      setIsSubmitting(false)
      navigation.navigate("Diary" as never)
    }, 1000)
  }

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion)
    setShowEmotionSelector(false)
  }

  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  })

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일기 작성</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.date}>{currentDate}</Text>

          {selectedEmotion && (
            <TouchableOpacity
              style={styles.emotionTag}
              onPress={() => setShowEmotionSelector(true)}
            >
              <Smile color={theme.colors.primary} size={16} />
              <Text style={styles.emotionText}>{selectedEmotion}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="오늘의 이야기를 자유롭게 적어보세요..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={content}
              onChangeText={setContent}
            />
          </View>

          <View style={styles.actionsContainer}>
            <View style={styles.leftActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionSpacing]}
                onPress={() => {}}
              >
                <Camera color="#6B7280" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionSpacing]}
                onPress={() => {}}
              >
                <ImageIcon color="#6B7280" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowEmotionSelector(true)}
              >
                <Smile color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!content.trim() || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!content.trim() || isSubmitting}
            >
              <Send color="#FFFFFF" size={16} />
              <Text style={styles.submitButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showEmotionSelector}
        onClose={() => setShowEmotionSelector(false)}
      >
        <EmotionSelector
          onSelect={handleEmotionSelect}
          onClose={() => setShowEmotionSelector(false)}
        />
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  emotionTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(241, 178, 159, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(241, 178, 159, 0.2)",
  },
  emotionText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 6,
  },
  textInputContainer: {
    flex: 1,
    minHeight: 200,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#1F2937",
    textAlignVertical: "top",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    // gap 제거
  },
  actionSpacing: {
    marginRight: 16, // 버튼 사이 간격
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default NewDiaryScreen
