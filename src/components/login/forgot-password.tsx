"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

function ForgotPassword({ open, onOpenChange, onSwitchToLogin }: ForgotPasswordProps) {
  const id = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Quên mật khẩu?</DialogTitle>
            <DialogDescription className="sm:text-center">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              placeholder="email@example.com"
              type="email"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Gửi liên kết đặt lại
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Đã nhớ mật khẩu?{" "}
          <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ForgotPassword }; 