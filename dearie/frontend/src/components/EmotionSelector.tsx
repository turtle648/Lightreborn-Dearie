import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { X } from "./icons"

interface EmotionSelectorProps {
  onSelect: (emotion: string) => void
  onClose: () => void
}

const EmotionSelector = ({ onSelect, onClose }: EmotionSelectorProps) => {
  const emotions = [
    { name: "기쁨", emoji: "😊" },
    { name: "슬픔", emoji: "😢" },
    { name: "화남", emoji: "😠" },
    { name: "불안", emoji: "😰" },
    { name: "평온", emoji: "😌" },
    { name: "지루함", emoji: "😑" },
    { name: "설렘", emoji: "😍" },
    { name: "감사", emoji: "🙏" },
    { name: "놀람", emoji: "😲" },
    { name: "혼란", emoji: "😵" },
    { name: "희망", emoji: "🌈" },
    { name: "피곤", emoji: "😴" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 감정을 선택해주세요</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={emotions}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.emotionButton} onPress={() => onSelect(item.name)}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.emotionName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.emotionsGrid}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  emotionsGrid: {
    paddingBottom: 16,
  },
  emotionButton: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 8,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionName: {
    fontSize: 12,
    color: "#4B5563",
  },
})

export default EmotionSelector
