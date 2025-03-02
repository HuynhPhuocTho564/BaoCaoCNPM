/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState(session?.user?.avatar || '/default-user.webp')

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Lỗi khi tải lên ảnh')

      const data = await response.json()
      setAvatar(data.avatar)
      await update({ avatar: data.avatar })
      toast.success('Cập nhật ảnh đại diện thành công!')
    } catch (error) {
      toast.error('Đã có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Cài đặt tài khoản</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin tài khoản và cài đặt bảo mật của bạn
          </p>
        </div>

        <div className="grid gap-6 mt-8">
          <Card className="bg-background dark:bg-[#1C1D21] transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
              <CardDescription>
                Cập nhật ảnh đại diện của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <img 
                src={avatar} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Cho phép PNG, JPG hoặc GIF. Tối đa 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background dark:bg-[#1C1D21] transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ''}
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={session?.user?.email || ''}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Email không thể thay đổi.
                </p>
              </div>
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>

          <Card className="bg-background dark:bg-[#1C1D21] transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
              <Button variant="secondary">Đổi mật khẩu</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive bg-background dark:bg-[#1C1D21] transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-destructive">Xóa tài khoản</CardTitle>
              <CardDescription>
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Xóa tài khoản</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
