/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Character {
  character_id: number
  name: string
  description: string
  avatar_image: string
  role: 'main' | 'supporting'
}

export default function EditCharacterContent({ 
  storyId, 
  characterId 
}: { 
  storyId: string
  characterId: string 
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}/characters/${characterId}/get`)
        const data = await response.json()
        
        if (response.ok) {
          setCharacter(data.character)
          if (data.character.avatar_image) {
            setPreviewImage(data.character.avatar_image)
          }
        } else {
          toast.error('Không thể tải thông tin nhân vật')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra')
      }
    }

    if (session?.user) {
      fetchCharacter()
    }
  }, [session, storyId, characterId])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      const response = await fetch(`/api/stories/${storyId}/characters/${characterId}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật nhân vật')
      }

      toast.success('Cập nhật nhân vật thành công!')
      router.push(`/stories/${storyId}?tab=characters`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/characters/${characterId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa nhân vật')
      }

      toast.success('Xóa nhân vật thành công!')
      router.push(`/stories/${storyId}?tab=characters`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  if (!character) {
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
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Chỉnh sửa nhân vật
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center">
          <div 
            onClick={handleImageClick}
            className="relative cursor-pointer group mb-6"
          >
            <div className={`w-40 h-40 rounded-full overflow-hidden border-2 border-dashed
              ${previewImage ? 'border-transparent' : 'border-gray-300'}
              flex items-center justify-center bg-gray-50 hover:bg-gray-100
              transition-colors duration-200 relative`}
            >
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Preview" 
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">
                {previewImage ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="avatarImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tên nhân vật</label>
            <Input 
              name="name" 
              required 
              defaultValue={character.name}
              placeholder="Nhập tên nhân vật"
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <Textarea 
              name="description" 
              defaultValue={character.description}
              placeholder="Mô tả về nhân vật"
              className="h-32 text-base resize-none"
            />
          </div>

          <input type="hidden" name="role" value={character.role} />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="button" 
                variant="destructive" 
                className="w-full sm:w-auto sm:min-w-[120px]"
              >
                Xóa nhân vật
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Nhân vật này sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Xác nhận xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push(`/stories/${storyId}?tab=characters`)}
            className="w-full sm:w-auto sm:min-w-[120px]"
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
} 