"use client"
import { useEffect, useRef } from 'react'
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

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      rating: 5,
      content: "Công cụ tuyệt vời giúp tôi phát triển ý tưởng truyện một cách dễ dàng và chuyên nghiệp.",
      role: "Tác giả truyện ngắn"
    },
    {
      name: "Trần Thị B",
      rating: 5,
      content: "AI thực sự hiểu được cách xây dựng nhân vật và cốt truyện. Tôi rất hài lòng với kết quả.",
      role: "Nhà văn tự do"
    },
    {
      name: "Lê Văn C",
      rating: 5,
      content: "Tính năng tạo đối thoại giúp tôi tiết kiệm rất nhiều thời gian trong quá trình viết.",
      role: "Biên kịch"
    },
    {
      name: "Phạm Thị D",
      rating: 5,
      content: "Giao diện đẹp, dễ sử dụng và các tính năng AI rất thông minh.",
      role: "Content Creator"
    },
    {
      name: "Hoàng Văn E",
      rating: 5,
      content: "Hệ thống gợi ý cốt truyện rất sáng tạo và độc đáo. Giúp tôi vượt qua writer's block.",
      role: "Nhà văn trẻ"
    },
    {
      name: "Mai Thị F",
      rating: 5,
      content: "Tính năng phát triển nhân vật giúp tôi tạo ra các nhân vật đa chiều và sống động.",
      role: "Tác giả webtoon"
    },
    {
      name: "Đỗ Văn G",
      rating: 5,
      content: "Công cụ hỗ trợ viết tuyệt vời, giúp tôi tạo ra những câu chuyện hấp dẫn hơn.",
      role: "Blogger"
    },
    {
      name: "Ngô Thị H",
      rating: 5,
      content: "AI hiểu rõ thể loại và phong cách viết của tôi. Rất hữu ích cho việc sáng tác.",
      role: "Tác giả light novel"
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
      }
    });

    // Set vị trí ban đầu cho tất cả testimonial
    testimonialsRef.current.forEach((testimonial, index) => {
      gsap.set(testimonial, {
        xPercent: index * 100 + 100, // Bắt đầu từ phải
        opacity: 1
      });
    });

    // Animation di chuyển sang trái
    tl.to(testimonialsRef.current, {
      xPercent: "-=800", // Di chuyển đủ khoảng cách cho 8 testimonial
      ease: "none",
      duration: 8
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="user-testimonials"
      className="h-screen bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="h-full">
        <div className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="container mx-auto py-12 px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
              Người Dùng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Khám phá những trải nghiệm và đánh giá chân thực từ cộng đồng người dùng về nền tảng AI hỗ trợ sáng tác của chúng tôi
            </p>
          </div>
        </div>

        <div className="relative h-[calc(100%-200px)]">
          <div className="absolute w-full h-full">
            {/* Thanh gradient bên trái */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent dark:from-gray-900 z-10"></div>
            
            {/* Thanh gradient bên phải */}
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent dark:from-gray-900 z-10"></div>

            {/* Các testimonial */}
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={(el: HTMLDivElement | null) => {testimonialsRef.current[index] = el}}
                className="absolute top-1/2 -translate-y-1/2 w-[350px] border-r border-gray-200 dark:border-gray-700 h-[400px] bg-white dark:bg-gray-800 shadow-lg rounded-lg"
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <AvatarFallback name={testimonial.name} index={index} />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-grow">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Đã xác minh ✓</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chỉ số trang */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 opacity-${index === 0 ? '100' : '30'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 