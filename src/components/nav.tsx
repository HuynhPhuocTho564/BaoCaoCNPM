"use client"

import * as React from "react"
import { Header } from "@/components/21st/navbar"
import { Login } from "./login"

// Sample menu items
const menuItems = [
  {
    text: "Trang chủ",
    to: "/"
  },
  {
    text: "Thư viện",
    items: [
      {
        text: "Truyện mới",
        description: "Những truyện mới được tạo",
        to: "/library/new",
      },
      {
        text: "Phổ biến",
        description: "Những truyện được yêu thích nhất",
        to: "/library/popular",
      }
    ]
  },
  {
    text: "Tạo truyện",
    to: "/create"
  },
  {
    text: "Hướng dẫn",
    items: [
      {
        text: "Cách sử dụng",
        description: "Hướng dẫn sử dụng cơ bản",
        to: "/guide/basic",
      },
      {
        text: "Câu hỏi thường gặp",
        description: "Các câu hỏi thường gặp",
        to: "/guide/faq",
      }
    ]
  }
]

// Theme switcher demo
const Nav = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  
  React.useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme as 'light' | 'dark')
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }
  
  return (
    <div className={`w-full ${theme === 'dark' ? 'dark bg-[#0B0C0F]' : 'bg-white'}`}>
      <Header
        theme={theme}
        logo={<span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>ChatStoryAI</span>}
        menuItems={menuItems}
        onThemeChange={toggleTheme}
        rightContent={<Login />}
        isSticky={true}
        withBorder={true}
      />
    </div>
  )
}

// Export all variants
export { Nav }
