'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react";
import { handleVNPayPayment } from "@/lib/vnpay";

export default function ProductsPage() {
  const products = [
    {
      name: "Gói Cơ Bản",
      price: "Miễn phí",
      features: [
        "Tạo 5 câu chuyện/tháng",
        "Thư viện mẫu cơ bản",
        "Công cụ AI cơ bản",
        "Hỗ trợ cộng đồng"
      ],
      isPopular: false
    },
    {
      name: "Gói Premium",
      price: "199.000đ/tháng",
      features: [
        "Không giới hạn số lượng truyện",
        "Thư viện mẫu nâng cao",
        "Công cụ AI cao cấp",
        "Hỗ trợ ưu tiên 24/7",
        "Xuất bản truyện"
      ],
      isPopular: true
    },
    {
      name: "Gói Doanh Nghiệp",
      price: "Liên hệ",
      features: [
        "Tất cả tính năng Premium",
        "API tích hợp",
        "Quản lý nhiều người dùng",
        "Đào tạo và hỗ trợ riêng",
        "Tùy chỉnh theo yêu cầu"
      ],
      isPopular: false
    }
  ]

  const handlePayment = async (product: any) => {
    if (product.price === "Miễn phí") {
      return;
    }
    
    if (product.price === "Liên hệ") {
      return;
    }

    try {
      const amount = 199000;
      const orderInfo = `Thanh toán ${product.name}`;
      
      await handleVNPayPayment({
        amount,
        orderInfo
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Sản Phẩm</h1>
            <p className="text-lg text-muted-foreground">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                  <p className="text-muted-foreground">
                    {product.isPopular && (
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        Phổ biến
                      </span>
                    )}
                  </p>
                  <p className="text-3xl font-bold">{product.price}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePayment(product)}
                  >
                    Chọn Gói
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 