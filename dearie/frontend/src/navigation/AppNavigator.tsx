import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Home, BookOpen, Sparkles, User, Plus } from "../components/icons"
import HomeScreen from "../screens/HomeScreen"
import DiaryScreen from "../screens/DiaryScreen"
import DiaryDetailScreen from "../screens/DiaryDetailScreen"
import NewDiaryScreen from "../screens/NewDiaryScreen"
import MissionScreen from "../screens/MissionScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { View, StyleSheet } from "react-native"
import { theme } from "../styles/theme"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const DiaryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DiaryList" component={DiaryScreen} />
    <Stack.Screen name="DiaryDetail" component={DiaryDetailScreen} />
  </Stack.Navigator>
)

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: {
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        position: "absolute",
        borderTopWidth: 0,
        elevation: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "홈",
        tabBarIcon: ({ color }) => <Home color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="Mission"
      component={MissionScreen}
      options={{
        tabBarLabel: "미션",
        tabBarIcon: ({ color }) => <Sparkles color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="NewDiary"
      component={NewDiaryScreen}
      options={{
        tabBarLabel: "",
        tabBarIcon: () => (
          <View style={styles.addButton}>
            <Plus color="#FFFFFF" size={24} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Diary"
      component={DiaryStack}
      options={{
        tabBarLabel: "일기",
        tabBarIcon: ({ color }) => <BookOpen color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "마이",
        tabBarIcon: ({ color }) => <User color={color} size={24} />,
      }}
    />
  </Tab.Navigator>
)

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
})

export default AppNavigator
