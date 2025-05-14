import { Button } from "@/components/ui/button"
import { Plus, Send, X} from "lucide-react"
import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
}

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  selectedImages: string[]
  onImageUpload: (file: File) => void
  onClearImage: (index: number) => void
  onClearAllImages: () => void
  onStorySelect: (story: Story | null) => void
}

export function ChatInput({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit,
  selectedImages,
  onImageUpload,
  onClearImage,
  onClearAllImages,
  onStorySelect
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        const data = await response.json()
        if (response.ok) {
          setStories(data.stories)
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách truyện:", error)
        toast.error("Không thể tải danh sách truyện")
      } finally {
        setIsLoadingStories(false)
      }
    }
    fetchStories()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        onImageUpload(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(e)
    // Reset textarea height sau khi gửi
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="border-t bg-background/50 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {selectedImages.length > 0 && (
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-40 h-40 flex-shrink-0">
                  <div className="absolute inset-0">
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="absolute top-1 right-1">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => onClearImage(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {selectedImages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllImages}
                className="absolute top-1 right-1"
                disabled={isLoading}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        )}
        
        <form className="flex gap-3 items-end" onSubmit={handleSubmit}>
          <Select
            onValueChange={(value) => {
              const story = stories.find(s => s.story_id.toString() === value)
              onStorySelect(story || null)
            }}
          >
            <SelectTrigger className="w-[200px] h-[56px]">
              <SelectValue placeholder={isLoadingStories ? "Đang tải..." : "Chọn truyện..."} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="0">Không chọn truyện</SelectItem>
              {stories.map((story) => (
                <SelectItem 
                  key={story.story_id} 
                  value={story.story_id.toString()}
                  className="truncate"
                >
                  {story.title} ({story.main_category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-[56px] w-[56px]"
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="Nhập câu hỏi của bạn..."
              className="min-h-[56px] max-h-[200px] resize-none overflow-y-auto px-3 py-4 leading-relaxed"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={isLoading}
              rows={1}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '56px';
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="h-[56px] w-[56px]"
            disabled={isLoading || (!input.trim() && !selectedImages.length)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="text-center mt-2">
          <span className="text-xs text-muted-foreground">
            Gửi tin nhắn bằng Ctrl + Enter | Hỗ trợ tải ảnh lên bằng dấu &quot;+&quot;
          </span>
        </div>
      </div>
    </div>
  )
} 