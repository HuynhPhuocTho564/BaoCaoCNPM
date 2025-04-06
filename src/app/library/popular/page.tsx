"use client"

import { useEffect, useState } from "react"
import { StoryCard } from "@/components/story-card"
import { BookOpenText } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  view_count: number
  updated_at: string
}

export default function PopularStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/library/popular')
        const data = await response.json()
        
        if (response.ok) {
          setStories(data.stories)
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách truyện:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Truyện Phổ Biến</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-3">
                <Skeleton height="100%" />
              </div>
              <Skeleton width="70%" height={24} className="mb-2" />
              <Skeleton width="40%" height={20} className="mb-2" />
              <Skeleton width="30%" height={16} />
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Không tìm thấy truyện nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.story_id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
} 