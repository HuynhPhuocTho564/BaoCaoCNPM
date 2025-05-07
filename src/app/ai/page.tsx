"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Plus, Send, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Message, chat } from "@/lib/gemini-chat"
import ReactMarkdown from "react-markdown"

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const stream = await chat(input, messages)
      const reader = stream.getReader()
      let accumulatedResponse = ""

      // Chỉ thêm tin nhắn assistant khi có nội dung đầu tiên
      let isFirstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        accumulatedResponse += value
        
        if (isFirstChunk) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: accumulatedResponse
          }])
          isFirstChunk = false
        } else {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = accumulatedResponse
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 py-12 text-center">
            <MessageCircle className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Trợ Lý Phát Triển Truyện Chat
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Trợ lý thông minh giúp bạn phát triển ý tưởng, xây dựng cốt truyện và sáng tạo nội dung cho câu chuyện của mình.
            </p>
          </div>
        ) : (
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
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
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
        )}
      </div>

      <div className="border-t bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form className="flex gap-3 items-end" onSubmit={handleSubmit}>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-[56px] w-[56px]"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="Nhập câu hỏi của bạn..."
                className="min-h-[56px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-[56px] w-[56px]"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
