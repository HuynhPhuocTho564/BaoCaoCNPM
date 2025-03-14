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
import { ChevronLeft } from "lucide-react"

interface MainCategory {
  id: number
  name: string
  description?: string
}

interface Tag {
  id: number
  name: string
  description?: string
}

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category_id: number
  tag_ids: number[]
  status: 'draft' | 'published' | 'archived'
}

function EditStoryContent({ storyId }: { storyId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [story, setStory] = useState<Story | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories và tags
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setMainCategories(categoriesData.mainCategories)
        setTags(categoriesData.tags)

        // Fetch story details
        const storyResponse = await fetch(`/api/stories/${storyId}`)
        const { story } = await storyResponse.json()
        
        if (storyResponse.ok && story) {
          setStory(story)
          setSelectedMainCategory(story.main_category_id)
          // Đảm bảo tag_ids là mảng số
          const tagIds = Array.isArray(story.tag_ids) 
            ? story.tag_ids 
            : story.tag_ids?.split(',').map(Number) || []
          setSelectedTags(tagIds)
          setPreviewImage(story.cover_image || "")
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

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
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
    if (!selectedMainCategory) {
      toast.error('Vui lòng chọn thể loại chính')
      return
    }
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set('mainCategoryId', selectedMainCategory.toString())
      formData.set('tagIds', JSON.stringify(selectedTags))
      
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật truyện')
      }

      toast.success('Cập nhật truyện thành công!')
      router.push('/stories')
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

  const checkPublishConditions = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/chapters`)
      const data = await response.json()
      
      if (response.ok) {
        return data.chapters.some((chapter: any) => chapter.status === 'published')
      }
      return false
    } catch (error) {
      return false
    }
  }

  const handlePublish = async () => {
    try {
      const canPublish = await checkPublishConditions(storyId)
      if (!canPublish) {
        toast.error('Cần có ít nhất một chương đã xuất bản để xuất bản truyện')
        return
      }

      const response = await fetch(`/api/stories/${storyId}/publish`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('Lỗi khi xuất bản truyện')
      }

      toast.success('Xuất bản truyện thành công!')
      router.refresh()
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
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chỉnh sửa truyện</h1>
          <div className="flex gap-2">
            {story.status === 'draft' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default">Xuất bản truyện</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xuất bản truyện</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xuất bản truyện này?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish}>
                      Xuất bản
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Xóa truyện</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa truyện</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <TextareaAutosize
              id="description"
              name="description"
              defaultValue={story.description}
              required
              minRows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Thể loại chính</Label>
            <div className="flex flex-wrap gap-3">
              {mainCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedMainCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer text-sm px-4 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setSelectedMainCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            {!selectedMainCategory && (
              <p className="text-sm text-destructive">Vui lòng chọn một thể loại chính</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Thẻ phụ</Label>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer text-sm px-4 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Đã chọn {selectedTags.length} thẻ
            </p>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/stories')}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật truyện"}
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