/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"
import TextareaAutosize from 'react-textarea-autosize'

export default function CreateOutlineContent({ 
  storyId 
}: { 
  storyId: string 
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title')
      const description = formData.get('description')

      const response = await fetch(`/api/stories/${storyId}/outlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo đại cương mới')
      }

      toast.success('Tạo đại cương mới thành công!')
      router.push(`/stories/${storyId}?tab=outlines`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/stories/${storyId}?tab=outlines`)
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">Tạo đại cương mới</h1>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề đại cương</Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề đại cương"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <TextareaAutosize
                id="description"
                name="description"
                placeholder="Nhập mô tả chi tiết"
                minRows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Đang tạo..." : "Tạo đại cương"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 