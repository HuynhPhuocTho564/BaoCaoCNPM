/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from "@/lib/gemini-chat-config"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { CommandBox } from "./CommandBox"
import { useState, useEffect } from "react"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  chatContainerRef: React.RefObject<HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  commandStatus: 'loading' | 'success' | 'error' | null
}

export function ChatMessages({ messages, isLoading, chatContainerRef, messagesEndRef, commandStatus }: ChatMessagesProps) {
  const [commandParams, setCommandParams] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.content) {
      const match = lastMessage.content.match(/\/create-story\s*({[\s\S]*?})/);
      if (match) {
        try {
          const params = JSON.parse(match[1]);
          setCommandParams(params)
        } catch (error) {
          console.error("Lỗi khi parse params:", error)
          setCommandParams(null)
        }
      } else {
        setCommandParams(null)
      }
    }
  }, [messages])

  const processMessageContent = (content: string) => {
    // Ẩn lệnh /create-story và JSON params ngay khi xuất hiện
    const parts = content.split('/create-story')
    if (parts.length > 1) {
      // Chỉ giữ lại phần trước lệnh /create-story
      return parts[0].trim()
    }
    return content
  }

  return (
    <div ref={chatContainerRef} className="h-full overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-4 max-w-[80%] space-y-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {(message.images && message.images.filter(img => img.url).length > 0) && (
                <div className="flex gap-2 mb-4">
                  {message.images?.map((image, index) => (
                    image.url && (
                      <div key={index} className="relative w-40 h-40">
                        <Image
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    )
                  ))}
                </div>
              )}
              {message.content && (
                <ReactMarkdown>
                  {processMessageContent(message.content)}
                </ReactMarkdown>
              )}
              
              {index === messages.length - 1 && commandParams && (
                <CommandBox 
                  command="/create-story"
                  status={commandStatus || 'loading'}
                  params={commandParams}
                />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4 animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 