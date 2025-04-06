"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BookOpenText, Clock, Eye } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
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
  tags: string[]
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Skeleton cho cột trái - ảnh bìa */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
              <Skeleton height="100%" />
            </div>
          </div>

          {/* Skeleton cho cột phải - thông tin truyện */}
          <div className="space-y-6">
            <div>
              <Skeleton height={32} width="80%" className="mb-2" />
              <Skeleton count={3} className="mb-1" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton width={100} height={28} />
                <Skeleton width={120} height={24} />
              </div>

              <div className="flex flex-wrap gap-2">
                {Array(5).fill(0).map((_, index) => (
                  <Skeleton key={index} width={80} height={28} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton cho danh sách chương */}
        <div className="mt-8">
          <Skeleton height={32} width={200} className="mb-4" />
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Thông tin truyện - cột trái */}
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
        </div>

        {/* Thông tin truyện - cột phải */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
            <p className="text-muted-foreground">{story.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                {story.main_category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {story.view_count} lượt xem
              </span>
            </div>

            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-muted/50 text-muted-foreground hover:bg-muted transition-colors px-3 py-1.5 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách chương */}
      <div className="mt-8">
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
                      {chapter.title}
                    </h3>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 