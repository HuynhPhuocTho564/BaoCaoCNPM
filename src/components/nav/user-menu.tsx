"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut } from 'lucide-react'
import clsx from 'clsx'

interface UserMenuProps {
  isDarkTheme?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isDarkTheme }) => {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={clsx(
            "flex items-center gap-2",
            isDarkTheme ? 'text-white' : 'text-gray-900'
          )}
        >
          <User className="h-4 w-4" />
          <span>{session.user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 