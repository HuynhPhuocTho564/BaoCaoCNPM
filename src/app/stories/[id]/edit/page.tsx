/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from 'react-textarea-autosize'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"
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
import { Suspense } from "react"

interface Category {
  id: number
  name: string
}

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  category_ids: number[]
  status: 'draft' | 'published' | 'archived'
}

function EditStoryContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [story, setStory] = useState<Story | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories)

        // Fetch story details
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const storyData = await storyResponse.json()
        
        if (storyResponse.ok) {
          setStory(storyData.story)
          setSelectedCategories(storyData.story.category_ids)
          setPreviewImage(storyData.story.cover_image || "")
        } else {
          toast.error('Không thể tải thông tin truyện')
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra')
      }
    }

    if (session?.user) {
      fetchData()
    }
  }, [session, storyId])

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
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
    if (selectedCategories.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thể loại')
      return
    }
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('categoryIds', JSON.stringify(selectedCategories))
      
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật truyện')
      }

      toast.success('Cập nhật truyện thành công!')
      router.push('/stories')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xóa truyện')
      }

      toast.success('Xóa truyện thành công')
      router.push('/stories')
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    }
  }

  if (!story) {
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chỉnh sửa truyện</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Xóa truyện</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa truyện</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa truyện này? Hành động này không thể hoàn tác.
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Ảnh bìa</Label>
            <div className="flex items-center gap-4">
              {previewImage && (
                <div className="relative w-32 h-32">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <Input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              defaultValue={story.title}
              placeholder="Nhập tiêu đề truyện"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <TextareaAutosize
              id="description"
              name="description"
              defaultValue={story.description}
              placeholder="Nhập mô tả ngắn về truyện"
              required
              minRows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Thể loại</Label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                  className="cursor-pointer text-sm px-4 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            {categories.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Đã chọn {selectedCategories.length} thể loại
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || selectedCategories.length === 0}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật truyện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditStoryPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditStoryContent storyId={params.id} />
    </Suspense>
  )
} 