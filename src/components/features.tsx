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
  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-xl text-foreground">{title}</h3>
        <p className="text-muted-foreground/80">{description}</p>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "AI Thông Minh",
      description: "Trò chuyện với AI để tạo ra những câu chuyện độc đáo và hấp dẫn."
    },
    {
      icon: <BookOpenCheck className="w-6 h-6 text-primary" />,
      title: "Thư Viện Phong Phú",
      description: "Khám phá hàng nghìn câu chuyện đa dạng về thể loại và chủ đề."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      title: "Sáng Tạo Không Giới Hạn",
      description: "Tự do sáng tạo và phát triển cốt truyện theo ý thích của bạn."
    },
    {
      icon: <Users2 className="w-6 h-6 text-primary" />,
      title: "Cộng Đồng Năng Động",
      description: "Chia sẻ và thảo luận về truyện với cộng đồng yêu thích AI."
    }
  ];

  return (
    <section className="w-full py-12 bg-muted/50 dark:bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-semibold tracking-tighter text-foreground">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-muted-foreground/80 max-w-[600px] mx-auto">
            Khám phá những tính năng độc đáo giúp bạn tạo ra và thưởng thức những câu chuyện tuyệt vời
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { Features }; 