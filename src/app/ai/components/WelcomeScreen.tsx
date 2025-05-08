import { MessageCircle, Lock, Sparkles, Zap, Crown, Rocket } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useLoading } from "@/providers/loading-provider"

export function WelcomeScreen() {
  const { data: session } = useSession()
  const isSupporter = session?.user?.hasBadge
  const router = useRouter()
  const { startLoading } = useLoading()

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative mb-6">
        <MessageCircle className="h-16 w-16 text-primary" />
        <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Trợ Lý Phát Triển Truyện Chat
      </h1>
      
      {isSupporter ? (
        <div className="space-y-6 max-w-2xl">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Trợ lý thông minh giúp bạn phát triển ý tưởng, xây dựng cốt truyện và sáng tạo nội dung cho câu chuyện của mình.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
              <div className="flex justify-center">
                <Zap className="h-6 w-6 text-primary mb-2" />
              </div>
              <h3 className="font-semibold mb-1">Sáng Tạo Nhanh</h3>
              <p className="text-sm text-muted-foreground">Phát triển ý tưởng truyện trong vài phút</p>
            </div>
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
              <div className="flex justify-center">
                <Crown className="h-6 w-6 text-primary mb-2" />
              </div>
              <h3 className="font-semibold mb-1">Chất Lượng Cao</h3>
              <p className="text-sm text-muted-foreground">Nội dung độc đáo và hấp dẫn</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-xl border">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Tính năng dành riêng cho người ủng hộ
            </h2>
            <ul className="space-y-3 text-base text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span>Tạo truyện thông qua trò chuyện tự nhiên với AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span>Nhận huy hiệu người ủng hộ đặc biệt</span>
              </li>
              <li className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-500" />
                <span>Truy cập sớm các tính năng mới</span>
              </li>
            </ul>
            <Button 
              variant="default" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                startLoading('/products')
                router.push('/products')
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Trở thành người ủng hộ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 