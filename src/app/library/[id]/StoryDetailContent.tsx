"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpenText, Clock } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  view_count: number
  updated_at: string
}

interface Chapter {
  chapter_id: number
  title: string
  status: string
  publish_order: number
}

export default function StoryDetailContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const [storyRes, chaptersRes] = await Promise.all([
          fetch(`/api/library/${storyId}`),
          fetch(`/api/library/${storyId}/chapters`)
        ])
        
        const [storyData, chaptersData] = await Promise.all([
          storyRes.json(),
          chaptersRes.json()
        ])

        if (storyRes.ok) setStory(storyData.story)
        if (chaptersRes.ok) setChapters(chaptersData.chapters)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoryData()
  }, [storyId])

  if (isLoading || !story) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Thông tin truyện */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
            {story.cover_image ? (
              <Image
                src={story.cover_image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpenText className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
            <p className="text-muted-foreground">{story.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full">
              {story.main_category}
            </span>
            <span className="text-muted-foreground">
              {story.view_count} lượt xem
            </span>
          </div>
        </div>

        {/* Danh sách chương */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách chương</h2>
          <div className="space-y-3">
            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Chưa có chương nào được xuất bản</p>
              </div>
            ) : (
              chapters.map((chapter) => (
                <Card 
                  key={chapter.chapter_id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => router.push(`/library/${storyId}/chapters/${chapter.chapter_id}`)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        Chương {chapter.publish_order}: {chapter.title}
                      </h3>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 