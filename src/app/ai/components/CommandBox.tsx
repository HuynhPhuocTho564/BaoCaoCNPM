/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"

interface Story {
  story_id: number
  title: string
  description: string
  cover_image: string | null
  status: string
  view_count: number
  main_category: string
  tags: string[]
  favorite_count: number
  updated_at: string
}

interface CommandBoxProps {
  command: string
  status: 'loading' | 'success' | 'error'
  params?: Record<string, any>
  stories?: Story[]
}

export function CommandBox({ command, status, params, stories }: CommandBoxProps) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4 my-2 space-y-2">
      <div className="flex items-center gap-2">
        {status === 'loading' && (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">
          {command === '/create-story' && (
            <>
              {status === 'loading' && 'Đang tạo truyện mới...'}
              {status === 'success' && 'Đã tạo truyện thành công!'}
              {status === 'error' && 'Có lỗi xảy ra khi tạo truyện!'}
            </>
          )}
          {command === '/list-stories' && (
            <>
              {status === 'loading' && 'Đang tải danh sách truyện...'}
              {status === 'success' && 'Danh sách truyện của bạn:'}
              {status === 'error' && 'Có lỗi xảy ra khi tải danh sách truyện!'}
            </>
          )}
        </span>
      </div>
      
      {params && command === '/create-story' && (
        <div className={`text-sm space-y-1 ${
          status === 'success' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-muted-foreground'
        }`}>
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{key}:</span>
              <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
            </div>
          ))}
        </div>
      )}

      {stories && command === '/list-stories' && status === 'success' && (
        <div className="grid gap-4 mt-4">
          {stories.map((story) => (
            <div key={story.story_id} className="flex gap-4 p-4 bg-background rounded-lg">
              <div className="relative w-24 h-32 flex-shrink-0">
                {story.cover_image ? (
                  <Image
                    src={story.cover_image}
                    alt={story.title}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{story.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {story.main_category}
                  </span>
                  {story.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                  <span>👁️ {story.view_count} lượt xem</span>
                  <span>❤️ {story.favorite_count} lượt thích</span>
                  <span>📅 {new Date(story.updated_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 