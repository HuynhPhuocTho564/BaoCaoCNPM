/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { User, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Character {
  character_id: number
  name: string
  avatar_image: string
  role: 'main' | 'supporting'
}

interface Dialogue {
  dialogue_id: number
  character_id: number
  content: string
  order_number: number
}

export default function WriteChapterContent({
  storyId,
  chapterId
}: {
  storyId: string
  chapterId: string
}) {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [dialogues, setDialogues] = useState<Dialogue[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'main' | 'supporting'>('main')
  const [editingDialogue, setEditingDialogue] = useState<Dialogue | null>(null)
  const [deleteDialogueId, setDeleteDialogueId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  const mainCharacters = characters.filter(c => c.role === 'main')
  const supportingCharacters = characters.filter(c => c.role === 'supporting')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const charactersRes = await fetch(`/api/stories/${storyId}/characters`)
        const charactersData = await charactersRes.json()
        if (charactersRes.ok) {
          setCharacters(charactersData.characters)
        }

        const dialoguesRes = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/dialogues`)
        const dialoguesData = await dialoguesRes.json()
        if (dialoguesRes.ok) {
          setDialogues(dialoguesData.dialogues)
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu')
      }
    }

    fetchData()
  }, [storyId, chapterId])

  const handleSendMessage = async () => {
    if (!selectedCharacter || !newMessage.trim()) {
      toast.error('Vui lòng chọn nhân vật và nhập nội dung')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/stories/${storyId}/chapters/${chapterId}/dialogues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          character_id: selectedCharacter,
          content: newMessage,
          order_number: dialogues.length + 1
        })
      })

      if (!response.ok) {
        throw new Error('Lỗi khi thêm đoạn hội thoại')
      }

      const data = await response.json()
      setDialogues([...dialogues, data.dialogue])
      setNewMessage("")
      toast.success('Thêm đoạn hội thoại thành công')
    } catch (error) {
      toast.error('Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDialogue = async (dialogueId: number) => {
    try {
      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}/dialogues/${dialogueId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: editContent })
        }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật hội thoại')
      }

      const data = await response.json()
      setDialogues(dialogues.map(d => 
        d.dialogue_id === dialogueId 
          ? { ...d, content: editContent }
          : d
      ))
      setEditingDialogue(null)
      setEditContent("")
      toast.success('Cập nhật hội thoại thành công')
    } catch (error) {
      toast.error('Đã có lỗi xảy ra')
    }
  }

  const handleDeleteDialogue = async (dialogueId: number) => {
    try {
      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}/dialogues/${dialogueId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi xóa hội thoại')
      }

      setDialogues(dialogues.filter(d => d.dialogue_id !== dialogueId))
      setDeleteDialogueId(null)
      toast.success('Xóa hội thoại thành công')
    } catch (error) {
      toast.error('Đã có lỗi xảy ra')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Chat history */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {dialogues.map((dialogue) => {
            const character = characters.find(c => c.character_id === dialogue.character_id)
            const isMainCharacter = character?.role === 'main'

            return (
              <div 
                key={dialogue.dialogue_id} 
                className={`flex items-start gap-3 group ${isMainCharacter ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {character?.avatar_image ? (
                    <Image
                      src={character.avatar_image}
                      alt={character.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 m-2" />
                  )}
                </div>
                <div className={`flex-1 ${isMainCharacter ? 'text-right' : ''}`}>
                  <div className="font-semibold">{character?.name}</div>
                  {editingDialogue?.dialogue_id === dialogue.dialogue_id ? (
                    <div className="mt-1">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleEditDialogue(dialogue.dialogue_id)}
                        >
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingDialogue(null)
                            setEditContent("")
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-start gap-2 ${isMainCharacter ? 'flex-row-reverse' : ''}`}>
                      <div className={`mt-1 inline-block p-3 rounded-lg ${
                        isMainCharacter 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {dialogue.content}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingDialogue(dialogue)
                            setEditContent(dialogue.content)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteDialogueId(dialogue.dialogue_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Character selection and input */}
        <div className="border-t pt-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'main' | 'supporting')}>
            <TabsList className="mb-4">
              <TabsTrigger value="main">Nhân vật chính</TabsTrigger>
              <TabsTrigger value="supporting">Nhân vật phụ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {mainCharacters.map((character) => (
                  <Button
                    key={character.character_id}
                    variant={selectedCharacter === character.character_id ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => setSelectedCharacter(character.character_id)}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {character.avatar_image ? (
                        <Image
                          src={character.avatar_image}
                          alt={character.name}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 m-1" />
                      )}
                    </div>
                    {character.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="supporting">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {supportingCharacters.map((character) => (
                  <Button
                    key={character.character_id}
                    variant={selectedCharacter === character.character_id ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => setSelectedCharacter(character.character_id)}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {character.avatar_image ? (
                        <Image
                          src={character.avatar_image}
                          alt={character.name}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 m-1" />
                      )}
                    </div>
                    {character.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập nội dung hội thoại..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !selectedCharacter || !newMessage.trim()}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog 
        open={deleteDialogueId !== null}
        onOpenChange={() => setDeleteDialogueId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đoạn hội thoại này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogueId && handleDeleteDialogue(deleteDialogueId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 