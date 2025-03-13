import { Suspense } from "react"
import CreateCharacterContent from "./CreateCharacterContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function CreateCharacterPage({ 
  params,
}: { 
  params: { id: string }
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateCharacterContent storyId={params.id} />
    </Suspense>
  )
} 