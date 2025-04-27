"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Brain, // For AI intelligence
  BookOpenCheck, // For library
  Wand2, // For creativity
  Users2, // For community
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      // Kill any existing animations
      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Create new animation
      const animation = gsap.to(contentRef.current, {
        height: isHovered ? "auto" : 0,
        opacity: isHovered ? 1 : 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          if (!isHovered && contentRef.current) {
            contentRef.current.style.height = "0px";
            contentRef.current.style.opacity = "0";
          }
        }
      });

      // Store the animation reference
      animationRef.current = animation;

      // Cleanup
      return () => {
        animation.kill();
      };
    }
  }, [isHovered]);

  return (
    <div 
      className={`
        flex flex-col rounded-xl border border-border/40
        bg-gradient-to-br from-background/80 to-background
        hover:shadow-2xl hover:shadow-primary/20
        hover:border-primary/40 hover:from-primary/5 hover:to-background
        transition-all duration-300
        backdrop-blur-sm
        ${isHovered ? 'ring-2 ring-primary/40 shadow-xl shadow-primary/20' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4 p-8">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 
          flex items-center justify-center shadow-lg shadow-primary/10
          group-hover:shadow-primary/30 transition-all duration-300">
          {icon}
        </div>
        <h3 className="font-semibold text-2xl text-foreground tracking-tight">{title}</h3>
      </div>
      <div 
        ref={contentRef} 
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-8 pb-8 pt-0">
          <p className="text-muted-foreground/80 leading-relaxed text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <Brain className="w-7 h-7 text-primary" />,
      title: "AI Thông Minh",
      description: "Trải nghiệm công nghệ AI tiên tiến với khả năng hiểu và tương tác tự nhiên. Hệ thống của chúng tôi được trang bị các mô hình ngôn ngữ tiên tiến, có thể hiểu ngữ cảnh phức tạp và tạo ra những câu chuyện sáng tạo, độc đáo. AI không chỉ là công cụ hỗ trợ mà còn là người bạn đồng hành trong hành trình sáng tạo của bạn."
    },
    {
      icon: <BookOpenCheck className="w-7 h-7 text-primary" />,
      title: "Thư Viện Phong Phú",
      description: "Khám phá kho tàng tri thức với hàng nghìn tác phẩm đa dạng từ nhiều thể loại khác nhau. Từ truyện ngắn đến tiểu thuyết, từ khoa học viễn tưởng đến lãng mạn, thư viện của chúng tôi liên tục được cập nhật với những nội dung mới mẻ và hấp dẫn. Mỗi tác phẩm đều được tuyển chọn kỹ lưỡng để đảm bảo chất lượng tốt nhất."
    },
    {
      icon: <Wand2 className="w-7 h-7 text-primary" />,
      title: "Sáng Tạo Không Giới Hạn",
      description: "Phá vỡ mọi rào cản sáng tạo với công cụ viết truyện thông minh. Tự do phát triển ý tưởng của bạn với sự hỗ trợ của AI, tạo ra những cốt truyện độc đáo, nhân vật sống động và những tình huống bất ngờ. Hệ thống gợi ý thông minh sẽ giúp bạn vượt qua những lúc bế tắc và duy trì nguồn cảm hứng sáng tạo."
    },
    {
      icon: <Users2 className="w-7 h-7 text-primary" />,
      title: "Cộng Đồng Năng Động",
      description: "Tham gia vào cộng đồng sôi động của những người yêu thích sáng tạo và AI. Chia sẻ tác phẩm của bạn, nhận phản hồi từ độc giả, tham gia các thảo luận thú vị và kết nối với những người có cùng đam mê. Cộng đồng của chúng tôi là nơi bạn có thể học hỏi, phát triển và tìm thấy nguồn cảm hứng mới mỗi ngày."
    }
  ];

  return (
    <section className="w-full py-12">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-[600px] mx-auto">
            Khám phá những tính năng độc đáo giúp bạn tạo ra và thưởng thức những câu chuyện tuyệt vời
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <FeatureCard {...features[0]} />
            </div>
            <div className="flex-1 md:mt-12">
              <FeatureCard {...features[1]} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 md:mt-12">
              <FeatureCard {...features[2]} />
            </div>
            <div className="flex-1 md:mt-24">
              <FeatureCard {...features[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Features }; 