// ============================================================
// PRISM — SCORE RING
// Animated SVG ring showing the overall score.
// Score counts up from 0 on mount.
// ============================================================

'use client'
import React, { useEffect, useState } from 'react'
import { getScoreRingColor, getCircumference, getStrokeDashOffset } from '@/lib/utils'

interface ScoreRingProps {
  score:  number
  size?:  number
  stroke?: number
}

export default function ScoreRing({
  score,
  size   = 120,
  stroke = 8,
}: ScoreRingProps) {
  const [displayed,  setDisplayed]  = useState(0)
  const [animated,   setAnimated]   = useState(0)

  const radius        = (size - stroke) / 2
  const circumference = getCircumference(radius)
  const color         = getScoreRingColor(score)

  // Count up animation
  useEffect(() => {
    
    setTimeout(() => {
    setDisplayed(0)
    setAnimated(0)
    }, 0)

    const duration  = 1200  // ms
    const steps     = 60
    const increment = score / steps
    const interval  = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayed(score)
        setAnimated(score)
        clearInterval(timer)
      } else {
        setDisplayed(Math.round(current))
        setAnimated(current)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [score])

  const dashOffset = getStrokeDashOffset(animated, radius)

  return (
    <div
      style={{
        position: 'relative',
        width:    size,
        height:   size,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* BACKGROUND TRACK */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={stroke}
        />
        {/* SCORE ARC */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' } as React.CSSProperties}
        />
      </svg>

      {/* SCORE NUMBER */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily:   'var(--font-display)',
            fontSize:     size >= 120 ? 'var(--text-3xl)' : 'var(--text-xl)',
            fontWeight:   'var(--weight-extrabold)',
            lineHeight:   1,
            color:        'var(--text-primary)',
            letterSpacing:'var(--tracking-tight)',
          }}
        >
          {displayed}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-xs)',
            color:      'var(--text-muted)',
            marginTop:  '2px',
          }}
        >
          / 100
        </span>
      </div>
    </div>
  )
}