'use client'

import { useState, useEffect } from 'react'
import { CONSUMER_COPY } from '@/lib/constants'
import ScanInput from '@/components/scan/ScanInput'
import ScanLoader from '@/components/scan/ScanLoader'
import ScanResult from '@/components/scan/ScanResult'
import ReviewModal from '@/components/reviews/ReviewModal'
import { useScan } from '@/hooks/useScan'
import { extractDomain } from '@/lib/utils'
import ConnectionToast from '@/components/ui/ConnectionToast'

export default function HeroConsumer() {
  const { state, currentStep, startScan, resetScan } = useScan()
  const [showToast, setShowToast] = useState(false)
  const [lastUrl,   setLastUrl]   = useState('')

  useEffect(() => {
    const isNetworkError =
      state.status === 'error' &&
      !!state.error &&
      (
        state.error.toLowerCase().includes('timed out') ||
        state.error.toLowerCase().includes('connection') ||
        state.error.toLowerCase().includes('network') ||
        state.error.toLowerCase().includes('unavailable') ||
        state.error.toLowerCase().includes('could not complete')
      )

    const isPartialTimeout =
      state.status === 'success' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state.result as any)?.network_issue === true

    if (isNetworkError || isPartialTimeout) {
      setLastUrl(state.url ?? '')
      setShowToast(true)
    }
  }, [state.status, state.error, state.url, state.result])

  const isIdle    = state.status === 'idle'
  const isLoading = state.status === 'loading'
  const isSuccess = state.status === 'success'
  const isError   = state.status === 'error'

  return (
    <>
      <section
        id="scan"
        style={{
          minHeight:      'calc(100vh - var(--nav-height))',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '80px var(--section-padding-x) 60px',
          position:       'relative',
          overflow:       'hidden',
          background:     'var(--bg-page)',
        }}
      >
        {/* GRID */}
        <div
          aria-hidden="true"
          style={{
            position:      'absolute',
            top:           '48px',
            left:          '80px',
            right:         '80px',
            height:        '240px',
            pointerEvents: 'none',
            zIndex:        0,
          }}
        >
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <defs>
              <pattern id="prism-grid" width="140" height="140" patternUnits="userSpaceOnUse">
                <path d="M 140 0 L 0 0 0 140" fill="none" stroke="rgba(26,26,26,0.055)" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%"  stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </linearGradient>
              <mask id="grid-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="url(#grid-fade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#prism-grid)" mask="url(#grid-mask)" />
            <g transform="translate(0, 0)">
              <line x1="-4" y1="0" x2="4" y2="0" stroke="rgba(26,26,26,0.25)" strokeWidth="0.9" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(26,26,26,0.25)" strokeWidth="0.9" />
            </g>
            <g transform="translate(140, 0)">
              <line x1="-4" y1="0" x2="4" y2="0" stroke="rgba(26,26,26,0.18)" strokeWidth="0.9" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(26,26,26,0.18)" strokeWidth="0.9" />
            </g>
          </svg>
        </div>

        {/* GLOWS */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '480px', height: '380px', background: 'radial-gradient(circle, rgba(244,162,97,0.22) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '440px', height: '360px', background: 'radial-gradient(circle, rgba(45,158,95,0.16) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', width: '360px', height: '260px', background: 'radial-gradient(circle, rgba(230,57,70,0.09) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

        {/* IDLE / ERROR */}
        {(isIdle || isError) && (
          <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1, animation: 'fadeUp 0.6s ease-out forwards' }}>
            {/* EYEBROW PILL */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)', padding: '8px 20px', marginBottom: '40px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--prism-green)', flexShrink: 0, animation: 'pulse 2s ease-in-out infinite' }} />
              {CONSUMER_COPY.hero.eyebrow}
            </div>

            {/* HEADLINE */}
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '28px' }}>
              Before you trust a site<br />
              with your data —{' '}
              <em style={{ fontStyle: 'normal', color: 'var(--prism-green)' }}>check it.</em>
            </h1>

            {/* SUBHEADING */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 400, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 52px' }}>
              {CONSUMER_COPY.hero.sub}
            </p>

            {/* ERROR MESSAGE — only for non-network errors */}
            {isError && !showToast && (
              <div style={{ background: 'var(--prism-red-light)', border: '1px solid var(--prism-red-border)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: '16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--prism-red)' }}>
                {state.error}
              </div>
            )}

            {/* SCAN INPUT */}
            <div style={{ maxWidth: '620px', margin: '0 auto', width: '100%' }}>
              <ScanInput
                onScan={startScan}
                isLoading={isLoading}
                placeholder={CONSUMER_COPY.hero.placeholder}
                buttonText={CONSUMER_COPY.hero.cta}
                size="large"
                autoFocus
              />
            </div>

            {/* PREVIEW BADGES */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
              {[
                { label: 'SSL Certificate',  status: 'pass'    },
                { label: 'Reputation',        status: 'pass'    },
                { label: 'Security Headers',  status: 'warning' },
              ].map((badge) => (
                <div key={badge.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, padding: '7px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-xs)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: badge.status === 'pass' ? 'var(--prism-green)' : 'var(--prism-amber)', flexShrink: 0 }} />
                  {badge.label}
                </div>
              ))}
            </div>

            {/* SCROLL HINT */}
            <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4, animation: 'bounce 2s ease-in-out infinite' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Scroll to learn more
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ScanLoader currentStep={currentStep} domain={extractDomain(state.url)} />
          </div>
        )}

        {/* SUCCESS */}
        {isSuccess && state.result && (
          <div style={{ width: '100%', maxWidth: '760px', position: 'relative', zIndex: 1 }}>
            <button
              onClick={resetScan}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', padding: '4px 0', transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Scan another site
            </button>
            <ScanResult result={state.result} onRescan={resetScan} />
          </div>
        )}
      </section>

      <ReviewModal domainScanned={state.result?.domain} />

      {/* CONNECTION TOAST */}
      <ConnectionToast
        show={showToast}
        onDismiss={() => setShowToast(false)}
        onRetry={() => {
          setShowToast(false)
          if (lastUrl) startScan(lastUrl)
        }}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </>
  )
}