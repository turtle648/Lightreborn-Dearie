import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"

interface TabProps {
  tabs: string[]
  activeTab: number
  onTabChange: (index: number) => void
}

export const Tab = ({ tabs, activeTab, onTabChange }: TabProps) => {
  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollView}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => onTabChange(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

interface TabViewProps {
  children: React.ReactNode[]
  activeTab: number
}

export const TabView = ({ children, activeTab }: TabViewProps) => {
  return <View style={styles.tabViewContainer}>{children[activeTab]}</View>
}

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    padding: 4,
  },
  tabsScrollView: {
    flexDirection: "row",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#1F2937",
  },
  tabViewContainer: {
    flex: 1,
  },
})
