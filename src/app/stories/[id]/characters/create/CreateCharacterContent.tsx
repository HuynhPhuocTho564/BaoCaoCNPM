/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera } from "lucide-react"
import { toast } from "sonner"
import { IdeaGenerator } from "@/components/character/IdeaGenerator"

export default function CreateCharacterContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [storyContext, setStoryContext] = useState<{
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  } | null>(null)
  
  useEffect(() => {
    const fetchStoryContext = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`)
        if (!response.ok) {
          throw new Error('Không thể lấy thông tin truyện')
        }
        const data = await response.json()
        setStoryContext({
          title: data.story.title,
          description: data.story.description,
          mainCategory: data.story.main_category,
          tags: data.story.tags
        })
      } catch (error) {
        toast.error('Lỗi khi lấy thông tin truyện')
      }
    }

    fetchStoryContext()
  }, [storyId])

  // Lấy role từ searchParams bằng hook
  const roleParam = searchParams.get('role')
  const role = roleParam?.toLowerCase() === 'main' ? 'main' : 'supporting'

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
      const response = await fetch(`/api/stories/${storyId}/characters`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo nhân vật')
      }

      toast.success('Tạo nhân vật thành công!')
      router.push(`/stories/${storyId}?tab=characters`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyIdea = (idea: any) => {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const genderInput = document.getElementById('gender') as HTMLSelectElement;
    const birthdayInput = document.getElementById('birthday') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const personalityInput = document.getElementById('personality') as HTMLTextAreaElement;
    const appearanceInput = document.getElementById('appearance') as HTMLTextAreaElement;
    const backgroundInput = document.getElementById('background') as HTMLTextAreaElement;
    
    if (nameInput) nameInput.value = idea.name;
    if (descriptionInput) descriptionInput.value = idea.description;
    if (genderInput) genderInput.value = idea.gender;
    if (birthdayInput) birthdayInput.value = idea.birthday;
    if (heightInput) heightInput.value = idea.height;
    if (weightInput) weightInput.value = idea.weight;
    if (personalityInput) personalityInput.value = idea.personality;
    if (appearanceInput) appearanceInput.value = idea.appearance;
    if (backgroundInput) backgroundInput.value = idea.background;
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      {storyContext ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-center">
              {role === 'main' ? 'Thêm nhân vật chính' : 'Thêm nhân vật phụ'}
            </h1>
            <IdeaGenerator 
              role={role}
              storyContext={storyContext}
              onApplyIdea={handleApplyIdea}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div 
                onClick={handleImageClick}
                className="relative cursor-pointer group mb-6"
              >
                <div className={`w-40 h-40 rounded-full overflow-hidden border-2 border-dashed
                  ${previewImage ? 'border-transparent' : 'border-gray-300'}
                  flex items-center justify-center bg-gray-50 hover:bg-gray-100
                  transition-colors duration-200`}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
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
                  id="name"
                  name="name" 
                  required 
                  placeholder="Nhập tên nhân vật"
                  className="text-lg"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <Textarea 
                  id="description"
                  name="description" 
                  placeholder="Mô tả về nhân vật"
                  className="h-32 text-base resize-none"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Giới tính</label>
                <select
                  id="gender"
                  name="gender"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  defaultValue=""
                >
                  <option value="">Chọn giới tính</option>
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chiều cao</label>
                <input
                  id="height"
                  type="text"
                  name="height"
                  placeholder="Nhập chiều cao (cm)"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cân nặng</label>
                <input
                  id="weight"
                  type="text"
                  name="weight"
                  placeholder="Nhập cân nặng (kg)"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tính cách</label>
                <Textarea 
                  id="personality"
                  name="personality" 
                  placeholder="Mô tả tính cách"
                  className="h-32 text-base resize-none"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngoại hình</label>
                <Textarea 
                  id="appearance"
                  name="appearance" 
                  placeholder="Mô tả ngoại hình"
                  className="h-32 text-base resize-none"
                  defaultValue=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quá khứ</label>
                <Textarea 
                  id="background"
                  name="background" 
                  placeholder="Thông tin về xuất thân, quá khứ"
                  className="h-32 text-base resize-none"
                  defaultValue=""
                />
              </div>

              <input type="hidden" name="role" value={role} />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Đang tạo...' : 'Tạo nhân vật'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`/stories/${storyId}?tab=characters`)}
                className="min-w-[120px]"
              >
                Hủy
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div>Đang tải thông tin truyện...</div>
      )}
    </div>
  )
} 