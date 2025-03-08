"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập đúng định dạng email")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Đăng ký nhận thông tin thành công!")
        setEmail("")
      } else {
        toast.error(data.error || "Đã có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error)
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <Link href="/about" className="hover:text-primary">Giới thiệu</Link>
            <Link href="/services" className="hover:text-primary">Dịch vụ</Link>
            <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
            <Link href="/contact" className="hover:text-primary">Liên hệ</Link>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              asChild
            >
              <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              asChild
            >
              <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              asChild
            >
              <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              asChild
            >
              <Link href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Nhập email để nhận thông tin mới nhất" 
                  type="email" 
                  className="rounded-full" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} ChatStoryAI. Tạo câu chuyện trong mơ.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
