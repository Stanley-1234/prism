// ============================================================
// PRISM — BADGE
// Status badge: pass / warning / critical
// Used in CategoryCard, FindingRow, result headers
// ============================================================

import type { Severity } from '@/lib/types'
import { getSeverityStyles } from '@/lib/utils'

interface BadgeProps {
  severity:  Severity
  label?:    string
  size?:     'sm' | 'md'
}

export default function Badge({
  severity,
  label,
  size = 'md',
}: BadgeProps) {
  const styles = getSeverityStyles(severity)
  const isSm   = size === 'sm'

  const displayLabel = label ?? styles.label

  return (
    <span
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '4px',
        fontFamily:    'var(--font-body)',
        fontSize:      isSm ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight:    'var(--weight-semibold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        padding:       isSm ? '3px 8px' : '4px 10px',
        borderRadius:  'var(--radius-sm)',
        border:        '1px solid',
        whiteSpace:    'nowrap',
        // Inline status styles since Tailwind purges dynamic classes
        color:         severity === 'pass'
          ? 'var(--prism-green)'
          : severity === 'warning'
          ? '#b5671a'
          : '#c0242f',
        background:    severity === 'pass'
          ? 'var(--prism-green-light)'
          : severity === 'warning'
          ? 'var(--prism-amber-light)'
          : 'var(--prism-red-light)',
        borderColor:   severity === 'pass'
          ? 'var(--prism-green-border)'
          : severity === 'warning'
          ? 'var(--prism-amber-border)'
          : 'var(--prism-red-border)',
      }}
    >
      {/* STATUS DOT */}
      <span
        style={{
          width:        '5px',
          height:       '5px',
          borderRadius: '50%',
          background:   severity === 'pass'
            ? 'var(--prism-green)'
            : severity === 'warning'
            ? '#b5671a'
            : '#c0242f',
          flexShrink:   0,
        }}
      />
      {displayLabel}
    </span>
  )
}