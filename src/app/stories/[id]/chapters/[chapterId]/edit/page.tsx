import EditChapterContent from "./EditChapterContent"

export default function EditChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  return <EditChapterContent storyId={params.id} chapterId={params.chapterId} />
} 