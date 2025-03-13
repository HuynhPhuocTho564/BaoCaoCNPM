/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Clock, Archive, BookOpenText } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

interface Story {
  story_id: number
  title: string
  cover_image: string | null
  main_category: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  updated_at: string
}

export default function StoriesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      const data = await response.json()
      
      if (response.ok) {
        setStories(data.stories)
      } else {
        toast.error(data.error || 'Không thể tải danh sách truyện')
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi tải danh sách truyện')
    } finally {
      setIsLoadingStories(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchStories()
    }
  }, [session])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'published':
        return <BookOpen className="w-4 h-4 text-green-500" />
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Bản nháp'
      case 'published':
        return 'Đã xuất bản'
      case 'archived':
        return 'Đã lưu trữ'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Truyện của tôi</h1>
            <Button onClick={() => router.push('/stories/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo truyện mới
            </Button>
          </div>

          {isLoadingStories ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Đang tải danh sách truyện...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenText className="w-24 h-24 mx-auto mb-8 text-muted-foreground/30" />
              <h2 className="text-2xl font-semibold mb-2">
                Bạn chưa có truyện nào
              </h2>
              <p className="text-muted-foreground">
                Hãy bắt đầu hành trình sáng tạo bằng việc tạo truyện đầu tiên của bạn
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.story_id} className="flex flex-row h-[200px] overflow-hidden">
                  {story.cover_image && (
                    <div className="relative w-[150px] h-full flex-shrink-0">
                      <Image
                        src={story.cover_image}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg line-clamp-1 max-w-[60%]">{story.title}</CardTitle>
                        <div className="flex items-center gap-1 shrink-0">
                          {getStatusIcon(story.status)}
                          <span className="text-sm text-muted-foreground">
                            {getStatusText(story.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded font-medium">
                          {story.main_category}
                        </span>
                        <span className="text-sm text-muted-foreground shrink-0 ml-auto">
                          {story.view_count} lượt xem
                        </span>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between gap-2 pt-0 mt-auto">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push(`/stories/${story.story_id}/edit`)}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push(`/stories/${story.story_id}`)}
                      >
                        Xem truyện
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}