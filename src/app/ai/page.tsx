"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Message, chat } from "@/lib/gemini-chat"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { ChatMessages } from "./components/ChatMessages"
import { ChatInput } from "./components/ChatInput"

export default function AIPage() {
  const { data: session } = useSession()
  const isSupporter = session?.user?.hasBadge

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

  useEffect(() => {
    if (!isSupporter && messages.length > 0) {
      redirect('/')
    }
  }, [isSupporter, messages])

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

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      images: selectedImages
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const stream = await chat(input, messages, imageFiles)
      const reader = stream.getReader()
      let accumulatedResponse = ""
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
      handleClearAllImages()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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
  )
}
