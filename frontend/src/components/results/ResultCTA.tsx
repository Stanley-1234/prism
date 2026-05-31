// ============================================================
// PRISM — RESULT CTA
// Post-scan call to action.
// Changes urgency, copy, and style based on score range.
// ============================================================

import Link from 'next/link'
import type { ScanResult } from '@/lib/types'
import { getCTAConfig } from '@/lib/utils'

interface ResultCTAProps {
  result: ScanResult
}

export default function ResultCTA({ result }: ResultCTAProps) {
  const cta = getCTAConfig(result.overall_score)

  const borderColor = {
    critical: 'var(--prism-red-border)',
    high:     'var(--prism-amber-border)',
    medium:   'var(--prism-amber-border)',
    low:      'var(--prism-green-border)',
  }[cta.urgency]

  const bgColor = {
    critical: 'var(--prism-red-light)',
    high:     'var(--prism-amber-light)',
    medium:   'var(--prism-amber-light)',
    low:      'var(--prism-green-light)',
  }[cta.urgency]

  const btnBg = {
    critical: 'var(--prism-red)',
    high:     'var(--text-primary)',
    medium:   'var(--text-primary)',
    low:      'var(--prism-green)',
  }[cta.urgency]

  return (
    <div
      style={{
        border:       `1.5px solid ${borderColor}`,
        background:   bgColor,
        borderRadius: 'var(--radius-xl)',
        padding:      '24px 28px',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        gap:          '20px',
        flexWrap:     'wrap',
        animation:    'fadeUp 0.4s ease-out 0.6s both',
      }}
    >
      {/* LEFT — text */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p
          style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'var(--text-lg)',
            fontWeight:   'var(--weight-bold)',
            color:        'var(--text-primary)',
            marginBottom: '6px',
          }}
        >
          {cta.emoji} {cta.headline}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-sm)',
            color:      'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {cta.subtext}
        </p>
      </div>

      {/* RIGHT — button */}
      <Link
        href={cta.buttonHref}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '6px',
          fontFamily:     'var(--font-display)',
          fontSize:       'var(--text-sm)',
          fontWeight:     'var(--weight-bold)',
          color:          'white',
          background:     btnBg,
          borderRadius:   'var(--radius-md)',
          padding:        '12px 22px',
          textDecoration: 'none',
          whiteSpace:     'nowrap',
          flexShrink:     0,
          transition:     'all var(--transition-fast)',
          boxShadow:      'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform  = 'translateY(-2px)'
          e.currentTarget.style.boxShadow  = 'var(--shadow-md)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform  = 'translateY(0)'
          e.currentTarget.style.boxShadow  = 'var(--shadow-sm)'
        }}
      >
        {cta.buttonText}
      </Link>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}