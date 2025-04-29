"use client"
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Thêm mảng màu để làm avatar
const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

// Component AvatarFallback
const AvatarFallback = ({ name, index }: { name: string, index: number }) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colorClass = avatarColors[index % avatarColors.length];
  
  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
      <span className="text-xl font-semibold text-white">{initials}</span>
    </div>
  );
};

export default function UserTestimonials() {
  const containerRef = useRef(null)
  const testimonialsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Công cụ tuyệt vời giúp tôi phát triển ý tưởng truyện một cách dễ dàng và chuyên nghiệp.",
      role: "Tác giả truyện ngắn",
    },
    {
      name: "Trần Thị B",
      rating: 5,
      content: "AI thực sự hiểu được cách xây dựng nhân vật và cốt truyện. Tôi rất hài lòng với kết quả.",
      role: "Nhà văn tự do",
    },
    {
      name: "Lê Văn C",
      rating: 5,
      content: "Tính năng tạo đối thoại giúp tôi tiết kiệm rất nhiều thời gian trong quá trình viết.",
      role: "Biên kịch",
    },
    {
      name: "Phạm Thị D",
      rating: 5,
      content: "Giao diện đẹp, dễ sử dụng và các tính năng AI rất thông minh.",
      role: "Content Creator",
    },
    {
      name: "Hoàng Văn E",
      rating: 5,
      content: "Hệ thống gợi ý cốt truyện rất sáng tạo và độc đáo. Giúp tôi vượt qua writer's block.",
      role: "Nhà văn trẻ",
    },
    {
      name: "Mai Thị F",
      rating: 5,
      content: "Tính năng phát triển nhân vật giúp tôi tạo ra các nhân vật đa chiều và sống động.",
      role: "Tác giả webtoon",
    },
    {
      name: "Đỗ Văn G",
      rating: 5,
      content: "Công cụ hỗ trợ viết tuyệt vời, giúp tôi tạo ra những câu chuyện hấp dẫn hơn.",
      role: "Blogger",
    },
    {
      name: "Ngô Thị H",
      rating: 5,
      content: "AI hiểu rõ thể loại và phong cách viết của tôi. Rất hữu ích cho việc sáng tác.",
      role: "Tác giả light novel",
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          // Tính toán index hiện tại dựa trên progress
          const progress = self.progress;
          const totalTestimonials = testimonials.length;
          const newIndex = Math.min(
            Math.floor(progress * totalTestimonials),
            totalTestimonials - 1
          );
          setActiveIndex(newIndex);
        }
      }
    });

    // Set vị trí ban đầu cho tất cả testimonial
    testimonialsRef.current.forEach((testimonial, index) => {
      gsap.set(testimonial, {
        xPercent: index * 100 + 100,
        opacity: 1
      });
    });

    // Animation di chuyển sang trái
    tl.to(testimonialsRef.current, {
      xPercent: "-=800",
      ease: "none",
      duration: 8
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Hàm xử lý khi click vào dot
  const handleDotClick = (index: number) => {
    const progress = index / (testimonials.length - 1);
    const scrollTrigger = ScrollTrigger.getById("testimonials-trigger");
    if (scrollTrigger) {
      scrollTrigger.scroll(progress);
    }
  };

  return (
    <div 
      ref={containerRef}
      id="user-testimonials"
      className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="h-full">
        <div className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="container mx-auto py-8 sm:py-16 px-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
              Đánh Giá Từ Cộng Đồng
            </h2>
            <p className="text-base sm:text-xl text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Khám phá trải nghiệm thực tế từ các tác giả đang sử dụng nền tảng
            </p>
          </div>
        </div>

        <div className="relative h-[calc(100%-140px)] sm:h-[calc(100%-200px)]">
          <div className="absolute w-full h-full">
            {/* Thanh gradient */}
            <div className="absolute left-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-r from-white to-transparent dark:from-gray-900 z-10"></div>
            <div className="absolute right-0 top-0 w-16 sm:w-32 h-full bg-gradient-to-l from-white to-transparent dark:from-gray-900 z-10"></div>

            {/* Các testimonial */}
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={(el: HTMLDivElement | null) => {testimonialsRef.current[index] = el}}
                className="absolute top-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-auto sm:h-[450px]"
              >
                <div className="relative h-full">
                  {/* Bong bóng chat */}
                  <div className="absolute w-full p-4 sm:p-8 bg-blue-50 dark:bg-gray-800 
                    rounded-2xl sm:rounded-[2.5rem] 
                    border-2 sm:border-4 border-blue-200 dark:border-gray-600
                    shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    {/* Rating */}
                    <div className="flex gap-1 sm:gap-1.5 mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 dark:text-gray-300 text-base sm:text-xl leading-relaxed mb-4 sm:mb-6">
                      {testimonial.content}
                    </p>

                    {/* Divider */}
                    <div className="h-0.5 bg-blue-200 dark:bg-gray-600 my-4 sm:my-6"></div>

                    {/* User info */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <AvatarFallback name={testimonial.name} index={index} />
                      <div>
                        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                          {testimonial.name}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 text-base sm:text-lg">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Chat bubble tail */}
                    <div className="absolute -bottom-[20px] sm:-bottom-[28px] left-[40px] sm:left-[60px]">
                      <div className="relative w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] overflow-hidden">
                        <div className="absolute top-[-15px] sm:top-[-20px] left-0 
                          w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] 
                          bg-blue-50 dark:bg-gray-800 
                          border-2 sm:border-4 border-blue-200 dark:border-gray-600
                          rounded-2xl sm:rounded-[2.5rem]">
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 
                    bg-emerald-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 
                    rounded-full shadow-lg border-2 border-white dark:border-gray-900
                    flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Đã xác minh
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 
                  ${index === activeIndex 
                    ? 'bg-blue-600 dark:bg-blue-400 w-6 sm:w-8' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 