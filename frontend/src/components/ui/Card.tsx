// ============================================================
// PRISM — CARD
// Base card wrapper.
// White box with border, radius, and shadow.
// ============================================================
'use client'

import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children:   ReactNode
  style?:     CSSProperties
  className?: string
  hover?:     boolean
  padding?:   'none' | 'sm' | 'md' | 'lg'
}

const PADDING_MAP = {
  none: '0',
  sm:   '16px',
  md:   '24px',
  lg:   '32px',
}

export default function Card({
  children,
  style,
  className,
  hover   = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={className}
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding:      PADDING_MAP[padding],
        boxShadow:    'var(--shadow-sm)',
        transition:   hover ? 'transform var(--transition-base), box-shadow var(--transition-base)' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform  = 'translateY(-3px)'
        e.currentTarget.style.boxShadow  = 'var(--shadow-lg)'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform  = 'translateY(0)'
        e.currentTarget.style.boxShadow  = 'var(--shadow-sm)'
      } : undefined}
    >
      {children}
    </div>
  )
}