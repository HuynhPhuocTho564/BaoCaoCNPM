"use client"

import * as React from "react"
import clsx from 'clsx'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavButton {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  onClick?: () => void
  asChild?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const NavButton: React.FC<NavButton> = ({ 
  className, 
  children, 
  variant = 'default',
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-4 py-2',
        variant === 'default' && [
          'bg-black text-white hover:bg-black/90',
          'dark:bg-white dark:text-black dark:hover:bg-white/90'
        ],
        variant === 'outline' && [
          'border border-current',
          'hover:bg-black/10 dark:hover:bg-white/10'
        ],
        className
      )}
    >
      {children}
    </button>
  )
}

interface NavItem {
  to?: string
  text: string
  items?: {
    icon?: {
      dark: string
      light: string
    }
    text: string
    description?: string
    to: string
  }[]
}

interface HeaderProps {
  className?: string
  theme?: 'light' | 'dark'
  isSticky?: boolean
  isStickyOverlay?: boolean
  withBorder?: boolean
  logo?: React.ReactNode
  menuItems?: NavItem[]
  onThemeChange?: () => void
  rightContent?: React.ReactNode
}

const ChevronIcon = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-2.5 opacity-60 [&_path]:stroke-2 transition-transform duration-200 group-hover:rotate-180"
  >
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Navigation: React.FC<{ isDarkTheme?: boolean; items: NavItem[] }> = ({ isDarkTheme, items }) => (
  <nav>
    <ul className="flex gap-x-1 xl:gap-x-2 hidden lg:flex">
      {items.map(({ to, text, items }, index) => {
        const Tag = to ? 'a' : 'button'
        return (
          <li
            className={clsx('relative [perspective:2000px]', items && items.length > 0 && 'group')}
            key={index}
          >
            <Tag
              className={clsx(
                'flex items-center gap-x-1.5 px-3 py-2 rounded-xl',
                'text-base font-semibold tracking-tight',
                'hover:bg-gray-100 dark:hover:bg-[#1C1D21] transition-colors duration-200',
                isDarkTheme ? 'text-white' : 'text-gray-900'
              )}
              href={to}
            >
              {text}
              {items && items.length > 0 && <ChevronIcon />}
            </Tag>
            {items && items.length > 0 && (
              <div
                className={clsx(
                  'absolute -left-2 top-full w-[280px] pt-3',
                  'pointer-events-none opacity-0',
                  'origin-top-left transition-all duration-200',
                  'group-hover:pointer-events-auto group-hover:opacity-100'
                )}
              >
                <div
                  className={clsx(
                    'relative rounded-2xl p-2',
                    'bg-white/80 backdrop-blur-lg dark:bg-[#0B0C0F]/80',
                    'shadow-lg shadow-gray-200/50 dark:shadow-black/20',
                    'border border-gray-200/50 dark:border-gray-700/50'
                  )}
                >
                  {items.map(({ icon, text, description, to }, index) => (
                    <a
                      key={index}
                      href={to}
                      className={clsx(
                        'flex items-center gap-3 rounded-xl p-2.5',
                        'hover:bg-gray-100 dark:hover:bg-[#1C1D21]',
                        'transition-colors duration-200',
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      )}
                    >
                      {icon && (
                        <div className={clsx(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          'bg-gray-50 dark:bg-[#1C1D21]',
                          'border border-gray-200/50 dark:border-gray-700/50'
                        )}>
                          <img
                            className="h-5 w-5"
                            src={isDarkTheme ? icon.dark : icon.light}
                            alt=""
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold tracking-tight">{text}</div>
                        {description && (
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {description}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  </nav>
)

const MobileMenuItem: React.FC<{
  item: NavItem;
  isDarkTheme?: boolean;
  onClose?: () => void;
}> = ({ item, isDarkTheme, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.to) {
    return (
      <a 
        href={item.to}
        className={clsx(
          "flex items-center w-full px-6 py-4",
          "text-base font-semibold tracking-tight",
          "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
          isDarkTheme ? 'text-white' : 'text-gray-900'
        )}
        onClick={onClose}
      >
        {item.text}
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
          isDarkTheme ? 'text-white' : 'text-gray-900'
        )}
      >
        <span>{item.text}</span>
        <ChevronRight 
          className={clsx(
            "h-5 w-5 transition-transform duration-200",
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
                "block px-8 py-3",
                "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                isDarkTheme ? 'text-white' : 'text-gray-900'
              )}
              onClick={onClose}
            >
              <div className="text-base font-semibold tracking-tight">{subItem.text}</div>
              {subItem.description && (
                <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {subItem.description}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

const MobileMenu: React.FC<{ 
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

export const Header: React.FC<HeaderProps> = ({
  className,
  theme = 'light',
  isSticky = false,
  isStickyOverlay = false,
  withBorder = false,
  logo,
  menuItems = [],
  onThemeChange,
  rightContent,
}) => {
  const isDarkTheme = theme === 'dark'

  return (
    <header
      className={clsx(
        'relative z-40 w-full',
        isSticky && 'sticky top-0',
        isStickyOverlay && 'bg-background/80 backdrop-blur-lg',
        withBorder && 'border-b',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {logo}
          <Navigation isDarkTheme={isDarkTheme} items={menuItems} />
          
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4">
              {rightContent}
              {onThemeChange && (
                <NavButton
                  variant="ghost"
                  size="icon"
                  onClick={onThemeChange}
                >
                  {isDarkTheme ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </NavButton>
              )}
            </div>
            
            <MobileMenu
              items={menuItems}
              isDarkTheme={isDarkTheme}
              rightContent={rightContent}
              onThemeChange={onThemeChange}
              logo={logo}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export { NavButton }
export default Header
