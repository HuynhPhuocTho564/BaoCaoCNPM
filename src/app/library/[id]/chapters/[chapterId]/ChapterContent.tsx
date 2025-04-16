/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Hand } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface Character {
  character_id: number
  name: string
  avatar_image: string | null
  role: 'main' | 'supporting'
}

interface Dialogue {
  dialogue_id: number
  character_id: number | null
  content: string
  order_number: number
  character?: Character
  type?: 'dialogue' | 'aside'
}

interface Chapter {
  chapter_id: number
  title: string
  publish_order: number
  dialogues: Dialogue[]
  status: string
}

export default function ChapterContent({ 
  storyId, 
  chapterId 
}: { 
  storyId: string
  chapterId: string 
}) {
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null)
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleDialogues, setVisibleDialogues] = useState<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false)

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const [chapterRes, chaptersRes] = await Promise.all([
          fetch(`/api/library/${storyId}/chapters/${chapterId}`),
          fetch(`/api/library/${storyId}/chapters`)
        ])
        
        const [chapterData, chaptersData] = await Promise.all([
          chapterRes.json(),
          chaptersRes.json()
        ])

        if (chapterRes.ok) {
          setChapter(chapterData.chapter)
          setVisibleDialogues([])
          
          const publishedChapters = chaptersData.chapters
            .filter((c: Chapter) => c.status === 'published')
            .sort((a: Chapter, b: Chapter) => a.publish_order - b.publish_order)
          
          const currentIndex = publishedChapters.findIndex(
            (c: Chapter) => c.chapter_id === Number(chapterId)
          )
          
          setPrevChapter(publishedChapters[currentIndex - 1] || null)
          setNextChapter(publishedChapters[currentIndex + 1] || null)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChapterData()
  }, [storyId, chapterId])

  const isChapterCompleted = chapter?.dialogues && 
    visibleDialogues.length === chapter.dialogues.length

  useEffect(() => {
    if (isChapterCompleted && !isMarkedAsRead) {
      markChapterAsRead()
    }
  }, [isChapterCompleted])

  const markChapterAsRead = async () => {
    try {
      const response = await fetch(`/api/library/${storyId}/chapters/${chapterId}/read`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setIsMarkedAsRead(true)
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu chương đã đọc:', error)
    }
  }

  const showNextDialogue = () => {
    if (chapter?.dialogues && visibleDialogues.length < chapter.dialogues.length) {
      const nextDialogue = chapter.dialogues[visibleDialogues.length]
      setVisibleDialogues(prev => [...prev, nextDialogue.dialogue_id])
    }
  }

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [visibleDialogues])

  if (isLoading || !chapter) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8 select-none">
        {/* Skeleton cho nút quay lại */}
        <div className="mb-8">
          <Skeleton width={180} height={40} />
        </div>

        {/* Skeleton cho tiêu đề chương */}
        <div className="mb-8 text-center">
          <Skeleton width="70%" height={36} className="mx-auto" />
        </div>

        {/* Skeleton cho khu vực nội dung hội thoại */}
        <div className="min-h-[50vh] max-h-[70vh] px-4">
          <div className="space-y-6">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className={`flex items-start gap-3 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className={`flex-1 ${index % 2 === 0 ? '' : 'text-right'}`}>
                  <Skeleton width={100} height={20} className={index % 2 === 0 ? '' : 'ml-auto'} />
                  <div className={`mt-1 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <Skeleton width={200} height={80} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton cho nút điều hướng chương */}
        <div className="flex justify-between items-center mt-12 gap-4">
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
        </div>
      </div>
    )
  }

  return (
    <div 
      className="container max-w-2xl mx-auto px-4 py-8 select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      style={{ 
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Button
        variant="outline"
        onClick={() => router.push(`/library/${storyId}`)}
        className="mb-8"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Quay lại danh sách chương
      </Button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        {chapter.title}
      </h1>

      <div 
        ref={scrollableRef}
        className="min-h-[50vh] max-h-[70vh] overflow-y-auto px-4 cursor-pointer select-none"
        onClick={showNextDialogue}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="space-y-6">
          {visibleDialogues.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
              <Hand className="w-12 h-12 animate-pulse" />
              <p className="mt-4 text-lg">Nhấn vào màn hình để bắt đầu đọc</p>
            </div>
          ) : (
            <AnimatePresence>
              {chapter.dialogues.map((dialogue) => (
                visibleDialogues.includes(dialogue.dialogue_id) && (
                  <motion.div 
                    key={dialogue.dialogue_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {dialogue.type === 'aside' ? (
                      <div className="my-4 px-8">
                        <div className="text-center text-muted-foreground italic">
                          {dialogue.content}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        {dialogue.character?.role === 'main' ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center mb-1">
                              <span className="mr-2 font-semibold">{dialogue.character?.name}</span>
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                {dialogue.character?.avatar_image ? (
                                  <Image
                                    src={dialogue.character.avatar_image}
                                    alt={dialogue.character.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    draggable="false"
                                  />
                                ) : (
                                  <User className="w-5 h-5 m-1.5" />
                                )}
                              </div>
                            </div>
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap">
                              {dialogue.content}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start">
                            <div className="flex items-center mb-1">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 mr-2">
                                {dialogue.character?.avatar_image ? (
                                  <Image
                                    src={dialogue.character.avatar_image}
                                    alt={dialogue.character.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    draggable="false"
                                  />
                                ) : (
                                  <User className="w-5 h-5 m-1.5" />
                                )}
                              </div>
                              <span className="font-semibold">{dialogue.character?.name}</span>
                            </div>
                            <div className="bg-muted p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap">
                              {dialogue.content}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
          {isChapterCompleted && (
            <div className="text-center py-8 text-muted-foreground">
              --- Kết thúc chương ---
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 gap-4">
        {prevChapter ? (
          <Button
            onClick={() => router.push(`/library/${storyId}/chapters/${prevChapter.chapter_id}`)}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Chương trước
          </Button>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Button
            onClick={() => router.push(`/library/${storyId}/chapters/${nextChapter.chapter_id}`)}
            className="flex items-center"
          >
            Chương sau
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
} 