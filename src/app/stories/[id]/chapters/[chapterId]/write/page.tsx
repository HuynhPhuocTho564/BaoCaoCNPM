import WriteChapterContent from "./WriteChapterContent"

export default function WriteChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  return <WriteChapterContent storyId={params.id} chapterId={params.chapterId} />
} 