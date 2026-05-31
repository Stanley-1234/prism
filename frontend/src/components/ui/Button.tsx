// ============================================================
// PRISM — BUTTON
// All button styles in one place.
// Variants: primary / secondary / ghost / danger
// Sizes: sm / md / lg
// ============================================================

'use client'

import type { ReactNode, CSSProperties } from 'react'

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children:    ReactNode
  variant?:    ButtonVariant
  size?:       ButtonSize
  onClick?:    () => void
  disabled?:   boolean
  loading?:    boolean
  fullWidth?:  boolean
  href?:       string
  type?:       'button' | 'submit' | 'reset'
  style?:      CSSProperties
  ariaLabel?:  string
}

// ------------------------------------------------------------
// STYLE MAPS
// ------------------------------------------------------------

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background:  'var(--text-primary)',
    color:       'white',
    border:      '1.5px solid var(--text-primary)',
  },
  secondary: {
    background:  'var(--bg-card)',
    color:       'var(--text-primary)',
    border:      '1.5px solid var(--border-default)',
  },
  ghost: {
    background:  'transparent',
    color:       'var(--text-secondary)',
    border:      '1.5px solid transparent',
  },
  danger: {
    background:  'var(--prism-red)',
    color:       'white',
    border:      '1.5px solid var(--prism-red)',
  },
}

const VARIANT_HOVER: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: '#333333',
  },
  secondary: {
    background:   'var(--bg-subtle)',
    borderColor:  'var(--border-strong)',
  },
  ghost: {
    background:  'var(--bg-subtle)',
    color:       'var(--text-primary)',
  },
  danger: {
    background: '#c0242f',
  },
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: {
    fontSize:    'var(--text-xs)',
    fontWeight:  'var(--weight-semibold)',
    padding:     '7px 14px',
    borderRadius:'var(--radius-md)',
    gap:         '5px',
  },
  md: {
    fontSize:    'var(--text-sm)',
    fontWeight:  'var(--weight-bold)',
    padding:     '10px 20px',
    borderRadius:'var(--radius-md)',
    gap:         '6px',
  },
  lg: {
    fontSize:    'var(--text-base)',
    fontWeight:  'var(--weight-bold)',
    padding:     '14px 28px',
    borderRadius:'var(--radius-lg)',
    gap:         '8px',
  },
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  onClick,
  disabled  = false,
  loading   = false,
  fullWidth = false,
  type      = 'button',
  style,
  ariaLabel,
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant]
  const sizeStyle    = SIZE_STYLES[size]
  const hoverStyle   = VARIANT_HOVER[variant]

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={{
        // Base
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     'var(--font-display)',
        letterSpacing:  'var(--tracking-normal)',
        lineHeight:     1,
        cursor:         isDisabled ? 'not-allowed' : 'pointer',
        opacity:        isDisabled ? 0.5 : 1,
        width:          fullWidth ? '100%' : undefined,
        transition:     'all var(--transition-fast)',
        whiteSpace:     'nowrap',
        textDecoration: 'none',
        // Variant
        ...variantStyle,
        // Size
        ...sizeStyle,
        // Override
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          Object.assign(e.currentTarget.style, hoverStyle)
          e.currentTarget.style.transform  = 'translateY(-1px)'
          e.currentTarget.style.boxShadow  = 'var(--shadow-md)'
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyle)
        e.currentTarget.style.transform  = 'translateY(0)'
        e.currentTarget.style.boxShadow  = 'none'
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width:        '13px',
              height:       '13px',
              border:       '2px solid rgba(255,255,255,0.3)',
              borderTop:    '2px solid currentColor',
              borderRadius: '50%',
              animation:    'btnSpin 0.8s linear infinite',
              display:      'inline-block',
              flexShrink:   0,
            }}
          />
          Loading…
        </>
      ) : children}

      <style>{`
        @keyframes btnSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}