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
  updateMessageStatus
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

interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
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
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  useEffect(() => {
    if (!isSupporter && messages.length > 0) {
      redirect('/')
    }
  }, [isSupporter, messages])

  useEffect(() => {
    if (isSupporter) {
      fetchChatHistory()
      // Lấy danh sách thể loại và tag
      const fetchData = async () => {
        try {
          const data = await fetchCategories()
          setCategories(data.mainCategories)
          setTags(data.tags)
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

  const handleCreateCharacter = async (params: {
    storyId: number;
    name: string;
    description: string;
    role: 'main' | 'supporting';
    gender: string;
    birthday: string;
    height: string;
    weight: string;
    personality: string;
    appearance: string;
    background: string;
  }) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const response = await fetch(`/api/stories/${params.storyId}/characters`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Không thể tạo nhân vật');
      }

      toast.success('Đã tạo nhân vật thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo nhân vật:', error);
      toast.error('Có lỗi xảy ra khi tạo nhân vật');
      throw error;
    }
  };

  const handleCreateChapter = async (params: {
    title: string;
    summary: string;
    status: 'draft' | 'published';
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi tạo chương');
      throw new Error('Không có truyện được chọn');
    }

    try {
      const response = await fetch(`/api/stories/${selectedStory.story_id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Không thể tạo chương mới');
      }

      toast.success('Đã tạo chương mới thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo chương:', error);
      toast.error('Có lỗi xảy ra khi tạo chương');
      throw error;
    }
  };

  const handleCreateOutline = async (params: {
    title: string;
    description: string;
  }) => {
    if (!selectedStory) {
      toast.error('Vui lòng chọn truyện trước khi tạo đại cương');
      throw new Error('Không có truyện được chọn');
    }

    try {
      const response = await fetch(`/api/stories/${selectedStory.story_id}/outlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Không thể tạo đại cương mới');
      }

      toast.success('Đã tạo đại cương mới thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo đại cương:', error);
      toast.error('Có lỗi xảy ra khi tạo đại cương');
      throw error;
    }
  };

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
      const userMessageResponse = await saveMessage(
        currentChatId, 
        "user", 
        input.trim(), 
        imageBuffers,
        selectedStory?.story_id
      )
      const newChatId = userMessageResponse.chatId
      setCurrentChatId(newChatId)

      // Thu thập toàn bộ phản hồi trước khi lưu
      let fullResponse = ""
      const result = await chat(
        input,
        messages,
        imageFiles,
        handleCreateStory,
        handleCreateCharacter,
        handleCreateChapter,
        handleCreateOutline,
        categories,
        tags,
        selectedStory
      )
      const reader = result.getReader()
      const assistantMessage: Message = {
        role: "assistant",
        content: ""
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        fullResponse += value
        
        if (assistantMessage.content === "") {
          assistantMessage.content = fullResponse
          setMessages(prev => [...prev, assistantMessage])
        } else {
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = fullResponse
            return newMessages
          })
        }
      }

      // Lưu toàn bộ phản hồi sau khi đã thu thập xong
      if (fullResponse !== "") {
        const savedMessage = await saveMessage(newChatId, "assistant", fullResponse)
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
              onStorySelect={setSelectedStory}
            />
          )}
        </div>
      </div>
  )
}
