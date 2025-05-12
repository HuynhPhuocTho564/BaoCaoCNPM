/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Message } from "@/lib/gemini-chat-config"
import { chat } from "@/lib/gemini-chat"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { ChatMessages } from "./components/ChatMessages"
import { ChatInput } from "./components/ChatInput"
import { ChatSidebar } from "./components/ChatSidebar"
import { toast } from "sonner"
import { 
  fetchChatHistory as fetchChatHistoryApi, 
  fetchChatMessages, 
  deleteChat, 
  saveMessage, 
  createStory,
  fetchCategories,
  updateMessageStatus,
  fetchUserStories
} from './api/chatApi'

interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Tag {
  id: number;
  name: string;
  description: string;
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
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [commandStatus, setCommandStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [stories, setStories] = useState<any[]>([])
  const [cachedStories, setCachedStories] = useState<any[]>([])

  useEffect(() => {
    if (!isSupporter && messages.length > 0) {
      redirect('/')
    }
  }, [isSupporter, messages])

  useEffect(() => {
    if (isSupporter) {
      fetchChatHistory()
      // Tải trước danh sách truyện cùng với categories và tags
      const fetchData = async () => {
        try {
          const [categoriesData] = await Promise.all([
            fetchCategories(),
            prefetchStories()
          ])
          setCategories(categoriesData.mainCategories)
          setTags(categoriesData.tags)
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error)
          toast.error("Có lỗi xảy ra khi tải dữ liệu")
        }
      }
      fetchData()
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

  const handleCreateStory = async (params: {
    title: string;
    description: string;
    mainCategoryId: string;
    tagIds: number[];
  }) => {
    try {
      setCommandStatus('loading')
      await createStory(params)
      
      setCommandStatus('success')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        // Cập nhật trạng thái trong CSDL
        if (lastMessage?.id) {
          await updateMessageStatus(lastMessage.id, 'success')
        }
        
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg) {
            lastMsg.content = lastMsg.content.replace(
              /\/create-story\s*({[\s\S]*?})/,
              (match) => `${match}\n\n✅ Đã tạo truyện thành công!`
            )
            lastMsg.command_status = 'success'
          }
          return newMessages
        })
      }

      toast.success('Đã tạo truyện thành công!')
    } catch (error) {
      console.error('Lỗi khi tạo truyện:', error)
      
      setCommandStatus('error')
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        // Cập nhật trạng thái trong CSDL
        if (lastMessage?.id) {
          await updateMessageStatus(lastMessage.id, 'error')
        }
        
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg) {
            lastMsg.content = lastMsg.content.replace(
              /\/create-story\s*({[\s\S]*?})/,
              (match) => `${match}\n\n❌ Có lỗi xảy ra khi tạo truyện!`
            )
            lastMsg.command_status = 'error'
          }
          return newMessages
        })
      }
      
      toast.error('Có lỗi xảy ra khi tạo truyện')
    }
  }

  const prefetchStories = async () => {
    try {
      const userStories = await fetchUserStories()
      setCachedStories(userStories)
    } catch (error) {
      console.error('Lỗi khi tải danh sách truyện:', error)
    }
  }

  const handleListStories = async () => {
    try {
      setCommandStatus('loading')
      // Sử dụng danh sách truyện đã cache
      setStories(cachedStories)
      setCommandStatus('success')

      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        if (lastMessage?.id) {
          await updateMessageStatus(lastMessage.id, 'success')
        }
        
        // Thêm danh sách truyện vào nội dung tin nhắn
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg) {
            lastMsg.content = `${lastMsg.content}\n\nDanh sách truyện của bạn:`
            lastMsg.command_status = 'success'
            lastMsg.stories = cachedStories
          }
          return newMessages
        })
      }

    } catch (error) {
      console.error('Lỗi khi xem danh sách truyện:', error)
      setCommandStatus('error')

      // Cập nhật trạng thái lỗi trong tin nhắn cuối
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        if (lastMessage?.id) {
          await updateMessageStatus(lastMessage.id, 'error')
        }
        
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg) {
            lastMsg.command_status = 'error'
          }
          return newMessages
        })
      }

      toast.error('Có lỗi xảy ra khi tải danh sách truyện')
    }
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
    
    try {
      // Lưu tin nhắn người dùng và lấy chatId
      const imageBuffers = imageFiles.length > 0 
        ? await Promise.all(imageFiles.map(async (file) => ({
            buffer: Array.from(new Uint8Array(await file.arrayBuffer())),
            mimeType: file.type
          })))
        : undefined

      // Lưu tin nhắn người dùng và đợi kết quả
      const userMessageResponse = await saveMessage(currentChatId, "user", input.trim(), imageBuffers)
      const newChatId = userMessageResponse.chatId
      setCurrentChatId(newChatId) // Cập nhật currentChatId ngay lập tức

      const stream = await chat(
        input, 
        messages, 
        imageFiles, 
        handleCreateStory,
        handleListStories, 
        categories, 
        tags
      )
      const reader = stream.getReader()
      let accumulatedResponse = ""
      const assistantMessage: Message = {
        role: "assistant",
        content: ""
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        accumulatedResponse += value
        
        if (assistantMessage.content === "") {
          assistantMessage.content = accumulatedResponse
          setMessages(prev => [...prev, assistantMessage])
        } else {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = accumulatedResponse
            return newMessages
          })
        }
      }

      // Lưu tin nhắn AI với chatId đã cập nhật
      if (assistantMessage.content !== "") {
        const savedMessage = await saveMessage(newChatId, "assistant", assistantMessage.content)
        // Cập nhật id cho tin nhắn cuối
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].id = savedMessage.messageId
          return newMessages
        })
      }

      await fetchChatHistory()
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      toast.error("Có lỗi xảy ra khi gửi tin nhắn")
      // Xóa tin nhắn người dùng nếu có lỗi
      setMessages(prev => prev.filter(msg => msg !== userMessage))
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
        isLoading={isLoading}
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
              commandStatus={commandStatus}
              stories={stories}
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
