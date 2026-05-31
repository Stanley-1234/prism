// ============================================================
// PRISM — HERO DEVELOPER
// Hero section for the developer landing page.
// Split layout — headline left, scan input right.
// ============================================================

'use client'

import Link from 'next/link'
import { DEVELOPER_COPY } from '@/lib/constants'
import ScanInput from '@/components/scan/ScanInput'
import ScanLoader from '@/components/scan/ScanLoader'
import ScanResult from '@/components/scan/ScanResult'
import ReviewModal from '@/components/reviews/ReviewModal'
import { useScan } from '@/hooks/useScan'
import { extractDomain } from '@/lib/utils'

export default function HeroDeveloper() {
  const { state, currentStep, startScan, resetScan } = useScan()

  const isIdle    = state.status === 'idle'
  const isLoading = state.status === 'loading'
  const isSuccess = state.status === 'success'

  return (
    <>
      <section
        id="scan"
        style={{
          padding:  '80px var(--section-padding-x) 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="texture-dots"
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin:   '0 auto',
          }}
        >
          {(isIdle || state.status === 'error') && (
            <div
              style={{
                display:   'flex',
                gap:       '80px',
                alignItems:'flex-start',
                flexWrap:  'wrap',
              }}
              className="dev-hero-grid"
            >
              {/* LEFT — TEXT */}
              <div
                style={{
                  flex:     '0 0 460px',
                  minWidth: 0,
                  maxWidth: '100%',
                  animation: 'fadeUp 0.5s ease-out forwards',
                }}
              >
                {/* EYEBROW */}
                <div
                  style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           '8px',
                    fontFamily:    'var(--font-body)',
                    fontSize:      'var(--text-xs)',
                    fontWeight:    'var(--weight-semibold)',
                    letterSpacing: 'var(--tracking-widest)',
                    textTransform: 'uppercase',
                    color:         'var(--text-muted)',
                    background:    'var(--bg-card)',
                    border:        '1px solid var(--border-default)',
                    borderRadius:  'var(--radius-full)',
                    padding:       '6px 16px',
                    marginBottom:  '28px',
                  }}
                >
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%', background: 'var(--prism-green)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  {DEVELOPER_COPY.hero.eyebrow}
                </div>

                {/* HEADLINE */}
                <h1
                  style={{
                    fontFamily:   'var(--font-display)',
                    fontSize:     'clamp(32px, 4vw, 52px)',
                    fontWeight:   'var(--weight-extrabold)',
                    lineHeight:   'var(--leading-tight)',
                    letterSpacing:'var(--tracking-tight)',
                    color:        'var(--text-primary)',
                    marginBottom: '20px',
                  }}
                >
                  {DEVELOPER_COPY.hero.h1}
                </h1>

                {/* SUBHEADING */}
                <p
                  style={{
                    fontFamily:   'var(--font-body)',
                    fontSize:     'var(--text-md)',
                    color:        'var(--text-secondary)',
                    lineHeight:   'var(--leading-relaxed)',
                    marginBottom: '36px',
                  }}
                >
                  {DEVELOPER_COPY.hero.sub}
                </p>

                {/* SECONDARY CTA */}
                <Link
                  href="/contact"
                  style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '6px',
                    fontFamily:     'var(--font-body)',
                    fontSize:       'var(--text-sm)',
                    fontWeight:     'var(--weight-medium)',
                    color:          'var(--text-secondary)',
                    textDecoration: 'none',
                    transition:     'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  {DEVELOPER_COPY.hero.secondaryCTA}
                </Link>

                {/* TECH STACK BADGES */}
                <div
                  style={{
                    display:    'flex',
                    gap:        '8px',
                    marginTop:  '40px',
                    flexWrap:   'wrap',
                  }}
                >
                  {['SSL Labs API', 'VirusTotal', 'Google Safe Browsing', 'dnspython'].map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      'var(--text-xs)',
                        color:         'var(--text-muted)',
                        background:    'var(--bg-card)',
                        border:        '1px solid var(--border-default)',
                        borderRadius:  'var(--radius-sm)',
                        padding:       '4px 10px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT — SCAN INPUT */}
              <div
                style={{
                  flex:      1,
                  minWidth:  '300px',
                  animation: 'fadeUp 0.5s ease-out 0.1s both',
                }}
              >
                <div
                  style={{
                    background:   'var(--bg-card)',
                    border:       '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-2xl)',
                    padding:      '32px',
                    boxShadow:    'var(--shadow-lg)',
                  }}
                >
                  <p
                    style={{
                      fontFamily:   'var(--font-display)',
                      fontSize:     'var(--text-lg)',
                      fontWeight:   'var(--weight-bold)',
                      color:        'var(--text-primary)',
                      marginBottom: '6px',
                    }}
                  >
                    Scan your app
                  </p>
                  <p
                    style={{
                      fontFamily:   'var(--font-body)',
                      fontSize:     'var(--text-sm)',
                      color:        'var(--text-muted)',
                      marginBottom: '20px',
                    }}
                  >
                    Get your security score in seconds.
                  </p>
                  <ScanInput
                    onScan={startScan}
                    isLoading={isLoading}
                    placeholder={DEVELOPER_COPY.hero.placeholder}
                    buttonText={DEVELOPER_COPY.hero.primaryCTA}
                    size="large"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <ScanLoader
              currentStep={currentStep}
              domain={extractDomain(state.url)}
            />
          )}

          {/* RESULT */}
          {isSuccess && state.result && (
            <div style={{ width: '100%', maxWidth: '760px', margin: '0 auto' }}>
              <button
                onClick={resetScan}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)', background: 'none',
                  border: 'none', cursor: 'pointer', marginBottom: '20px',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Scan another site
              </button>
              <ScanResult result={state.result} onRescan={resetScan} />
            </div>
          )}
        </div>
      </section>

      <ReviewModal domainScanned={state.result?.domain} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 900px) {
          .dev-hero-grid { flex-direction: column !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          .dev-hero-grid > div { flex: 1 1 100% !important; min-width: 0 !important; max-width: 100% !important; }
        }
      `}</style>
    </>
  )
}