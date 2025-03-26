<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unused-vars */
=======
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
"use client"

import * as React from "react"
import { MessageCircle, X, Send, Trash2 } from "lucide-react"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { chatWithAssistant, Message } from "@/lib/chat-bot"
<<<<<<< HEAD
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypePrism from 'rehype-prism-plus'

// Import CSS cần thiết
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
=======
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89

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
      const streamResponse = await chatWithAssistant(
        inputMessage,
        messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        true
      ) as ReadableStream;

      // Tạo message trống cho assistant
      setMessages(prev => [...prev, {
        role: "assistant",
        content: ""
      }]);

      const reader = streamResponse.getReader();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkText = value.text();
        accumulatedResponse += chunkText;
        
        // Cập nhật tin nhắn cuối cùng với nội dung mới
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = accumulatedResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setIsLoading(false);
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
<<<<<<< HEAD
          "bg-background rounded-lg shadow-lg",
=======
          "bg-white rounded-lg shadow-lg",
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
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
<<<<<<< HEAD
                    : "bg-muted/50 prose prose-stone dark:prose-invert max-w-none"
                )}
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight, rehypePrism]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-transparent p-0" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
                      ),
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-2">
                          <table className="min-w-full border-collapse border border-gray-300" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="border border-gray-300 px-4 py-2" {...props} />
                      ),
                      a: ({node, ...props}) => (
                        <a className="text-blue-500 hover:text-blue-600 underline" {...props} />
                      ),
                      img: ({node, ...props}) => (
                        <img className="max-w-full h-auto rounded my-2" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
=======
                    : "bg-muted"
                )}
              >
                {message.content}
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
              </div>
            ))
          )}
          {isLoading && (
<<<<<<< HEAD
            <div className="bg-muted/50 rounded-lg p-3 max-w-[80%] animate-pulse">
=======
            <div className="bg-muted rounded-lg p-3 max-w-[80%] animate-pulse">
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
              Đang trả lời...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
<<<<<<< HEAD
        <div className="p-4 border-t border-border bg-background/50">
=======
        <div className="p-4 border-t bg-muted/30">
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
<<<<<<< HEAD
              className="flex-1 px-4 py-3 border border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[50px] max-h-[150px]"
=======
              className="flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[50px] max-h-[150px]"
>>>>>>> 9940022f571deded270f377aaccad74f1b307c89
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