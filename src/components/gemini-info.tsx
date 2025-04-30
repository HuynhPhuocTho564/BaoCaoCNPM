"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Wand2, MessageSquare, BookOpen, Users2, Image, ExternalLink } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function GeminiInfo() {
  const router = useRouter()
  const { startLoading } = useLoading()

  const features: Feature[] = [
    {
      icon: Brain,
      title: "Tạo Ý Tưởng Truyện",
      description: "AI giúp bạn phát triển ý tưởng truyện độc đáo với tiêu đề, mô tả và thể loại phù hợp."
    },
    {
      icon: Users2,
      title: "Phát Triển Nhân Vật",
      description: "Tạo và hoàn thiện nhân vật với thông tin chi tiết về ngoại hình, tính cách và tiểu sử."
    },
    {
      icon: MessageSquare,
      title: "Tạo Hội Thoại",
      description: "Tự động tạo các đoạn hội thoại tự nhiên và hấp dẫn giữa các nhân vật."
    },
    {
      icon: BookOpen,
      title: "Quản Lý Chương",
      description: "Hỗ trợ tạo và chỉnh sửa nội dung từng chương với tóm tắt chi tiết."
    },
    {
      icon: Wand2,
      title: "Tạo Đại Cương",
      description: "Phát triển cấu trúc tổng thể cho truyện với các đại cương chi tiết."
    },
    {
      icon: Image,
      title: "Tạo Prompt Hình Ảnh",
      description: "Tự động tạo prompt cho ảnh bìa và avatar nhân vật phù hợp với nội dung."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sức Mạnh của Gemini AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Khám phá những tính năng thông minh giúp sáng tạo nội dung truyện
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-background to-background/80 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Hãy Bắt Đầu Hành Trình Sáng Tạo
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Với sự hỗ trợ của Gemini AI, việc sáng tác truyện chưa bao giờ dễ dàng đến thế.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium"
              onClick={() => {
                startLoading('/stories')
                router.push('/stories')
              }}
            >
              Bắt Đầu Viết Ngay
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-primary/30 rounded-full font-medium 
                inline-flex items-center justify-center gap-2 hover:bg-primary/10"
            >
              Khám Phá AI Studio
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
