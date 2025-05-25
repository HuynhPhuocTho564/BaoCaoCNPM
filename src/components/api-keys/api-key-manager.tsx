/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Plus, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: number;
  name: string;
  description?: string;
  api_key_preview: string;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  is_active: boolean;
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showNewApiKey, setShowNewApiKey] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expires_at: "",
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/user/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys);
      } else {
        toast.error("Không thể tải danh sách API keys");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải API keys");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    try {
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setNewApiKey(data.apiKey);
        setIsCreateDialogOpen(false);
        setFormData({ name: "", description: "", expires_at: "" });
        fetchApiKeys();
        toast.success("API key đã được tạo thành công!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Không thể tạo API key");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo API key");
    }
  };

  const deleteApiKey = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa API key này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/user/api-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchApiKeys();
        toast.success("API key đã được xóa");
      } else {
        const error = await response.json();
        toast.error(error.error || "Không thể xóa API key");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa API key");
    }
  };

  const toggleApiKeyStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/user/api-keys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchApiKeys();
        toast.success(
          `API key đã được ${!isActive ? "kích hoạt" : "vô hiệu hóa"}`
        );
      } else {
        const error = await response.json();
        toast.error(error.error || "Không thể cập nhật trạng thái API key");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-gray-600">
            Quản lý API keys để truy cập hệ thống từ bên ngoài
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo API Key mới</DialogTitle>
              <DialogDescription>
                Tạo một API key mới để truy cập hệ thống từ ứng dụng bên ngoài.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên API Key *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: My App API Key"
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả mục đích sử dụng API key này"
                />
              </div>
              <div>
                <Label htmlFor="expires_at">Thời gian hết hạn (tùy chọn)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData({ ...formData, expires_at: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={createApiKey} disabled={!formData.name.trim()}>
                Tạo API Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* New API Key Display */}
      {newApiKey && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">
              API Key mới đã được tạo!
            </CardTitle>
            <CardDescription className="text-green-600">
              Đây là lần duy nhất bạn có thể xem API key này. Hãy sao chép và
              lưu trữ an toàn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                value={newApiKey}
                readOnly
                type={showNewApiKey ? "text" : "password"}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNewApiKey(!showNewApiKey)}
              >
                {showNewApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(newApiKey)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setNewApiKey(null)}
            >
              Đã lưu, ẩn API key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div className="grid gap-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Chưa có API key nào được tạo.</p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    {apiKey.description && (
                      <CardDescription>{apiKey.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                      {apiKey.is_active ? "Hoạt động" : "Vô hiệu"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleApiKeyStatus(apiKey.id, apiKey.is_active)
                      }
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">API Key:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {apiKey.api_key_preview}
                    </code>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Tạo: {formatDate(apiKey.created_at)}</p>
                    {apiKey.expires_at && (
                      <p>Hết hạn: {formatDate(apiKey.expires_at)}</p>
                    )}
                    {apiKey.last_used_at && (
                      <p>Sử dụng cuối: {formatDate(apiKey.last_used_at)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
