// ============================================================
// PRISM — FUNNEL SECTION
// "Score under 70? You need more than a scanner."
// Lead generation section linking to pen test service.
// ============================================================
'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { DEVELOPER_COPY } from '@/lib/constants'

export default function FunnelSection() {
  return (
    <section
      style={{
        padding:    'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--text-primary)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-narrow)',
          margin:   '0 auto',
          textAlign:'center',
        }}
      >
        <ScrollReveal>
          {/* EYEBROW */}
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              fontFamily:     'var(--font-body)',
              fontSize:       'var(--text-xs)',
              fontWeight:     'var(--weight-semibold)',
              letterSpacing:  'var(--tracking-widest)',
              textTransform:  'uppercase',
              color:          'rgba(255,255,255,0.5)',
              marginBottom:   '24px',
            }}
          >
            <span
              style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   'var(--prism-red)',
                animation:    'pulse 2s ease-in-out infinite',
              }}
            />
            Penetration Testing
          </div>

          {/* HEADING */}
          <h2
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(28px, 4vw, 48px)',
              fontWeight:   'var(--weight-extrabold)',
              color:        'white',
              letterSpacing:'var(--tracking-tight)',
              marginBottom: '16px',
              lineHeight:   'var(--leading-tight)',
            }}
          >
            {DEVELOPER_COPY.funnel.heading}
          </h2>

          {/* SUBTEXT */}
          <p
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-md)',
              color:        'rgba(255,255,255,0.65)',
              lineHeight:   'var(--leading-relaxed)',
              marginBottom: '40px',
              maxWidth:     '440px',
              margin:       '0 auto 40px',
            }}
          >
            {DEVELOPER_COPY.funnel.sub}
          </p>

          {/* WHAT YOU GET */}
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap:                 '16px',
              marginBottom:        '40px',
            }}
            className="funnel-grid"
          >
          {[
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
            title: 'Authenticated Scanning',
            body:  'Test what logged-in users can access.',
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
            title: 'Injection Testing',
            body:  'SQL, XSS, CSRF — the full OWASP Top 10.',
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
            title: 'Full Written Report',
            body:  'Prioritised findings with remediation steps.',
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background:   'rgba(255,255,255,0.06)',
              border:       '1px solid rgba(255,255,255,0.10)',
              borderRadius: 'var(--radius-lg)',
              padding:      '24px',
              textAlign:    'left',
            }}
          >
            <div style={{
              width:          '44px',
              height:         '44px',
              borderRadius:   'var(--radius-md)',
              background:     'rgba(255,255,255,0.08)',
              border:         '1px solid rgba(255,255,255,0.12)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              marginBottom:   '16px',
              color:          'rgba(255,255,255,0.85)',
            }}>
              {item.icon}
            </div>
            <p style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'var(--text-sm)',
              fontWeight:   700,
              color:        'white',
              marginBottom: '6px',
            }}>
              {item.title}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'rgba(255,255,255,0.5)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              {item.body}
            </p>
          </div>
        ))}
          </div>

          {/* CTA BUTTON */}
          <Link
            href="/contact"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              fontFamily:     'var(--font-display)',
              fontSize:       'var(--text-base)',
              fontWeight:     'var(--weight-bold)',
              color:          'var(--text-primary)',
              background:     'white',
              borderRadius:   'var(--radius-lg)',
              padding:        '16px 32px',
              textDecoration: 'none',
              transition:     'all var(--transition-fast)',
              boxShadow:      '0 4px 24px rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform  = 'translateY(-2px)'
              e.currentTarget.style.boxShadow  = '0 8px 32px rgba(255,255,255,0.20)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform  = 'translateY(0)'
              e.currentTarget.style.boxShadow  = '0 4px 24px rgba(255,255,255,0.15)'
            }}
          >
            {DEVELOPER_COPY.funnel.cta}
          </Link>

          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    'var(--text-xs)',
            color:       'rgba(255,255,255,0.35)',
            marginTop:   '16px',
          }}>
            Response within 24 hours · Based in Nigeria · Remote worldwide
          </p>
        </ScrollReveal>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 640px) {
          .funnel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}