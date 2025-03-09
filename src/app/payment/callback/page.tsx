'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'failed'>('loading');
  const [message, setMessage] = useState('Đang xử lý thanh toán...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/vnpay/callback?${searchParams.toString()}`);
        const data = await response.json();
        
        if (!data.isVerified) {
          setStatus('error');
          setMessage('Xác thực tính toàn vẹn dữ liệu không thành công');
          return;
        }

        if (!data.isSuccess) {
          setStatus('failed');
          setMessage('Đơn hàng thanh toán không thành công');
          return;
        }

        setStatus('success');
        setMessage('Thanh toán thành công!');
        
      } catch (error) {
        console.error('Lỗi xác thực thanh toán:', error);
        setStatus('error');
        setMessage('Dữ liệu không hợp lệ');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const statusConfig = {
    loading: {
      icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
      title: 'Đang xử lý',
      color: 'text-primary'
    },
    success: {
      icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
      title: 'Thành công',
      color: 'text-green-500'
    },
    error: {
      icon: <XCircle className="h-12 w-12 text-red-500" />,
      title: 'Lỗi',
      color: 'text-red-500'
    },
    failed: {
      icon: <XCircle className="h-12 w-12 text-orange-500" />,
      title: 'Thất bại',
      color: 'text-orange-500'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {statusConfig[status].icon}
          </div>
          <CardTitle className={`text-2xl font-bold ${statusConfig[status].color}`}>
            {statusConfig[status].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          <Button 
            className="w-full" 
            onClick={() => router.push('/')}
            variant={status === 'success' ? 'default' : 'secondary'}
          >
            Về trang chủ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 