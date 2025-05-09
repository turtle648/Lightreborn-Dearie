"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

interface Story {
  id: number
  username: string
  active: boolean
}

interface HomeStoriesProps {
  stories: Story[]
}

export function HomeStories({ stories }: HomeStoriesProps) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <Link href={`/story/${story.id}`} className="flex flex-col items-center space-y-2 min-w-[76px]">
            <div
              className={cn(
                "p-[2px] rounded-full",
                story.active ? "bg-gradient-to-br from-primary to-primary-dark" : "bg-gray-200",
              )}
            >
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src={`/blue-skinned-figure.png?height=64&width=64&query=avatar%20${story.id}`} />
                <AvatarFallback>{story.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-medium text-center truncate w-full">{story.username}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
