/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    
    if (!card || !content) return;

    gsap.set(content, {
      height: 0,
      opacity: 0
    });

    const handleMouseEnter = () => {
      gsap.to(content, {
        height: "auto",
        opacity: 1,
        duration: 0.2,
        ease: "power1.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power1.in"
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="flex flex-col rounded-xl border-2 border-primary/20 
        bg-gradient-to-br from-white/80 to-white/40 dark:from-background/80 dark:to-background/40
        transition-transform duration-200 ease-out backdrop-blur-sm
        relative cursor-pointer overflow-hidden
        hover:scale-[1.01] hover:[transform:perspective(1000px)_rotateY(2deg)]"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-10 relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/10 
          flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement<any>, { 
            className: "w-8 h-8 sm:w-10 sm:h-10 text-primary"
          })}
        </div>
        <h3 className="font-bold text-2xl sm:text-3xl text-center sm:text-left">{title}</h3>
      </div>
      <div 
        ref={contentRef} 
        className="overflow-hidden relative z-10"
      >
        <p className="px-6 sm:px-10 pb-6 sm:pb-10 text-muted-foreground text-lg sm:text-xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "AI Thông Minh",
      description: "Trải nghiệm công nghệ AI tiên tiến với khả năng hiểu và tương tác tự nhiên."
    },
    {
      icon: <BookOpenCheck className="w-6 h-6 text-primary" />,
      title: "Thư Viện Phong Phú",
      description: "Khám phá kho tàng tri thức với hàng nghìn tác phẩm đa dạng từ nhiều thể loại khác nhau."
    },
    {
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      title: "Sáng Tạo Không Giới Hạn",
      description: "Phá vỡ mọi rào cản sáng tạo với công cụ viết truyện thông minh."
    },
    {
      icon: <Users2 className="w-6 h-6 text-primary" />,
      title: "Cộng Đồng Năng Động",
      description: "Tham gia vào cộng đồng sôi động của những người yêu thích sáng tạo và AI."
    }
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.feature-card');
    if (!cards) return;

    gsap.set(cards, {
      rotationY: 45,
      opacity: 0,
      transformPerspective: 1000,
    });

    gsap.to(cards, {
      duration: 0.8,
      rotationY: 0,
      opacity: 1,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center+=100",
      }
    });
  }, []);

  return (
    <section className="w-full py-16 sm:py-32">
      <div className="container px-4 mx-auto max-w-8xl">
        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-10 sm:mb-20">
          Tính Năng Nổi Bật
        </h2>
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-6 sm:p-10 
            rounded-2xl sm:rounded-3xl border-2 border-primary/10 
            bg-gradient-to-br from-slate-100/50 to-white/30 
            dark:from-zinc-950/50 dark:to-background/30 
            backdrop-blur-md relative overflow-hidden"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card [transform-style:preserve-3d]"
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Features }; 