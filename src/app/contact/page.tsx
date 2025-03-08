import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold tracking-tight">Liên Hệ</h1>
              <p className="text-lg text-muted-foreground">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">support@chatstoryai.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Điện thoại</h3>
                    <p className="text-muted-foreground">1900 xxx xxx</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Địa chỉ</h3>
                    <p className="text-muted-foreground">
                      Tầng 1, Tòa nhà ABC, Quận 1, TP.HCM
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nhập họ và tên của bạn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Nhập nội dung tin nhắn" 
                    rows={5} 
                  />
                </div>

                <Button type="submit" className="w-full">Gửi tin nhắn</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}