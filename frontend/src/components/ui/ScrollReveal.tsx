// ============================================================
// PRISM — SCROLL REVEAL
// Wraps any element and fades it in when it enters viewport.
// Uses Intersection Observer — no scroll event listeners.
// ============================================================

'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------

interface ScrollRevealProps {
  children:   ReactNode
  delay?:     number        // ms delay before animating in
  duration?:  number        // ms animation duration
  distance?:  number        // px translateY distance
  threshold?: number        // 0–1 how much must be visible
  style?:     CSSProperties
  className?: string
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

export default function ScrollReveal({
  children,
  delay     = 0,
  duration  = 500,
  distance  = 20,
  threshold = 0.12,
  style,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set initial hidden state
    el.style.opacity   = '0'
    el.style.transform = `translateY(${distance}px)`
    el.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity   = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      { threshold }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, duration, distance, threshold])

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}