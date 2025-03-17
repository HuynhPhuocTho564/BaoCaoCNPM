import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenText } from "lucide-react"

interface StoryCardProps {
  story: {
    story_id: number
    title: string
    description: string
    cover_image: string | null
    main_category: string
    view_count: number
    updated_at: string
  }
}

export function StoryCard({ story }: StoryCardProps) {
  const router = useRouter()

  const handleClick = async () => {
    try {
      // Gọi API để tăng lượt xem
      await fetch(`/api/library/${story.story_id}/view`, {
        method: 'POST',
      })
      
      // Chuyển hướng đến trang chi tiết
      router.push(`/library/${story.story_id}`)
    } catch (error) {
      console.error('Lỗi khi cập nhật lượt xem:', error)
      // Vẫn chuyển hướng ngay cả khi không cập nhật được lượt xem
      router.push(`/library/${story.story_id}`)
    }
  }

  return (
    <Card 
      className="flex flex-col overflow-hidden cursor-pointer transition-all hover:border-primary/50"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-[3/4]">
        {story.cover_image ? (
          <Image
            src={story.cover_image}
            alt={story.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpenText className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="p-4 space-y-2">
        <CardTitle className="line-clamp-2 text-lg">{story.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {story.description}
        </p>
      </CardHeader>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full text-sm">
          <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full">
            {story.main_category}
          </span>
          <span className="text-muted-foreground">
            {story.view_count} lượt xem
          </span>
        </div>
      </CardFooter>
    </Card>
  )
} 