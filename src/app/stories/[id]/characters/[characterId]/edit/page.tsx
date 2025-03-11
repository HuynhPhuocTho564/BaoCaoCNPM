import EditCharacterContent from "./EditCharacterContent"

export default function EditCharacterPage({ 
  params 
}: { 
  params: { id: string; characterId: string } 
}) {
  return <EditCharacterContent storyId={params.id} characterId={params.characterId} />
} 