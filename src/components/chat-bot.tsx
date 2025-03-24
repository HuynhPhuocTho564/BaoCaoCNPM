"use client"

import * as React from "react"
import { MessageCircle, X, Send, Trash2 } from "lucide-react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { chatWithAssistant, Message } from "@/lib/chat-bot"

interface ChatBotProps {
  className?: string
}

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputMessage, setInputMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  const pathname = usePathname()
  const chatRef = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      role: "user",
      content: inputMessage.trim()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await chatWithAssistant(
        inputMessage,
        messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }))
      )

      setMessages(prev => [...prev, {
        role: "assistant",
        content: response
      }])
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('chatHistory')
  }

  if (!pathname?.includes("/stories")) {
    return null
  }

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={chatRef}>
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg",
          "w-[400px] h-[600px]",
          "transition-all duration-300 ease-in-out",
          "absolute bottom-16 right-0",
          "flex flex-col",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Trợ lý Truyện</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
              aria-label="Xóa lịch sử chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Chào mừng bạn đến với Trợ lý Truyện! Hãy đặt câu hỏi để bắt đầu.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={clsx(
                  "mb-4 max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))
          )}
          {isLoading && (
            <div className="bg-muted rounded-lg p-3 max-w-[80%] animate-pulse">
              Đang trả lời...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[50px] max-h-[150px]"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={clsx(
                "p-3 rounded-xl flex-shrink-0 h-[50px] w-[50px] flex items-center justify-center",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "p-4 rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-lg",
          "hover:bg-primary/90",
          "transition-all duration-300 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "flex items-center gap-2",
          className
        )}
        aria-label="Mở trợ lý truyện"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Trợ lý</span>
      </button>
    </div>
  )
} 