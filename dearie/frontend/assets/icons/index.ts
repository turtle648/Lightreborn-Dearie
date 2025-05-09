import React from "react"
// 아이콘 인덱스 파일
// 이 파일은 모든 아이콘을 중앙에서 관리하고 내보내는 역할을 합니다.

import {
  Home,
  BookOpen,
  Sparkles,
  User,
  Plus,
  Heart,
  MessageCircle,
  Bookmark,
  Camera,
  ImageIcon,
  Smile,
  Send,
  Save,
  ArrowLeft,
  Bell,
  ChevronRight,
  CheckCircle,
  Filter,
  Search,
  Settings,
  Award,
  Clock,
  Frown,
  Meh,
  Share,
  X,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react"

// 아이콘 맵 - 문자열로 아이콘 컴포넌트에 접근할 수 있게 함
export const iconMap = {
  Home,
  BookOpen,
  Sparkles,
  User,
  Plus,
  Heart,
  MessageCircle,
  Bookmark,
  Camera,
  ImageIcon,
  Smile,
  Send,
  Save,
  ArrowLeft,
  Bell,
  ChevronRight,
  CheckCircle,
  Filter,
  Search,
  Settings,
  Award,
  Clock,
  Frown,
  Meh,
  Share,
  X,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
}

// 개별 아이콘 내보내기
export {
  Home,
  BookOpen,
  Sparkles,
  User,
  Plus,
  Heart,
  MessageCircle,
  Bookmark,
  Camera,
  ImageIcon,
  Smile,
  Send,
  Save,
  ArrowLeft,
  Bell,
  ChevronRight,
  CheckCircle,
  Filter,
  Search,
  Settings,
  Award,
  Clock,
  Frown,
  Meh,
  Share,
  X,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
}

// 아이콘 이름 타입
export type IconName = keyof typeof iconMap

// 아이콘 컴포넌트 - 문자열 이름으로 아이콘 렌더링
export function Icon<T extends IconName>({ name, ...props }: { name: T } & React.ComponentProps<(typeof iconMap)[T]>) {
  return React.createElement(iconMap[name], props)
} 