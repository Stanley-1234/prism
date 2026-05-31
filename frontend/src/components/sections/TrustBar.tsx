// ============================================================
// PRISM — TRUST BAR
// Stats strip shown below the hero on both pages.
// ============================================================

import { TRUST_STATS } from '@/lib/constants'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function TrustBar() {
  return (
    <div
      style={{
        borderTop:    '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        background:   'var(--bg-card)',
        padding:      '20px var(--section-padding-x)',
      }}
    >
      <div
        style={{
          maxWidth:       'var(--container-max)',
          margin:         '0 auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '48px',
          flexWrap:       'wrap',
        }}
      >
        {TRUST_STATS.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 80}>
            <div
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '10px',
              }}
            >
              <span
                style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     'var(--text-xl)',
                  fontWeight:   'var(--weight-extrabold)',
                  color:        'var(--text-primary)',
                  letterSpacing:'var(--tracking-tight)',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'var(--text-sm)',
                  color:      'var(--text-muted)',
                }}
              >
                {stat.label}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}