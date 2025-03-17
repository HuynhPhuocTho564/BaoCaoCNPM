import { Suspense } from "react"
import StoryDetailContent from "./StoryDetailContent"

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải thông tin truyện...</p>
      </div>
    </div>
  )
}

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StoryDetailContent storyId={params.id} />
    </Suspense>
  )
} 