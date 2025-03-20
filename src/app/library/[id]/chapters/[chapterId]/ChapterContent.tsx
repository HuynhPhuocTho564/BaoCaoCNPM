"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Hand } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const showNextDialogue = () => {
    if (chapter?.dialogues && visibleDialogues.length < chapter.dialogues.length) {
      const nextDialogue = chapter.dialogues[visibleDialogues.length]
      setVisibleDialogues(prev => [...prev, nextDialogue.dialogue_id])
    }
  }

  const isChapterCompleted = chapter?.dialogues && 
    visibleDialogues.length === chapter.dialogues.length

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [visibleDialogues])

  if (isLoading || !chapter) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải nội dung chương...</p>
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
                      <div 
                        className={`flex items-start gap-3 ${
                          dialogue.character?.role === 'main' 
                            ? 'flex-row-reverse' 
                            : 'flex-row'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {dialogue.character?.avatar_image ? (
                            <Image
                              src={dialogue.character.avatar_image}
                              alt={dialogue.character.name}
                              width={40}
                              height={40}
                              className="object-cover"
                              draggable="false"
                            />
                          ) : (
                            <User className="w-6 h-6 m-2" />
                          )}
                        </div>
                        <div className={`flex-1 ${dialogue.character?.role === 'main' ? 'text-right' : ''}`}>
                          <div className="font-semibold">{dialogue.character?.name}</div>
                          <div className={`mt-1 flex ${dialogue.character?.role === 'main' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`inline-block p-3 rounded-lg max-w-[80%] break-words whitespace-pre-wrap ${
                              dialogue.character?.role === 'main' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              {dialogue.content}
                            </div>
                          </div>
                        </div>
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