// ============================================================
// PRISM — GRADE BADGE
// Displays the letter grade (A+ to F).
// Color changes based on grade.
// ============================================================

import type { Grade } from '@/lib/types'

interface GradeBadgeProps {
  grade: Grade
  size?: 'sm' | 'md' | 'lg'
}

function getGradeColor(grade: Grade): { bg: string; text: string; border: string } {
  if (grade.startsWith('A')) return {
    bg:     'rgba(45,158,95,0.10)',
    text:   '#1d7a46',
    border: 'rgba(45,158,95,0.25)',
  }
  if (grade.startsWith('B')) return {
    bg:     'rgba(45,158,95,0.06)',
    text:   '#2D9E5F',
    border: 'rgba(45,158,95,0.20)',
  }
  if (grade === 'C+' || grade === 'C') return {
    bg:     'rgba(244,162,97,0.12)',
    text:   '#a05c10',
    border: 'rgba(244,162,97,0.30)',
  }
  if (grade === 'C-' || grade === 'D') return {
    bg:     'rgba(249,115,22,0.10)',
    text:   '#c2410c',
    border: 'rgba(249,115,22,0.25)',
  }
  // F
  return {
    bg:     'rgba(230,57,70,0.10)',
    text:   '#c0242f',
    border: 'rgba(230,57,70,0.25)',
  }
}

const SIZE_MAP = {
  sm: { fontSize: 'var(--text-sm)',  padding: '4px 10px',  borderRadius: 'var(--radius-sm)' },
  md: { fontSize: 'var(--text-lg)',  padding: '6px 14px',  borderRadius: 'var(--radius-md)' },
  lg: { fontSize: 'var(--text-2xl)', padding: '8px 20px',  borderRadius: 'var(--radius-md)' },
}

export default function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const colors  = getGradeColor(grade)
  const sizeMap = SIZE_MAP[size]

  return (
    <span
      style={{
        display:       'inline-block',
        fontFamily:    'var(--font-display)',
        fontSize:      sizeMap.fontSize,
        fontWeight:    'var(--weight-extrabold)',
        letterSpacing: 'var(--tracking-normal)',
        color:         colors.text,
        background:    colors.bg,
        border:        `1.5px solid ${colors.border}`,
        borderRadius:  sizeMap.borderRadius,
        padding:       sizeMap.padding,
        lineHeight:    1,
        animation:     'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      {grade}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </span>
  )
}