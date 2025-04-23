"use client"

import { MessageCircle, PenLine } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable: boolean = (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('input') !== null ||
        target.closest('[role="menuitem"]') !== null
      )
      setIsHovering(isClickable)
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      <div
        className={`cursor-dot`}
        style={{
          left: `${position.x - 12}px`,
          top: `${position.y - 12}px`
        }}
      >
        {isHovering ? (
          <PenLine className="w-6 h-6 text-primary" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary" />
        )}
      </div>
    </>
  )
} 