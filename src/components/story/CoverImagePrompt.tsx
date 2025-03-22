/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Image } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateCoverImagePrompt } from "@/lib/gemini"

interface CoverImagePromptProps {
  storyInfo: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  };
}

export function CoverImagePrompt({ storyInfo }: CoverImagePromptProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<{
    prompt: string;
    negativePrompt: string;
    style: string;
  } | null>(null)
  const [open, setOpen] = useState(false)

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const prompt = await generateCoverImagePrompt(storyInfo);
      setGeneratedPrompt(prompt);
    } catch (error) {
      toast.error("Không thể tạo prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Image className="w-4 h-4" />
          Gợi ý prompt ảnh bìa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gợi ý prompt ảnh bìa</DialogTitle>
          <DialogDescription>
            Tạo prompt để sử dụng với các công cụ AI tạo ảnh
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedPrompt ? (
            <Button 
              onClick={generatePrompt}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Đang tạo..." : "Tạo prompt"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt</Label>
                <div className="relative">
                  <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                    {generatedPrompt.prompt}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedPrompt.prompt)}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Negative Prompt</Label>
                <div className="relative">
                  <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                    {generatedPrompt.negativePrompt}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedPrompt.negativePrompt)}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phong cách đề xuất</Label>
                <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                  {generatedPrompt.style}
                </pre>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedPrompt(null);
                }}
              >
                Tạo lại
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 