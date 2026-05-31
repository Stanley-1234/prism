// ============================================================
// PRISM — CONNECTION TOAST
// Slides in from the right when a scan fails due to
// poor internet connection. Auto-dismisses after 6 seconds.
// ============================================================

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Wifi, X, RefreshCw } from 'lucide-react'

interface ConnectionToastProps {
  show:      boolean
  onDismiss: () => void
  onRetry?:  () => void
}

export default function ConnectionToast({
  show,
  onDismiss,
  onRetry,
}: ConnectionToastProps) {
  const [visible,  setVisible]  = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      // Trigger enter animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntering(true))
      })

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [show])

  const handleDismiss = useCallback(() => {
    setEntering(false)
    // Wait for exit animation then hide
    setTimeout(() => {
      setVisible(false)
      onDismiss()
    }, 350)
  }, [onDismiss])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position:     'fixed',
        bottom:       '24px',
        right:        '24px',
        zIndex:       200,
        maxWidth:     '360px',
        width:        'calc(100vw - 48px)',
        background:   'var(--bg-card)',
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        boxShadow:    'var(--shadow-xl)',
        overflow:     'hidden',
        transform:    entering ? 'translateX(0)' : 'translateX(calc(100% + 32px))',
        opacity:      entering ? 1 : 0,
        transition:   'transform 0.4s cubic-bezier(0.34,1.20,0.64,1), opacity 0.3s ease',
      }}
    >
      {/* TOP ACCENT BAR */}
      <div style={{
        height:     '3px',
        background: 'linear-gradient(90deg, var(--prism-amber), var(--prism-red))',
      }} />

      <div style={{ padding: '16px 18px 18px' }}>
        {/* HEADER ROW */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '12px',
          marginBottom:   '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* WIFI ICON WITH PULSE */}
            <div style={{
              width:          '36px',
              height:         '36px',
              borderRadius:   'var(--radius-md)',
              background:     'rgba(244,162,97,0.10)',
              border:         '1px solid rgba(244,162,97,0.25)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              animation:      'wifiPulse 2s ease-in-out infinite',
            }}>
              <Wifi size={18} style={{ color: 'var(--prism-amber)' }} strokeWidth={1.8} />
            </div>

            <div>
              <p style={{
                fontFamily:  'var(--font-display)',
                fontSize:    'var(--text-base)',
                fontWeight:  700,
                color:       'var(--text-primary)',
                lineHeight:  1.2,
                marginBottom:'2px',
              }}>
                Connection issue
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'var(--text-xs)',
                color:      'var(--text-muted)',
              }}>
                Scan could not complete
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              width:          '24px',
              height:         '24px',
              borderRadius:   'var(--radius-sm)',
              background:     'none',
              border:         'none',
              cursor:         'pointer',
              color:          'var(--text-muted)',
              flexShrink:     0,
              transition:     'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* MESSAGE */}
        <p style={{
          fontFamily:   'var(--font-body)',
          fontSize:     'var(--text-sm)',
          color:        'var(--text-secondary)',
          lineHeight:   'var(--leading-relaxed)',
          marginBottom: '14px',
        }}>
          Please check your internet connection and try again.
          We recommend scanning a site{' '}
          <strong style={{ color: 'var(--text-primary)' }}>twice</strong>{' '}
          for the most accurate results.
        </p>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {onRetry && (
            <button
              onClick={() => {
                handleDismiss()
                onRetry()
              }}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '6px',
                fontFamily:   'var(--font-display)',
                fontSize:     'var(--text-sm)',
                fontWeight:   700,
                color:        'white',
                background:   'var(--text-primary)',
                border:       'none',
                borderRadius: 'var(--radius-md)',
                padding:      '8px 16px',
                cursor:       'pointer',
                transition:   'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-primary)' }}
            >
              <RefreshCw size={13} />
              Try Again
            </button>
          )}
          <button
            onClick={handleDismiss}
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'var(--text-sm)',
              fontWeight:   600,
              color:        'var(--text-muted)',
              background:   'var(--bg-subtle)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding:      '8px 16px',
              cursor:       'pointer',
              transition:   'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = 'var(--bg-hover)'
              e.currentTarget.style.borderColor  = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = 'var(--bg-subtle)'
              e.currentTarget.style.borderColor  = 'var(--border-default)'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>

      <style>{`
        @keyframes wifiPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}