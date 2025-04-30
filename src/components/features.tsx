/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { SVGProps } from "react";
import { motion } from "framer-motion";
import { 
  Brain, // For AI intelligence
  BookOpenCheck, // For library
  Wand2, // For creativity
  Users2, // For community
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactElement<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      className="flex flex-col rounded-xl border-2 border-primary/20 
        bg-gradient-to-br from-white/80 to-white/40 dark:from-background/80 dark:to-background/40
        backdrop-blur-sm p-6 sm:p-8"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
          {React.cloneElement(icon, { 
            className: "w-8 h-8 text-primary"
          })}
        </div>
        <h3 className="font-bold text-2xl text-center sm:text-left">{title}</h3>
      </div>
      <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function Features() {
  const features = [
    {
      icon: <Brain />,
      title: "AI Thông Minh",
      description: "Trải nghiệm công nghệ AI tiên tiến với khả năng hiểu và tương tác tự nhiên."
    },
    {
      icon: <BookOpenCheck />,
      title: "Thư Viện Phong Phú",
      description: "Khám phá kho tàng tri thức với hàng nghìn tác phẩm đa dạng từ nhiều thể loại khác nhau."
    },
    {
      icon: <Wand2 />,
      title: "Sáng Tạo Không Giới Hạn",
      description: "Phá vỡ mọi rào cản sáng tạo với công cụ viết truyện thông minh."
    },
    {
      icon: <Users2 />,
      title: "Cộng Đồng Năng Động",
      description: "Tham gia vào cộng đồng sôi động của những người yêu thích sáng tạo và AI."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.h2 
          className="text-3xl sm:text-5xl font-bold text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Tính Năng Nổi Bật
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { Features }; 