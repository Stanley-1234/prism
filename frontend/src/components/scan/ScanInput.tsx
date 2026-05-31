// ============================================================
// PRISM — SCAN INPUT
// The URL input box + submit button.
// Used on both consumer and developer pages.
// Validates URL format before submitting.
// ============================================================

'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Search, ArrowRight, AlertCircle } from 'lucide-react'
import { isValidUrl, normalizeUrl } from '@/lib/utils'

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------

interface ScanInputProps {
  onScan:        (url: string) => void
  isLoading?:    boolean
  placeholder?:  string
  buttonText?:   string
  size?:         'default' | 'large'
  autoFocus?:    boolean
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

export default function ScanInput({
  onScan,
  isLoading   = false,
  placeholder = 'https://the-site-youre-unsure-about.com',
  buttonText  = 'Check Now',
  size        = 'default',
  autoFocus   = false,
}: ScanInputProps) {
  const [value,   setValue]   = useState('')
  const [error,   setError]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLarge = size === 'large'

  // ----------------------------------------------------------
  // SUBMIT HANDLER
  // ----------------------------------------------------------
  const handleSubmit = () => {
    const trimmed = value.trim()

    if (!trimmed) {
      setError('Please enter a URL to scan.')
      inputRef.current?.focus()
      return
    }

    const normalized = normalizeUrl(trimmed)

    if (!isValidUrl(normalized)) {
      setError('Please enter a valid URL — e.g. https://example.com')
      inputRef.current?.focus()
      return
    }

    setError('')
    onScan(normalized)
  }

  // ----------------------------------------------------------
  // KEYBOARD HANDLER
  // ----------------------------------------------------------
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
    if (error) setError('')
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div style={{ width: '100%' }}>

      {/* INPUT ROW */}
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '6px',
          background:   'var(--bg-card)',
          flexWrap:     'nowrap',
          border:       `1.5px solid ${error ? 'var(--prism-red)' : focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-xl)',
          padding:      isLarge ? '8px 8px 8px 24px' : '6px 6px 6px 18px',
          boxShadow:    focused
            ? error
              ? 'var(--shadow-focus-red)'
              : 'var(--shadow-focus-green)'
            : 'var(--shadow-sm)',
          transition:   'all var(--transition-base)',
        }}
      >
        {/* SEARCH ICON */}
        <Search
          size={isLarge ? 18 : 16}
          style={{
            color:     error ? 'var(--prism-red)' : 'var(--text-muted)',
            flexShrink: 0,
            transition: 'color var(--transition-fast)',
          }}
        />

        {/* INPUT */}
        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError('')
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={isLoading}
          aria-label="Enter website URL to scan"
          aria-describedby={error ? 'scan-error' : undefined}
          style={{
            flex:        1,
            border:      'none',
            outline:     'none',
            background:  'transparent',
            fontFamily:  'var(--font-mono)',
            fontSize:    isLarge ? 'var(--text-base)' : 'var(--text-sm)',
            color:       'var(--text-primary)',
            minWidth:    0,
            opacity:     isLoading ? 0.5 : 1,
          }}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="Scan website"
          style={{
            flexShrink:     0,
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '6px',
            fontFamily:     'var(--font-display)',
            fontSize:       isLarge ? 'var(--text-base)' : 'var(--text-sm)',
            fontWeight:     'var(--weight-bold)',
            color:          'var(--text-inverse)',
            background:     isLoading ? '#666' : 'var(--text-primary)',
            border:         'none',
            borderRadius:   'var(--radius-lg)',
            padding:     isLarge ? '12px 16px' : '10px 14px',
            cursor:         isLoading ? 'not-allowed' : 'pointer',
            transition:     'all var(--transition-fast)',
            whiteSpace:     'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background  = '#333'
              e.currentTarget.style.transform   = 'translateY(-1px)'
              e.currentTarget.style.boxShadow   = 'var(--shadow-md)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = isLoading ? '#666' : 'var(--text-primary)'
            e.currentTarget.style.transform   = 'translateY(0)'
            e.currentTarget.style.boxShadow   = 'none'
          }}
        >
          {isLoading ? (
            <>
              <span
                style={{
                  width:        '14px',
                  height:       '14px',
                  border:       '2px solid rgba(255,255,255,0.3)',
                  borderTop:    '2px solid white',
                  borderRadius: '50%',
                  animation:    'spin 0.8s linear infinite',
                  display:      'inline-block',
                }}
              />
              Scanning…
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          id="scan-error"
          role="alert"
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '6px',
            marginTop:  '10px',
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-sm)',
            color:      'var(--prism-red)',
            animation:  'fadeUp 0.2s ease-out forwards',
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* BELOW INPUT NOTE */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'var(--text-xs)',
          color:      'var(--text-muted)',
          marginTop:  '12px',
          textAlign:  'center',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap:        '16px',
        }}
      >
        {['No signup', 'Free, every time', 'Results in seconds'].map((note) => (
          <span
            key={note}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="var(--prism-green)" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {note}
          </span>
        ))}
      </p>

      {/* SPIN KEYFRAME */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}