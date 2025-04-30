import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import AppNavigator from './src/navigation/AppNavigator'
import SplashScreen from './src/screens/SplashScreen'
import IntroAnimation from './src/screens/IntroAnimation'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // 2초 스플래시 → Intro 체크 → 네비게이터 진입
    const checkFlow = async () => {
      try {
        const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro')
        setShowIntro(hasSeenIntro !== 'true')
      } catch (e) {
        console.error('AsyncStorage 읽기 에러:', e)
        setShowIntro(true)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkFlow, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleIntroComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenIntro', 'true')
    } catch (e) {
      console.error('AsyncStorage 쓰기 에러:', e)
    }
    setShowIntro(false)
  }

  if (isLoading) {
    return <SplashScreen />
  }
  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFF" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
