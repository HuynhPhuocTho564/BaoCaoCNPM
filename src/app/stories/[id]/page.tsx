"use client"

import { Suspense } from "react"
import StoryDetailContent from "./StoryDetailContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StoryDetailContent storyId={params.id} />
    </Suspense>
  )
} 