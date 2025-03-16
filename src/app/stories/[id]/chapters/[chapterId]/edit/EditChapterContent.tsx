/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { toast } from "sonner"

interface Chapter {
  chapter_id: number
  title: string
  status: 'draft' | 'published'
}

export default function EditChapterContent({ 
  storyId,
  chapterId 
}: { 
  storyId: string
  chapterId: string 
}) {
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(
          `/api/stories/${storyId}/chapters/${chapterId}`
        )
        const data = await response.json()
        
        if (response.ok) {
          setChapter(data.chapter)
        } else {
          toast.error(data.error || 'Không thể tải thông tin chương')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi tải thông tin chương')
      }
    }

    fetchChapter()
  }, [storyId, chapterId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title')
      const status = formData.get('status')

      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, status })
        }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật chương')
      }

      toast.success('Cập nhật chương thành công!')
      router.push(`/stories/${storyId}?tab=chapters&status=${status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (chapter) {
      router.push(`/stories/${storyId}?tab=chapters&status=${chapter.status}`)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi xóa chương')
      }

      toast.success('Xóa chương thành công!')
      router.push(`/stories/${storyId}?tab=chapters&status=${chapter?.status}`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  if (!chapter) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Chỉnh sửa chương</h1>
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
                defaultValue={chapter.title}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select name="status" defaultValue={chapter.status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowDeleteDialog(true)}
              >
                Xóa chương
              </Button>
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
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
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chương này sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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