import CreateChapterContent from "./CreateChapterContent"

export default function CreateChapterPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <CreateChapterContent storyId={params.id} />
} 