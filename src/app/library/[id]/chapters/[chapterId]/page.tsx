import { Suspense } from "react"
import ChapterContent from "./ChapterContent"

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải nội dung chương...</p>
      </div>
    </div>
  )
}

export default function ChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChapterContent storyId={params.id} chapterId={params.chapterId} />
    </Suspense>
  )
} 