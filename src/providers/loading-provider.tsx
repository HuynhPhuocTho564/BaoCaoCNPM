/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import LoadingPage from "@/components/loading-page"

interface LoadingContextType {
  setIsLoading: (value: boolean) => void
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  setIsLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
})

function LoadingProviderContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPathRef = useRef<string | null>(pathname)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    if (previousPathRef.current === pathname) {
      // Nếu cùng trang, set timeout ngắn
      setIsLoading(true)
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 5000)
    } else {
      // Khác trang, hiện loading bình thường
      setIsLoading(true)
    }
  }, [pathname])

  const stopLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    previousPathRef.current = pathname
    stopLoading()

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [pathname, searchParams, stopLoading])

  return (
    <LoadingContext.Provider value={{ setIsLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingPage />}
      {children}
    </LoadingContext.Provider>
  )
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  )
}

export const useLoading = () => useContext(LoadingContext)