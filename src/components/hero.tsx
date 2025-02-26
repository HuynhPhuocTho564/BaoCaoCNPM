import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Hero() {
  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 items-center md:grid-cols-2">
          <div className="flex gap-3 flex-col">
            <div>
              <Badge variant="outline" className="text-sm">Mới ra mắt!</Badge>
            </div>
            <div className="flex gap-3 flex-col">
              <h1 className="text-4xl md:text-6xl max-w-lg tracking-tighter text-left font-regular">
                Khám phá thế giới truyện AI
              </h1>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Tạo và đọc những câu chuyện độc đáo được viết bởi AI. 
                Hãy để trí tưởng tượng của bạn bay cao cùng công nghệ 
                AI hiện đại.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="default" className="gap-2" variant="outline">
                Bắt đầu đọc <MoveRight className="w-4 h-4" />
              </Button>
              <Button size="default" className="gap-2">
                Viết truyện ngay <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-md aspect-square"></div>
            <div className="bg-muted rounded-md row-span-2"></div>
            <div className="bg-muted rounded-md aspect-square"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
