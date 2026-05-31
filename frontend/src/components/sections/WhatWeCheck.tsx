// ============================================================
// PRISM — WHAT WE CHECK
// Feature cards showing what Prism scans for.
// Used on consumer page (3 cards) and dev page (6 cards).
// ============================================================
'use client'

import { CATEGORY_META, CONSUMER_COPY } from '@/lib/constants'
import type { CategoryKey } from '@/lib/types'
import ScrollReveal from '@/components/ui/ScrollReveal'

const CATEGORY_ICONS = {
  ssl: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="#2D9E5F" fillOpacity="0.15"/>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2D9E5F" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2D9E5F" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="#2D9E5F"/>
    </svg>
  ),
  headers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F4A261" fillOpacity="0.15" stroke="#F4A261" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#F4A261" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cookies: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#378ADD" fillOpacity="0.12" stroke="#378ADD" strokeWidth="1.8"/>
      <circle cx="9" cy="10" r="1.2" fill="#378ADD"/>
      <circle cx="14" cy="8" r="1" fill="#378ADD"/>
      <circle cx="15" cy="14" r="1.2" fill="#378ADD"/>
      <circle cx="10" cy="15" r="0.9" fill="#378ADD"/>
    </svg>
  ),
  dns: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#8B5CF6" fillOpacity="0.12" stroke="#8B5CF6" strokeWidth="1.8"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="#8B5CF6" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#8B5CF6" strokeWidth="1.5"/>
    </svg>
  ),
  reputation: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill="#E63946" fillOpacity="0.12" stroke="#E63946" strokeWidth="1.8"/>
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#E63946" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  stack: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.6"/>
    </svg>
  ),
}
interface WhatWeCheckProps {
  variant?: 'consumer' | 'developer'
}

const CONSUMER_KEYS: CategoryKey[] = ['ssl', 'reputation', 'headers']
const DEVELOPER_KEYS: CategoryKey[] = ['ssl', 'headers', 'cookies', 'dns', 'reputation', 'stack']

const ICON_BG: Record<CategoryKey, string> = {
  ssl:        'rgba(45,158,95,0.08)',
  headers:    'rgba(244,162,97,0.10)',
  cookies:    'rgba(55,138,221,0.08)',
  dns:        'rgba(139,92,246,0.08)',
  reputation: 'rgba(230,57,70,0.08)',
  stack:      'rgba(16,185,129,0.08)',
}

const ICON_COLOR: Record<CategoryKey, string> = {
  ssl:        'var(--prism-green)',
  headers:    'var(--prism-amber)',
  cookies:    '#378ADD',
  dns:        '#8B5CF6',
  reputation: 'var(--prism-red)',
  stack:      '#10B981',
}

export default function WhatWeCheck({ variant = 'consumer' }: WhatWeCheckProps) {
  const keys = variant === 'consumer' ? CONSUMER_KEYS : DEVELOPER_KEYS
  const cols = variant === 'consumer' ? 3 : 3

  return (
    <section
      style={{
        padding:    'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
        }}
      >
        {/* HEADING */}
        <ScrollReveal>
          <div
            style={{
              textAlign:    'center',
              maxWidth:     '560px',
              margin:       '0 auto',
              marginBottom: '56px',
            }}
          >
            <p className="section-label">{CONSUMER_COPY.whatWeCheck.label}</p>
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
              {CONSUMER_COPY.whatWeCheck.heading}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'var(--text-md)',
                color:      'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {CONSUMER_COPY.whatWeCheck.sub}
            </p>
          </div>
        </ScrollReveal>

        {/* CARDS GRID */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap:                 '16px',
          }}
          className="check-grid"
        >
          {keys.map((key, index) => {
            const meta = CATEGORY_META[key]
            return (
              <ScrollReveal key={key} delay={index * 80}>
                <div
                  style={{
                    background:   'var(--bg-card)',
                    border:       '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    padding:      '28px',
                    height:       '100%',
                    transition:   'transform var(--transition-base), box-shadow var(--transition-base)',
                    cursor:       'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform  = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow  = 'var(--shadow-lg)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform  = 'translateY(0)'
                    e.currentTarget.style.boxShadow  = 'none'
                  }}
                >
                  {/* TOP ROW */}
                  <div
                    style={{
                      display:        'flex',
                      alignItems:     'flex-start',
                      justifyContent: 'space-between',
                      marginBottom:   '16px',
                    }}
                  >
                    {/* ICON */}
                    <div
                      style={{
                        width:          '44px',
                        height:         '44px',
                        borderRadius:   'var(--radius-md)',
                        background:     ICON_BG[key],
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        flexShrink:     0,
                      }}
                    >
                      {CATEGORY_ICONS[key]}
                    </div>

                    {/* CHECKED BADGE */}
                    <span
                      style={{
                        fontFamily:    'var(--font-body)',
                        fontSize:      'var(--text-xs)',
                        fontWeight:    'var(--weight-semibold)',
                        letterSpacing: 'var(--tracking-wide)',
                        textTransform: 'uppercase',
                        color:         ICON_COLOR[key],
                        background:    ICON_BG[key],
                        padding:       '4px 9px',
                        borderRadius:  'var(--radius-sm)',
                      }}
                    >
                      Checked
                    </span>
                  </div>

                  {/* CONTENT */}
                  <h3
                    style={{
                      fontFamily:   'var(--font-display)',
                      fontSize:     'var(--text-base)',
                      fontWeight:   'var(--weight-bold)',
                      color:        'var(--text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    {meta.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize:   'var(--text-sm)',
                      color:      'var(--text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {meta.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .check-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .check-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}