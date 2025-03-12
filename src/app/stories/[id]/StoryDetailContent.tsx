/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface Character {
  character_id: number
  name: string
  avatar_image: string
  description: string
  role: 'main' | 'supporting'
}

interface Chapter {
  chapter_id: number
  title: string
  order_number: number
  status: 'draft' | 'published'
  created_at: string
}

interface Story {
  story_id: number
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
}

export default function StoryDetailContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Lấy tab từ URL hoặc mặc định là 'chapters'
  const currentTab = searchParams.get('tab') || 'chapters'

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        // Fetch story details
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const storyData = await storyResponse.json()
        
        if (storyResponse.ok) {
          setStory(storyData.story)
        } else {
          toast.error('Không thể tải thông tin truyện')
        }

        // Fetch chapters
        const chaptersResponse = await fetch(`/api/stories/${storyId}/chapters`)
        const chaptersData = await chaptersResponse.json()
        
        if (chaptersResponse.ok) {
          setChapters(chaptersData.chapters)
        }

        // Fetch characters
        const charactersResponse = await fetch(`/api/stories/${storyId}/characters`)
        const charactersData = await charactersResponse.json()
        
        if (charactersResponse.ok) {
          setCharacters(charactersData.characters)
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchStoryData()
    }
  }, [session, storyId])

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/stories/${storyId}/edit`)}>
            Chỉnh sửa truyện
          </Button>
        </div>
      </div>

      <Tabs defaultValue={currentTab} className="w-full" onValueChange={(value) => {
        // Cập nhật URL khi chuyển tab mà không reload trang
        router.push(`/stories/${storyId}?tab=${value}`, { scroll: false })
      }}>
        <TabsList className="mb-8">
          <TabsTrigger value="chapters">Danh sách chương</TabsTrigger>
          <TabsTrigger value="characters">Nhân vật</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Các chương truyện</h2>
            <Button onClick={() => router.push(`/stories/${storyId}/chapters/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm chương mới
            </Button>
          </div>

          <div className="grid gap-4">
            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Chưa có chương nào</p>
              </div>
            ) : (
              chapters.map((chapter) => (
                <Card key={chapter.chapter_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {chapter.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {chapter.status === 'draft' ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {chapter.status === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/edit`)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="default"
                      className="w-full" 
                      onClick={() => router.push(`/stories/${storyId}/chapters/${chapter.chapter_id}/write`)}
                    >
                      Viết truyện
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="characters">
          <div className="mb-8">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Nhân vật chính</h2>
              {!characters.some(c => c.role === 'main') && (
                <Button onClick={() => router.push(`/stories/${storyId}/characters/create?role=main`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nhân vật chính
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {characters.filter(c => c.role === 'main').map((character) => (
                <Card key={character.character_id} className="flex flex-col">
                  <CardHeader className="flex-row gap-4 items-center space-y-0">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {character.avatar_image ? (
                        <Image 
                          src={character.avatar_image}
                          alt={character.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <User className="w-10 h-10 m-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="text-2xl">{character.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{character.description}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/stories/${storyId}/characters/${character.character_id}/edit`)}
                    >
                      Chỉnh sửa
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Nhân vật phụ</h2>
              <Button onClick={() => router.push(`/stories/${storyId}/characters/create?role=supporting`)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhân vật phụ
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {characters.filter(c => c.role === 'supporting').map((character) => (
                <Card key={character.character_id} className="flex flex-col">
                  <CardHeader className="flex-row gap-4 items-center space-y-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {character.avatar_image ? (
                        <Image 
                          src={character.avatar_image}
                          alt={character.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <User className="w-8 h-8 m-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-xl flex-grow">{character.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{character.description}</p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-6">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/stories/${storyId}/characters/${character.character_id}/edit`)}
                    >
                      Chỉnh sửa
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 