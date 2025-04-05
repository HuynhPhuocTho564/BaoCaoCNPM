"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User, BookOpen, Settings } from 'lucide-react'
import clsx from 'clsx'
import { UserAvatar } from "@/components/user/user-avatar"

interface UserMenuProps {
  isDarkTheme?: boolean;
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isDarkTheme, isMobile, onMobileMenuClose }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)

  if (!session) return null

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose()
    }
  }

  const handleSignOut = () => {
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose()
    }
    signOut({ callbackUrl: '/' })
  }

  if (isMobile) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex w-full items-center justify-between px-4 py-3 rounded-lg",
            "text-base font-semibold tracking-tight",
            "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
            isDarkTheme ? 'text-white' : 'text-gray-900'
          )}
        >
          <UserAvatar />
          <ChevronDown className={clsx(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
        {isOpen && (
          <div className="mt-1 bg-gray-50 dark:bg-[#1C1D21] rounded-lg">
            <button
              onClick={() => handleNavigation('/account')}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Tài khoản của tôi</span>
            </button>

            <button
              onClick={() => handleNavigation('/stories')}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Truyện của tôi</span>
            </button>

            <button
              onClick={() => handleNavigation('/settings')}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </button>

            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-6 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className={clsx(
        "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
        isDarkTheme ? 'text-white' : 'text-gray-900'
      )}>
        <UserAvatar />
        <ChevronDown className={clsx(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-1 border border-gray-200 dark:border-gray-700"
      >
        <DropdownMenuItem
          onClick={() => router.push('/account')}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Tài khoản của tôi</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => router.push('/stories')}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Truyện của tôi</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>

        <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center px-3 py-2 text-red-600 dark:text-red-400 cursor-pointer rounded hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 