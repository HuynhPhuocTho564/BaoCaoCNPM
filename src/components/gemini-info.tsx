"use client"
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Brain, Wand2, MessageSquare, BookOpen, Users2, Image } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function GeminiInfo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])
  const descriptionsRef = useRef<(HTMLDivElement | null)[]>([])
  const finalSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        pinSpacing: true,
        scrub: 2,
        onLeave: () => {
          gsap.to(finalSectionRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        },
        onEnterBack: () => {
          gsap.to(finalSectionRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.5
          });
        }
      }
    });

    // Thêm ScrollTrigger mới cho section cuối
    ScrollTrigger.create({
      trigger: finalSectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        finalSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
      onLeaveBack: () => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Ẩn section cuối ban đầu
    gsap.set(finalSectionRef.current, {
      opacity: 0,
      scale: 0.9
    });

    // Initial animations cho logo
    gsap.from(logoRef.current, {
      scale: 0,
      opacity: 0,
      rotation: 360,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });

    gsap.from([titleRef.current, subtitleRef.current], {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.3
    });

    features.forEach((_, index) => {
      // Logo movement với khoảng cách di chuyển ngắn hơn
      tl.to(logoRef.current, {
        y: index === 0 ? 0 : index * 20,
        rotation: index * 360,
        duration: 1.5,
        ease: "power1.inOut"
      });

      // Feature hiện tại
      tl.to(featuresRef.current[index], {
        borderColor: '#3B82F6',
        duration: 0.5
      }, "<");

      tl.to(descriptionsRef.current[index], {
        opacity: 1,
        height: "auto",
        duration: 1.5
      }, "<");

      // Đợi lâu hơn sau khi hiển thị
      tl.to({}, { duration: 2 });

      // Ẩn feature hiện tại
      tl.to([featuresRef.current[index], descriptionsRef.current[index]], {
        opacity: 0,
        height: 0,
        duration: 1
      });

      // Di chuyển các feature phía dưới lên
      if (index < features.length - 1) {
        for (let i = index + 1; i < features.length; i++) {
          tl.to([featuresRef.current[i], descriptionsRef.current[i]], {
            y: `-=75`,
            duration: 1
          }, "<");
        }
      }

      // Thêm animation ẩn logo sau feature cuối cùng
      if (index === features.length - 1) {
        tl.to(logoRef.current, {
          scale: 0,
          opacity: 0,
          rotation: '+=360', // Thêm một vòng xoay cuối
          duration: 1.5,
          ease: "power2.inOut"
        });
      }
    });
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "Tạo Ý Tưởng Truyện",
      description: "AI giúp bạn phát triển ý tưởng truyện độc đáo với tiêu đề, mô tả và thể loại phù hợp."
    },
    {
      icon: <Users2 className="w-12 h-12 text-primary" />,
      title: "Phát Triển Nhân Vật",
      description: "Tạo và hoàn thiện nhân vật với thông tin chi tiết về ngoại hình, tính cách và tiểu sử."
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary" />,
      title: "Tạo Hội Thoại",
      description: "Tự động tạo các đoạn hội thoại tự nhiên và hấp dẫn giữa các nhân vật."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Quản Lý Chương",
      description: "Hỗ trợ tạo và chỉnh sửa nội dung từng chương với tóm tắt chi tiết."
    },
    {
      icon: <Wand2 className="w-12 h-12 text-primary" />,
      title: "Tạo Đại Cương",
      description: "Phát triển cấu trúc tổng thể cho truyện với các đại cương chi tiết."
    },
    {
      icon: <Image className="w-12 h-12 text-primary" />,
      title: "Tạo Prompt Hình Ảnh",
      description: "Tự động tạo prompt cho ảnh bìa và avatar nhân vật phù hợp với nội dung."
    }
  ]

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300"
      >
        <div className="container mx-auto px-4 py-12 h-full">
          <div className="text-center mb-16">
            <h1 ref={titleRef} className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Sức Mạnh của Gemini AI
            </h1>
            <p ref={subtitleRef} className="text-xl text-blue-600 dark:text-blue-400 mt-4">
              Khám phá những tính năng thông minh giúp sáng tạo nội dung truyện
            </p>
          </div>

          <div className="flex gap-8 h-[calc(100%-12rem)]">
            {/* Left side: Logo */}
            <div className="w-1/6 relative">
              <img 
                ref={logoRef}
                src="https://lh3.googleusercontent.com/IuxHCXmHrnNoCYV8vpRfjuAmXVWIbIUYEWiN8bR8w7h-I3br50v6XuJqnUjkgciQIF7B6AhKfY1FO2lXT02hC7VHzI_5oD-vffTbmQsMBDvtk1nFLQ=w80-h80-n-nu-rw"
                alt="Gemini Logo"
                className="w-20 h-20 sticky top-[30%] transform -translate-y-1/2"
              />
            </div>

            {/* Right side: Features and descriptions */}
            <div className="w-5/6 space-y-16">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="space-y-4"
                >
                  <div 
                    ref={(el: HTMLDivElement | null): void => { featuresRef.current[index] = el }}
                    className="border-l-4 border-transparent pl-4 transition-all duration-300"
                  >
                    <div className="mb-2">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {feature.title}
                    </h3>
                  </div>
                  <div 
                    ref={(el: HTMLDivElement | null): void => { descriptionsRef.current[index] = el }}
                    className="pl-8 overflow-hidden opacity-0 h-0"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      

      {/* Section cuối với animation mượt mà hơn */}
      <div 
        ref={finalSectionRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
      >
        <div className="text-center px-4 py-12 max-w-4xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold text-white mb-6">
              Hãy Bắt Đầu Hành Trình Sáng Tạo
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Với sự hỗ trợ của Gemini AI, việc sáng tác truyện chưa bao giờ dễ dàng đến thế. 
              Từ ý tưởng đến cốt truyện, từ nhân vật đến đối thoại - tất cả đều trong tầm tay bạn.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
                Bắt Đầu Ngay
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
