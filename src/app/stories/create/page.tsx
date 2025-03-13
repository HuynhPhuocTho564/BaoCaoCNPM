/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

<<<<<<< HEAD
interface MainCategory {
  id: number
  name: string
  description?: string
}

interface Tag {
  id: number
  name: string
  description?: string
=======
interface Category {
  id: number
  name: string
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
}

export default function CreateStoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
<<<<<<< HEAD
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
=======
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
  const [previewImage, setPreviewImage] = useState<string>("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (response.ok) {
<<<<<<< HEAD
          setMainCategories(data.mainCategories)
          setTags(data.tags)
=======
          setCategories(data.categories)
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
        }
      } catch (error) {
        toast.error('Không thể tải danh sách thể loại')
      }
    }

    fetchCategories()
  }, [])

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

<<<<<<< HEAD
  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
=======
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
<<<<<<< HEAD
    if (!selectedMainCategory) {
      toast.error('Vui lòng chọn thể loại chính')
=======
    if (selectedCategories.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thể loại')
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
      return
    }
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
<<<<<<< HEAD
      formData.set('mainCategoryId', selectedMainCategory.toString())
      formData.set('tagIds', JSON.stringify(selectedTags))
=======
      formData.set('categoryIds', JSON.stringify(selectedCategories))
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
      
      const response = await fetch('/api/stories/create', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Lỗi khi tạo truyện')
      }

      toast.success('Tạo truyện mới thành công!')
      router.push('/stories')
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tạo truyện mới</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="coverImage">Ảnh bìa</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="hidden"
            />
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('coverImage')?.click()}
            >
              {previewImage ? (
                <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="py-12">
                  <p className="text-muted-foreground">
                    Nhấn để chọn ảnh bìa
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Định dạng: JPG, PNG (Tỷ lệ 3:4)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              placeholder="Nhập tiêu đề truyện"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <div className="relative">
              <TextareaAutosize
                id="description"
                name="description"
                placeholder="Nhập mô tả ngắn về truyện"
                required
                minRows={3}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

<<<<<<< HEAD
          <div className="space-y-6">
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
=======
          <div className="space-y-3">
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
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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
<<<<<<< HEAD
              disabled={isLoading || !selectedMainCategory}
=======
              disabled={isLoading || selectedCategories.length === 0}
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
            >
              {isLoading ? 'Đang tạo...' : 'Tạo truyện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 