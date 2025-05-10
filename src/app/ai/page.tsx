"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Message, chat } from "@/lib/gemini-chat"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { ChatMessages } from "./components/ChatMessages"
import { ChatInput } from "./components/ChatInput"
import { ChatSidebar } from "./components/ChatSidebar"
import { toast } from "sonner"
import { fetchChatHistory as fetchChatHistoryApi, fetchChatMessages, deleteChat, saveMessage } from './api/chatApi'

interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

export default function AIPage() {
  const { data: session } = useSession()
  const isSupporter = session?.user?.hasBadge

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<number | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isSupporter && messages.length > 0) {
      redirect('/')
    }
  }, [isSupporter, messages])

  useEffect(() => {
    if (isSupporter) {
      fetchChatHistory()
    }
  }, [isSupporter])

  const fetchChatHistory = async () => {
    try {
      const history = await fetchChatHistoryApi()
      setChatHistory(history)
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error)
    }
  }

  const handleSelectChat = async (chatId: number) => {
    try {
      const messages = await fetchChatMessages(chatId)
      setMessages(messages)
      setCurrentChatId(chatId)
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
  }

  const handleDeleteChat = async (chatId: number) => {
    try {
      await deleteChat(chatId)
      await fetchChatHistory()
      if (currentChatId === chatId) {
        handleNewChat()
      }
      toast.success('Đã xóa cuộc trò chuyện thành công')
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error)
      toast.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại sau.')
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setImageFiles(prev => [...prev, file])
    setSelectedImages(prev => [...prev, imageUrl])
  }

  const handleClearImage = (index: number) => {
    URL.revokeObjectURL(selectedImages[index])
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearAllImages = () => {
    selectedImages.forEach(url => URL.revokeObjectURL(url))
    setSelectedImages([])
    setImageFiles([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isSupporter) return
    e.preventDefault()
    if ((!input.trim() && !imageFiles.length) || isLoading) return
    const formData = new FormData()
    imageFiles.forEach(file => {
      formData.append('images', file)
    })
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      images: selectedImages.map((url, index) => ({
        fileId: `temp-${index}`,
        url
      }))
    }

    // Hiển thị tin nhắn người dùng ngay lập tức
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    let newChatId = currentChatId
    
    try {
      // Lưu tin nhắn người dùng ở background
      const imageBuffers = imageFiles.length > 0 
        ? await Promise.all(imageFiles.map(async (file) => ({
            buffer: Array.from(new Uint8Array(await file.arrayBuffer())),
            mimeType: file.type
          })))
        : undefined

      const saveUserMessage = saveMessage(currentChatId, "user", input.trim(), imageBuffers)
        .then(data => {
          newChatId = data.chatId
        })
        .catch(error => {
          console.error("Lỗi khi lưu tin nhắn người dùng:", error)
          // Xóa tin nhắn người dùng nếu lưu thất bại
          setMessages(prev => prev.filter(msg => msg !== userMessage))
          throw error
        })

      // Gọi API chat ngay không đợi lưu xong
      const stream = await chat(input, messages, imageFiles)
      const reader = stream.getReader()
      let accumulatedResponse = ""
      let isFirstChunk = true
      let assistantMessage: Message

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        accumulatedResponse += value
        
        if (isFirstChunk) {
          assistantMessage = {
            role: "assistant",
            content: accumulatedResponse
          } as Message
          setMessages(prev => [...prev, assistantMessage])
          isFirstChunk = false
        } else {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = accumulatedResponse
            return newMessages
          })
        }
      }

      // Đợi lưu tin nhắn người dùng xong
      await saveUserMessage

      // Lưu tin nhắn AI
      await saveMessage(newChatId, "assistant", accumulatedResponse)
        .catch(error => {
          console.error("Lỗi khi lưu tin nhắn AI:", error)
          // Xóa tin nhắn AI nếu lưu thất bại
          if (assistantMessage) {
            setMessages(prev => prev.filter(msg => msg !== assistantMessage))
          }
        })

      await fetchChatHistory()
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      toast.error("Có lỗi xảy ra khi gửi tin nhắn")
    } finally {
      setIsLoading(false)
      handleClearAllImages()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : isSupporter ? (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              chatContainerRef={chatContainerRef}
              messagesEndRef={messagesEndRef}
            />
          ) : null}
        </div>
        {isSupporter && (
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            selectedImages={selectedImages}
            onImageUpload={handleImageUpload}
            onClearImage={handleClearImage}
            onClearAllImages={handleClearAllImages}
          />
        )}
      </div>
    </div>
  )
}
