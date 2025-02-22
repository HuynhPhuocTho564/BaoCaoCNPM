"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { Register } from "./register";

function Login() {
  const id = useId();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogTrigger asChild>
          <Button variant="outline">Đăng nhập</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <DialogHeader>
              <DialogTitle className="sm:text-center">Chào mừng trở lại</DialogTitle>
              <DialogDescription className="sm:text-center">
                Vui lòng nhập thông tin để đăng nhập.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input id={`${id}-email`} placeholder="email@example.com" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>Mật khẩu</Label>
                <Input
                  id={`${id}-password`}
                  placeholder="Nhập mật khẩu của bạn"
                  type="password"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id={`${id}-remember`} />
                <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <a className="text-sm underline hover:no-underline" href="#">
                Quên mật khẩu?
              </a>
            </div>
            <Button type="button" className="w-full">
              Đăng nhập
            </Button>
          </form>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground">Hoặc</span>
          </div>

          <Button variant="outline">Đăng nhập với Google</Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Button variant="link" className="p-0" onClick={handleSwitchToRegister}>
              Đăng ký ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Register 
        open={showRegister} 
        onOpenChange={setShowRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export { Login };
