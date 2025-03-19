/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CreateChapterContent({ 
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
      const status = 'draft'

      const response = await fetch(`/api/stories/${storyId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, status })
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo chương mới')
      }

      toast.success('Tạo chương mới thành công!')
      // Chuyển hướng về đúng tab dựa vào status
      router.push(`/stories/${storyId}?tab=chapters&status=${status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Quay về tab chapters với status mặc định là draft
    router.push(`/stories/${storyId}?tab=chapters&status=draft`)
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Tạo chương mới</h1>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <span className="sr-only">Quay lại</span>
            ← Quay lại
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề chương</Label>
              <Input
                id="title"
                name="title"
                placeholder="Nhập tiêu đề chương"
                required
                className="w-full"
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
                {isLoading ? "Đang tạo..." : "Tạo chương"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 