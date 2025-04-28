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
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(card, {
        rotationY: 5,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      gsap.to(card, {
        rotationY: 0,
        duration: 0.5,
        ease: "power2.in"
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
        bg-gradient-to-br from-background/80 to-background/40
        transition-all duration-300 backdrop-blur-sm
        relative cursor-pointer overflow-hidden
        before:absolute before:inset-0 before:rounded-xl
        before:bg-[linear-gradient(0deg,transparent_1px,rgba(255,255,255,0.1)_1px),linear-gradient(90deg,transparent_1px,rgba(255,255,255,0.1)_1px)]
        before:bg-[length:20px_20px] before:opacity-100
        hover:scale-[1.02]"
    >
      <div className="flex items-center gap-6 p-10 relative z-10">
        <div className="w-20 h-20 rounded-xl bg-primary/10 
          flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement<any>, { 
            className: "w-10 h-10 text-primary"
          })}
        </div>
        <h3 className="font-bold text-3xl">{title}</h3>
      </div>
      <div 
        ref={contentRef} 
        className="overflow-hidden relative z-10"
      >
        <p className="px-10 pb-10 text-muted-foreground text-xl leading-relaxed">{description}</p>
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
      rotationY: 90,
      opacity: 0,
      transformPerspective: 1000,
      transformOrigin: "center center -200"
    });

    gsap.to(cards, {
      duration: 1,
      rotationY: 0,
      opacity: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center+=100",
      }
    });
  }, []);

  return (
    <section className="w-full py-32">
      <div className="container px-4 mx-auto max-w-8xl">
        <h2 className="text-5xl font-bold text-center mb-20">
          Tính Năng Nổi Bật
        </h2>
        <div 
          ref={containerRef}
          className="grid md:grid-cols-2 gap-10 p-10 rounded-3xl border-2 border-primary/20 
            bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-md
            relative overflow-hidden
            before:absolute before:inset-0 before:rounded-3xl
            before:bg-[linear-gradient(0deg,transparent_1px,rgba(255,255,255,0.1)_1px),linear-gradient(90deg,transparent_1px,rgba(255,255,255,0.1)_1px)]
            before:bg-[length:30px_30px] before:opacity-100"
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