/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface CommandBoxProps {
  command: string
  status: 'loading' | 'success' | 'error'
  params?: Record<string, any>
}

export function CommandBox({ command, status, params }: CommandBoxProps) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4 my-2 space-y-2">
      <div className="flex items-center gap-2">
        {status === 'loading' && (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">
          {command === '/create-story' && (
            <>
              {status === 'loading' && 'Đang tạo truyện mới...'}
              {status === 'success' && 'Đã tạo truyện thành công!'}
              {status === 'error' && 'Có lỗi xảy ra khi tạo truyện!'}
            </>
          )}
        </span>
      </div>
      
      {params && (
        <div className={`text-sm space-y-1 ${
          status === 'success' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-muted-foreground'
        }`}>
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{key}:</span>
              <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 