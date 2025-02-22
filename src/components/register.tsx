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

interface RegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

function Register({ open, onOpenChange, onSwitchToLogin }: RegisterProps) {
  const id = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sm:text-center">Đăng ký tài khoản</DialogTitle>
          <DialogDescription className="sm:text-center">
            Vui lòng điền thông tin để tạo tài khoản mới.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>Họ và tên</Label>
              <Input id={`${id}-name`} placeholder="Nguyễn Văn A" type="text" required />
            </div>
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
          <Button type="button" className="w-full">
            Đăng ký
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Hoặc</span>
        </div>

        <Button variant="outline">Đăng ký với Google</Button>

        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
            Đăng nhập
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <a className="underline hover:no-underline" href="#">
            Điều khoản sử dụng
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export { Register };
