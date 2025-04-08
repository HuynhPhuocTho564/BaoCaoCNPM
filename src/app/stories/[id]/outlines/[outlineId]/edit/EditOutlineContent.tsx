/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { ChevronLeft } from "lucide-react"
import TextareaAutosize from 'react-textarea-autosize'

interface Outline {
  outline_id: number
  title: string
  description: string
}

export default function EditOutlineContent({ 
  storyId,
  outlineId 
}: { 
  storyId: string
  outlineId: string 
}) {
  const router = useRouter()
  const [outline, setOutline] = useState<Outline | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/stories/${storyId}/outlines/${outlineId}`
        )
        const data = await response.json()
        
        if (response.ok) {
          setOutline(data.outline)
        } else {
          toast.error(data.error || 'Không thể tải thông tin đại cương')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [storyId, outlineId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title')
      const description = formData.get('description')

      const response = await fetch(
        `/api/stories/${storyId}/outlines/${outlineId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description })
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật đại cương')
      }

      toast.success('Cập nhật đại cương thành công!')
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/stories/${storyId}/outlines/${outlineId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Lỗi khi xóa đại cương')
      }

      toast.success('Xóa đại cương thành công!')
      router.push(`/stories/${storyId}?tab=outlines`)
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  if (isLoadingData) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton width={200} height={32} />
          </div>

          <div className="rounded-lg border bg-card p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Skeleton width={120} height={20} />
                <Skeleton height={40} />
              </div>

              <div className="space-y-2">
                <Skeleton width={120} height={20} />
                <Skeleton height={100} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Skeleton width={120} height={40} />
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                  <Skeleton width={100} height={40} />
                  <Skeleton width={120} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!outline && !isLoadingData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy đại cương</p>
      </div>
    )
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
          <h1 className="text-xl md:text-2xl font-bold">Chỉnh sửa đại cương</h1>
        </div>
        
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề đại cương</Label>
              <Input
                id="title"
                name="title"
                defaultValue={outline?.title}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <TextareaAutosize
                id="description"
                name="description"
                defaultValue={outline?.description || ""}
                minRows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowDeleteDialog(true)}
              >
                Xóa đại cương
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
              Hành động này không thể hoàn tác. Đại cương này sẽ bị xóa vĩnh viễn.
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