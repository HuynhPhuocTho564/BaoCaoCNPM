"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { StoryCard } from "@/components/story-card"
import { BookOpenText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  main_category: string
  tags: string[]
  view_count: number
  favorite_count: number
  updated_at: string
}

interface Category {
  id: number
  name: string
  description: string
}

interface Tag {
  id: number
  name: string
  description: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mainCategories, setMainCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"))
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  )

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (response.ok) {
          setMainCategories(data.mainCategories)
          setTags(data.tags)
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách thể loại:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("q", searchQuery)
      if (selectedCategory) params.set("category", selectedCategory)
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
      
      const response = await fetch(`/api/library/search?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setStories(data.stories)
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tìm Kiếm Nâng Cao</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Tìm kiếm</h3>
            <Input
              placeholder="Nhập từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Thể loại</h3>
            <div className="flex flex-wrap gap-2">
              {mainCategories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col">
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-3">
                    <Skeleton height="100%" />
                  </div>
                  <Skeleton width="70%" height={24} className="mb-2" />
                  <Skeleton width="40%" height={20} className="mb-2" />
                  <Skeleton width="30%" height={16} />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Không tìm thấy truyện nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story.story_id} story={story} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}