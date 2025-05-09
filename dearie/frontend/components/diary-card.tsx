"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface DiaryProps {
  id: number
  date: string
  image: string
  content: string
  likes: number
  comments: number
}

interface DiaryCardProps {
  diary: DiaryProps
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(diary.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <Link href={`/diary/${diary.id}`}>
          <div className="relative aspect-[3/2]">
            <Image src={diary.image || "/placeholder.svg"} alt="일기 이미지" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src="/mystical-forest-spirit.png" />
                  <AvatarFallback>나</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">나의 일기</span>
                  <span className="text-xs text-white/80">{diary.date}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <CardContent className="p-4">
          <p className="text-sm line-clamp-2">{diary.content}</p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="gap-1 px-2" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 px-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{diary.comments}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
