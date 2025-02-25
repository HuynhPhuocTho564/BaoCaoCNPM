import * as React from "react"
import clsx from 'clsx'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import { NavItem } from "./types"
import { NavButton } from "./navbar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const MobileMenuItem: React.FC<{
  item: NavItem;
  isDarkTheme?: boolean;
  onClose?: () => void;
}> = ({ item, isDarkTheme, onClose }) => {
    const [isOpen, setIsOpen] = React.useState(item.items && item.items.length > 0)

    if (item.to) {
      return (
        <a 
          href={item.to}
          className={clsx(
            "flex items-center w-full px-6 py-4",
            "text-base font-semibold tracking-tight",
            "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
            "active:bg-gray-200 dark:active:bg-[#2C2D31]",
            "transition-colors duration-100",
            isDarkTheme ? 'text-white' : 'text-gray-900'
          )}
          onClick={onClose}
        >
          <span className="flex-1">{item.text}</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </a>
      )
    }
  
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex w-full items-center justify-between px-6 py-4",
            "text-base font-semibold tracking-tight",
            "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
            "active:bg-gray-200 dark:active:bg-[#2C2D31]",
            "transition-colors duration-100",
            isDarkTheme ? 'text-white' : 'text-gray-900'
          )}
        >
          <span>{item.text}</span>
          <ChevronRight 
            className={clsx(
              "h-5 w-5 transition-transform duration-200",
              !isOpen && "text-gray-400",
              isOpen && "rotate-90"
            )}
          />
        </button>
        {isOpen && (
          <div className="bg-gray-50 dark:bg-[#0B0C0F]">
            {item.items?.map((subItem, index) => (
              <a
                key={index}
                href={subItem.to}
                className={clsx(
                  "flex items-center px-8 py-3",
                  "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                  "active:bg-gray-200 dark:active:bg-[#2C2D31]",
                  "transition-colors duration-100",
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                )}
                onClick={onClose}
              >
                <div className="flex-1">
                  <div className="text-base font-semibold tracking-tight">{subItem.text}</div>
                  {subItem.description && (
                    <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {subItem.description}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    )
}

export const MobileMenu: React.FC<{ 
  items: NavItem[];
  isDarkTheme?: boolean;
  rightContent?: React.ReactNode;
  onThemeChange?: () => void;
  logo?: React.ReactNode;
}> = ({ items, isDarkTheme, rightContent, onThemeChange, logo }) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <NavButton
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="sr-only">Toggle menu</span>
          </NavButton>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className={clsx(
            "w-full max-w-sm p-0 flex flex-col",
            isDarkTheme ? 'bg-[#0B0C0F]' : 'bg-white'
          )}
        >
          <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="text-xl font-bold tracking-tight">
              {logo}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {items.map((item, index) => (
                <MobileMenuItem 
                  key={index} 
                  item={item} 
                  isDarkTheme={isDarkTheme}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          </div>
  
          <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
            {rightContent && (
              <div className="mb-4">
                {rightContent}
              </div>
            )}
            {onThemeChange && (
              <button
                className={clsx(
                  "flex w-full items-center justify-between px-4 py-3 rounded-lg",
                  "text-base font-semibold tracking-tight",
                  "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                )}
                onClick={onThemeChange}
              >
                <span>
                  {isDarkTheme ? 'Chế độ sáng' : 'Chế độ tối'}
                </span>
                <div className="relative w-5 h-5">
                  <Sun className={clsx(
                    "h-5 w-5 absolute transition-transform duration-100",
                    isDarkTheme ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                  )} />
                  <Moon className={clsx(
                    "h-5 w-5 absolute transition-transform duration-100",
                    isDarkTheme ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                  )} />
                </div>
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    )
} 