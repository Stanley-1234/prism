// ============================================================
// PRISM — SCORE BREAKDOWN
// Static dummy full report shown on developer page.
// Demonstrates the depth of a Prism scan result.
// ============================================================
'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'
import Badge from '@/components/ui/Badge'
import { CATEGORY_META } from '@/lib/constants'
import type { CategoryKey, Severity } from '@/lib/types'
import React from 'react'

const BREAKDOWN_ICONS: Record<CategoryKey, React.ReactNode> = {
  ssl: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D9E5F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  headers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  cookies: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  dns: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  reputation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  stack: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
}

const DEMO_SCORES: Record<CategoryKey, { score: number; status: Severity }> = {
  ssl:        { score: 90, status: 'pass'     },
  headers:    { score: 40, status: 'critical' },
  cookies:    { score: 60, status: 'warning'  },
  dns:        { score: 80, status: 'pass'     },
  reputation: { score: 95, status: 'pass'     },
  stack:      { score: 65, status: 'warning'  },
}

export default function ScoreBreakdown() {
  const keys = Object.keys(DEMO_SCORES) as CategoryKey[]

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
          gap:      '80px',
          alignItems:'flex-start',
          flexWrap: 'wrap',
        }}
        className="breakdown-wrap"
      >
        {/* LEFT — TEXT */}
        <ScrollReveal style={{ flex: '0 0 340px' }}>
          <p className="section-label">Detailed scoring</p>
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
            Six categories. One score.
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
            Every category is scored independently
            and weighted by security impact. You see
            exactly where your app is strong and
            where it needs work.
          </p>

          {/* OVERALL SCORE */}
          <div
            style={{
              background:   'var(--bg-card)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding:      '20px 24px',
              display:      'flex',
              alignItems:   'center',
              gap:          '16px',
            }}
          >
            <div
              style={{
                fontFamily:   'var(--font-display)',
                fontSize:     'var(--text-5xl)',
                fontWeight:   'var(--weight-extrabold)',
                color:        'var(--text-primary)',
                letterSpacing:'var(--tracking-tight)',
                lineHeight:   1,
              }}
            >
              74
            </div>
            <div>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-bold)', color: '#a05c10',
              }}>
                Grade: C+
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
              }}>
                Overall security score
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT — CATEGORY BARS */}
        <ScrollReveal delay={150} style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {keys.map((key) => {
              const meta  = CATEGORY_META[key]
              const demo  = DEMO_SCORES[key]

              return (
                <div
                  key={key}
                  style={{
                    background:   'var(--bg-card)',
                    border:       '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    padding:      '16px 20px',
                  }}
                >
                  {/* ROW */}
                  <div
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      marginBottom:   '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {BREAKDOWN_ICONS[key]}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)',
                      }}>
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--weight-bold)', color: 'var(--text-secondary)',
                      }}>
                        {demo.score}/100
                      </span>
                      <Badge severity={demo.status} size="sm" />
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    style={{
                      height:       '5px',
                      background:   'var(--border-default)',
                      borderRadius: 'var(--radius-full)',
                      overflow:     'hidden',
                    }}
                  >
                    <div
                      style={{
                        height:       '100%',
                        width:        `${demo.score}%`,
                        borderRadius: 'var(--radius-full)',
                        background:   demo.status === 'pass'
                          ? 'var(--prism-green)'
                          : demo.status === 'warning'
                          ? 'var(--prism-amber)'
                          : 'var(--prism-red)',
                        transition:   'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .breakdown-wrap { flex-direction: column !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}