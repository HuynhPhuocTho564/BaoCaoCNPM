<<<<<<< HEAD
/* eslint-disable @next/next/no-img-element */
=======
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
<<<<<<< HEAD
import { ChevronDown, LogOut, User, BookOpen, Settings } from 'lucide-react'
=======
import { ChevronDown, LogOut } from 'lucide-react'
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
import clsx from 'clsx'

interface UserMenuProps {
  isDarkTheme?: boolean;
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isDarkTheme, isMobile }) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)

  if (!session) return null

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
<<<<<<< HEAD
          <div className="flex items-center gap-2">
            <img 
              src={session.user?.avatar || '/default-user.webp'} 
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>{session.user?.name}</span>
          </div>
=======
          <span>{session.user?.name}</span>
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
          <ChevronDown className={clsx(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
        {isOpen && (
          <div className="mt-1 bg-gray-50 dark:bg-[#1C1D21] rounded-lg">
            <button
<<<<<<< HEAD
              onClick={() => window.location.href = '/account'}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Tài khoản của tôi</span>
            </button>

            <button
              onClick={() => window.location.href = '/stories'}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Truyện của tôi</span>
            </button>

            <button
              onClick={() => window.location.href = '/settings'}
              className="flex w-full items-center px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </button>

            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

            <button
=======
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
              onClick={() => signOut()}
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
<<<<<<< HEAD
        "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
        isDarkTheme ? 'text-white' : 'text-gray-900'
      )}>
        <img 
          src={session.user?.avatar || '/default-user.webp'} 
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
=======
        "flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800",
        isDarkTheme ? 'text-white' : 'text-gray-900'
      )}>
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
        <span className="font-medium">{session.user?.name}</span>
        <ChevronDown className={clsx(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
<<<<<<< HEAD
        className="w-56 p-1 border border-gray-200 dark:border-gray-700"
      >
        <DropdownMenuItem
          onClick={() => window.location.href = '/account'}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Tài khoản của tôi</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => window.location.href = '/stories'}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Truyện của tôi</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => window.location.href = '/settings'}
          className="flex items-center px-3 py-2 cursor-pointer rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>

        <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
=======
        className="w-48 p-1 border border-gray-200 dark:border-gray-700"
      >
        <DropdownMenuItem
>>>>>>> 5ac3dd75388b9dd53e3ba9e4706df808b9ba1ca5
          onClick={() => signOut()}
          className="flex items-center px-3 py-2 text-red-600 dark:text-red-400 cursor-pointer rounded hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 