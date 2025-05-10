export interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

export const fetchChatHistory = async () => {
  const res = await fetch('/api/ai/chat-history')
  const data = await res.json()
  return data.history
}

export const fetchChatMessages = async (chatId: number) => {
  const res = await fetch(`/api/ai/chat-history/${chatId}`)
  const data = await res.json()
  return data.messages
}

export const deleteChat = async (chatId: number) => {
  await fetch(`/api/ai/chat-history/${chatId}`, {
    method: 'DELETE'
  })
}

export const saveMessage = async (
  chatId: number | null,
  role: "user" | "assistant",
  content: string,
  images?: { buffer: number[], mimeType: string }[]
) => {
  const res = await fetch('/api/ai/chat-history/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      role,
      content,
      ...(images && { images })
    })
  })
  return await res.json()
} 