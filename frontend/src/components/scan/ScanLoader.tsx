// ============================================================
// PRISM — SCAN LOADER
// Animated loading state shown while scan is running.
// Shows the prism logo animating + step-by-step progress.
// ============================================================

'use client'

import { LOADING_STEPS } from '@/lib/constants'

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------

interface ScanLoaderProps {
  currentStep: number
  domain:      string
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

export default function ScanLoader({ currentStep, domain }: ScanLoaderProps) {
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        '64px 40px',
        animation:      'fadeUp 0.4s ease-out forwards',
      }}
    >
      {/* ANIMATED PRISM LOGO */}
      <div
        style={{
          marginBottom: '40px',
          animation:    'prismPulse 2s ease-in-out infinite',
        }}
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Triangle outline */}
          <polygon
            points="60,8 108,100 12,100"
            stroke="var(--text-primary)"
            strokeWidth="3.5"
            fill="none"
            strokeLinejoin="round"
          />
          {/* Input beam */}
          <line
            x1="0" y1="54"
            x2="60" y2="54"
            stroke="var(--border-strong)"
            strokeWidth="2"
          />
          {/* Red band */}
          <line
            x1="60" y1="54"
            x2="116" y2="22"
            stroke="var(--prism-red)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              opacity:    currentStep >= 1 ? 1 : 0.2,
              transition: 'opacity 0.5s ease',
            }}
          />
          {/* Amber band */}
          <line
            x1="60" y1="55"
            x2="116" y2="55"
            stroke="var(--prism-amber)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              opacity:    currentStep >= 2 ? 1 : 0.2,
              transition: 'opacity 0.5s ease 0.1s',
            }}
          />
          {/* Green band */}
          <line
            x1="60" y1="56"
            x2="116" y2="88"
            stroke="var(--prism-green)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              opacity:    currentStep >= 3 ? 1 : 0.2,
              transition: 'opacity 0.5s ease 0.2s',
            }}
          />
        </svg>
      </div>

      {/* DOMAIN BEING SCANNED */}
      <p
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-sm)',
          color:         'var(--text-muted)',
          marginBottom:  '8px',
          letterSpacing: '0.02em',
        }}
      >
        {domain}
      </p>

      {/* HEADING */}
      <h2
        style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'var(--text-xl)',
          fontWeight:   'var(--weight-bold)',
          color:        'var(--text-primary)',
          marginBottom: '6px',
          textAlign:    'center',
        }}
      >
        Scanning your site…
      </h2>

      <p
        style={{
          fontFamily:   'var(--font-body)',
          fontSize:     'var(--text-sm)',
          color:        'var(--text-muted)',
          marginBottom: '40px',
          textAlign:    'center',
        }}
      >
        This takes about 5 seconds
      </p>

      {/* STEP LIST */}
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '10px',
          width:         '100%',
          maxWidth:      '340px',
        }}
      >
        {LOADING_STEPS.map((step, index) => {
          const isDone    = index < currentStep
          const isActive  = index === currentStep
          const isPending = index > currentStep

          return (
            <div
              key={step}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '12px',
                opacity:    isPending ? 0.35 : 1,
                transform:  isActive ? 'translateX(4px)' : 'translateX(0)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* STATUS DOT */}
              <div
                style={{
                  width:        '8px',
                  height:       '8px',
                  borderRadius: '50%',
                  flexShrink:   0,
                  background:   isDone
                    ? 'var(--prism-green)'
                    : isActive
                    ? 'var(--prism-amber)'
                    : 'var(--border-strong)',
                  transition:   'background 0.3s ease',
                  animation:    isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              />

              {/* STEP LABEL */}
              <span
                style={{
                  fontFamily:  'var(--font-body)',
                  fontSize:    'var(--text-sm)',
                  fontWeight:  isActive ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  color:       isDone
                    ? 'var(--text-muted)'
                    : isActive
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                  transition:  'color 0.3s ease',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}
              >
                {step}
              </span>

              {/* DONE CHECKMARK */}
              {isDone && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--prism-green)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: 'auto', flexShrink: 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          width:        '100%',
          maxWidth:     '340px',
          height:       '3px',
          background:   'var(--border-default)',
          borderRadius: 'var(--radius-full)',
          marginTop:    '32px',
          overflow:     'hidden',
        }}
      >
        <div
          style={{
            height:       '100%',
            background:   'linear-gradient(90deg, var(--prism-green), var(--prism-amber))',
            borderRadius: 'var(--radius-full)',
            width:        `${Math.round((currentStep / (LOADING_STEPS.length - 1)) * 100)}%`,
            transition:   'width 0.6s ease',
          }}
        />
      </div>

      {/* PULSE ANIMATION */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes prismPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.75; transform: scale(0.97); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}