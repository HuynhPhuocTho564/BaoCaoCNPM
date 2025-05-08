import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Send, X } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  selectedImages: string[]
  onImageUpload: (file: File) => void
  onClearImage: (index: number) => void
  onClearAllImages: () => void
}

export function ChatInput({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit,
  selectedImages,
  onImageUpload,
  onClearImage,
  onClearAllImages
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        onImageUpload(file)
      })
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
        <form className="flex gap-3 items-end" onSubmit={onSubmit}>
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
            <Input
              placeholder="Nhập câu hỏi của bạn..."
              className="min-h-[56px]"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={isLoading}
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
      </div>
    </div>
  )
} 