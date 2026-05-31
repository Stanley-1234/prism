// ============================================================
// PRISM — RESULT PREVIEW
// Static mockup of a scan result card.
// Shown on the consumer landing page to set expectations.
// ============================================================
'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'
import Badge from '@/components/ui/Badge'
import { Lock } from 'lucide-react'

export default function ResultPreview() {
  const categories = [
    { icon: '🔒', label: 'SSL Certificate',      score: 90, status: 'pass'     as const },
    { icon: '🛡️', label: 'Security Headers',     score: 40, status: 'critical' as const },
    { icon: '🍪', label: 'Cookie Security',       score: 60, status: 'warning'  as const },
    { icon: '🌐', label: 'DNS & Email Security',  score: 80, status: 'pass'     as const },
    { icon: '🔍', label: 'Reputation',            score: 95, status: 'pass'     as const },
    { icon: '⚙️', label: 'Tech Stack Exposure',   score: 65, status: 'warning'  as const },
  ]

  return (
    <section
      style={{
        padding:    'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--bg-page)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          display:  'flex',
          alignItems:'center',
          gap:      '80px',
          flexWrap: 'wrap',
        }}
        className="preview-wrap"
      >
        {/* LEFT — TEXT */}
        <ScrollReveal style={{ flex: '0 0 360px' }} className="preview-text">
          <p className="section-label">What to expect</p>
          <h2
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(28px, 3.5vw, 44px)',
              fontWeight:   'var(--weight-extrabold)',
              color:        'var(--text-primary)',
              letterSpacing:'var(--tracking-tight)',
              marginBottom: '16px',
            }}
          >
            Know exactly what you&apos;re getting
          </h2>
          <p
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-md)',
              color:        'var(--text-secondary)',
              lineHeight:   'var(--leading-relaxed)',
              marginBottom: '32px',
            }}
          >
            Clear scores. Plain English. No technical knowledge needed.
          </p>

          {/* FEATURE LIST */}
          {[
            'Trust score out of 100',
            'Letter grade (A+ to F)',
            'Plain English verdict',
            'Category-by-category breakdown',
            'AI-generated fix recommendations',
          ].map((item) => (
            <div
              key={item}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '10px',
                marginBottom: '12px',
                fontFamily:   'var(--font-body)',
                fontSize:     'var(--text-sm)',
                color:        'var(--text-secondary)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--prism-green)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </div>
          ))}
        </ScrollReveal>

        {/* RIGHT — MOCKUP */}
        <ScrollReveal
          delay={150}
          style={{ flex: 1, minWidth: '280px' }}
        >
          <div
            style={{
              background:   'var(--bg-card)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-2xl)',
              overflow:     'hidden',
              boxShadow:    'var(--shadow-xl)',
            }}
          >
            {/* BROWSER CHROME */}
            <div
              style={{
                background:   'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-default)',
                padding:      '12px 16px',
                display:      'flex',
                alignItems:   'center',
                gap:          '10px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#FF6058','#FFBD2E','#28C840'].map((color) => (
                  <div key={color} style={{
                    width: '10px', height: '10px',
                    borderRadius: '50%', background: color,
                  }} />
                ))}
              </div>
              <div
                style={{
                  flex:         1,
                  background:   'var(--bg-card)',
                  border:       '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding:      '4px 12px',
                  fontFamily:   'var(--font-mono)',
                  fontSize:     'var(--text-xs)',
                  color:        'var(--text-muted)',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '5px',
                }}
              >
                <Lock size={10} style={{ color: 'var(--prism-green)' }} />
                example-store.com
              </div>
            </div>

            {/* RESULT BODY */}
            <div style={{ padding: '20px' }}>
              {/* SCORE ROW */}
              <div
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '16px',
                  marginBottom: '20px',
                  paddingBottom:'16px',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                {/* MINI RING */}
                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-default)" strokeWidth="6" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="var(--prism-amber)"
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="163.4" strokeDashoffset="44" />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '16px',
                    fontWeight: 'var(--weight-extrabold)', color: 'var(--text-primary)',
                  }}>
                    74
                  </div>
                </div>

                <div>
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-display)', fontSize: '13px',
                    fontWeight: 'var(--weight-extrabold)',
                    color: '#a05c10', background: 'rgba(244,162,97,0.12)',
                    border: '1.5px solid rgba(244,162,97,0.3)',
                    borderRadius: 'var(--radius-sm)', padding: '3px 10px',
                    marginBottom: '6px',
                  }}>
                    C+
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)',
                  }}>
                    Moderate Risk
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    74/100 overall score
                  </p>
                </div>
              </div>

              {/* CATEGORY ROWS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((cat) => (
                  <div
                    key={cat.label}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      padding:        '9px 12px',
                      background:     'var(--bg-page)',
                      border:         '1px solid var(--border-default)',
                      borderRadius:   'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{cat.icon}</span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)',
                      }}>
                        {cat.label}
                      </span>
                    </div>
                    <Badge severity={cat.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{
            textAlign: 'center', fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '12px',
          }}>
            Your results look like this — no technical knowledge needed.
          </p>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .preview-wrap  { flex-direction: column !important; gap: 40px !important; }
          .preview-text  { flex: none !important; }
        }
      `}</style>
    </section>
  )
}