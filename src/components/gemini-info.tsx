"use client"
import React from 'react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Brain, Wand2, MessageSquare, BookOpen, Users2, Image, LucideIcon, ExternalLink } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"

gsap.registerPlugin(ScrollTrigger)

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function GeminiInfo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])
  const descriptionsRef = useRef<(HTMLDivElement | null)[]>([])
  const finalSectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { startLoading } = useLoading()

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Animation cho các tường AI
      gsap.to(".absolute.left-0", {
        backgroundPosition: "0 -30px",
        repeat: -1,
        duration: 2,
        ease: "none"
      });

      gsap.to(".absolute.right-0", {
        backgroundPosition: "0 30px",
        repeat: -1,
        duration: 2,
        ease: "none"
      });
    });

    // Cleanup function
    return () => {
      ctx.revert(); // Sẽ xóa tất cả animations và scroll triggers
    };
  }, []);

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

  return (
    <div className="relative overflow-hidden">
      <div 
        ref={containerRef}
        className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white 
          transition-colors duration-300 relative overflow-hidden"
      >
        {/* Tường AI hai bên - ẩn trên mobile */}
        <div className="hidden sm:block absolute left-0 top-0 h-full w-[50px] 
          bg-gradient-to-r from-blue-600/30 to-transparent dark:from-blue-900/40">
          {/* Hiệu ứng điểm sáng di chuyển */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`left-particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: Math.random() * 50 + 'px',
                top: Math.random() * 100 + '%',
                animation: `floatParticle ${Math.random() * 3 + 2}s linear infinite`
              }}
            />
          ))}
          {/* Đường mạng lưới */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="hidden sm:block absolute right-0 top-0 h-full w-[50px] 
          bg-gradient-to-l from-blue-600/30 to-transparent dark:from-blue-900/40">
          {/* Hiệu ứng điểm sáng di chuyển */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`right-particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                right: Math.random() * 50 + 'px',
                top: Math.random() * 100 + '%',
                animation: `floatParticle ${Math.random() * 3 + 2}s linear infinite`
              }}
            />
          ))}
          {/* Đường mạng lưới */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.3) 75%, rgba(59, 130, 246, 0.3) 76%, transparent 77%, transparent)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12 h-full relative">
          <div className="text-center mb-8 sm:mb-16">
            <h1 ref={titleRef} 
              className="text-3xl sm:text-5xl font-bold tracking-tight 
                bg-gradient-to-r from-blue-600 to-purple-600 
                dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent
                px-4 sm:px-0"
            >
              Sức Mạnh của Gemini AI
            </h1>
            <p ref={subtitleRef} 
              className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mt-4 
                px-4 sm:px-0"
            >
              Khám phá những tính năng thông minh giúp sáng tạo nội dung truyện
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 h-[calc(100%-12rem)]">
            {/* Left side: Logo with connection lines */}
            <div className="w-full sm:w-1/6 flex justify-center sm:block relative">
              <img 
                ref={logoRef}
                src="https://lh3.googleusercontent.com/IuxHCXmHrnNoCYV8vpRfjuAmXVWIbIUYEWiN8bR8w7h-I3br50v6XuJqnUjkgciQIF7B6AhKfY1FO2lXT02hC7VHzI_5oD-vffTbmQsMBDvtk1nFLQ=w80-h80-n-nu-rw"
                alt="Gemini Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 sticky top-[20%] 
                  transform -translate-y-1/2 z-10"
              />
            </div>

            {/* Right side: Features with connection lines */}
            <div className="w-full sm:w-5/6 space-y-8 sm:space-y-16 relative">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="space-y-4 relative px-4 sm:px-0"
                >
                  <div 
                    ref={(el: HTMLDivElement | null): void => { featuresRef.current[index] = el }}
                    className="border-l-4 border-transparent pl-4 transition-all duration-300 relative"
                  >
                    <div className="mb-2">
                      {feature.icon && <feature.icon className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {feature.title}
                    </h3>
                  </div>
                  <div 
                    ref={(el: HTMLDivElement | null): void => { descriptionsRef.current[index] = el }}
                    className="pl-8 overflow-hidden opacity-0 h-0"
                  >
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      

      {/* Section cuối với nền lưới AI */}
      <div 
        ref={finalSectionRef}
        className="relative min-h-screen flex items-center justify-center bg-slate-950"
      >
        {/* Lưới nền AI */}
        <div className="absolute inset-0 bg-grid-pattern"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
          }}
        />

        {/* Các điểm sáng di chuyển */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`final-dot-${i}`}
            className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full"
            style={{
              left: `${Math.min(Math.random() * 98, 98)}%`,
              top: `${Math.min(Math.random() * 98, 98)}%`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}

        {/* Nội dung chính */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto">
          <div className="space-y-6 sm:space-y-8 backdrop-blur-sm bg-slate-900/50 
            p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-blue-500/20">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
              Hãy Bắt Đầu Hành Trình Sáng Tạo
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Với sự hỗ trợ của Gemini AI, việc sáng tác truyện chưa bao giờ dễ dàng đến thế. 
              Từ ý tưởng đến cốt truyện, từ nhân vật đến đối thoại - tất cả đều trong tầm tay bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  startLoading('/stories')
                  router.push('/stories')
                }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white 
                  rounded-full font-semibold hover:bg-blue-700 transition-all 
                  transform hover:scale-105"
              >
                Bắt Đầu Viết Ngay
              </button>
              <a 
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-400 
                  text-blue-400 rounded-full font-semibold hover:bg-blue-400/10 
                  transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Khám Phá AI Studio
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
