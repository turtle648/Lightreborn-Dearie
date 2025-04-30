import React, { useEffect, useRef, ReactNode } from "react"
import {
  StyleSheet,
  Modal as RNModal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  View,
} from "react-native"

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
}

const WINDOW_HEIGHT = Dimensions.get("window").height

export const Modal = ({ visible, onClose, children }: ModalProps) => {
  const [showModal, setShowModal] = React.useState(visible)

  // useRef로 Animated.Value 고정
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(WINDOW_HEIGHT)).current

  useEffect(() => {
    if (visible) {
      setShowModal(true)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: WINDOW_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false)
      })
    }
  }, [visible, fadeAnim, slideAnim])

  if (!showModal) return null

  return (
    <RNModal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: WINDOW_HEIGHT * 0.8,  // 동적 값으로 대체
  },
})
