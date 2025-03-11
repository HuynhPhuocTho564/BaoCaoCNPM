/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera } from "lucide-react"
import { toast } from "sonner"

export default function CreateCharacterContent({ 
  storyId,
}: { 
  storyId: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {role === 'main' ? 'Thêm nhân vật chính' : 'Thêm nhân vật phụ'}
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
              name="name" 
              required 
              placeholder="Nhập tên nhân vật"
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <Textarea 
              name="description" 
              placeholder="Mô tả về nhân vật"
              className="h-32 text-base resize-none"
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
    </div>
  )
} 