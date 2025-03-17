"use client"

import { useEffect, useState } from "react"
import { StoryCard } from "@/components/story-card"
import { BookOpenText } from "lucide-react"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  view_count: number
  updated_at: string
}

export default function NewStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/library/new')
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
      <h1 className="text-3xl font-bold mb-8">Truyện Mới Xuất Bản</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải danh sách truyện...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Chưa có truyện nào được xuất bản</p>
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