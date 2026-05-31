// ============================================================
// PRISM — CTA BANNER
// Bottom scan input. Scrolls to hero and triggers scan there.
// Results always show in the hero section — never lost.
// ============================================================

'use client'

import { useState } from 'react'
import { CONSUMER_COPY } from '@/lib/constants'
import { normalizeUrl, isValidUrl } from '@/lib/utils'
import { Search, ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function CTABanner() {
  const [value,   setValue]   = useState('')
  const [focused, setFocused] = useState(false)
  const [error,   setError]   = useState('')

  const handleScan = () => {
    const trimmed = value.trim()

    if (!trimmed) {
      setError('Please enter a URL to scan.')
      return
    }

    const normalized = normalizeUrl(trimmed)

    if (!isValidUrl(normalized)) {
      setError('Please enter a valid URL — e.g. https://example.com')
      return
    }

    setError('')

    // Scroll to the top hero section
    const heroSection = document.getElementById('scan')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Small delay to let scroll settle, then trigger the hero scan input
    setTimeout(() => {
      // Find the hero scan input and set its value + trigger scan
      const heroInput = document.querySelector<HTMLInputElement>('#scan input[type="url"]')
      if (heroInput) {
        // Set native input value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )?.set
        nativeInputValueSetter?.call(heroInput, normalized)
        heroInput.dispatchEvent(new Event('input', { bubbles: true }))

        // Trigger the scan button click
        setTimeout(() => {
          const scanBtn = document.querySelector<HTMLButtonElement>('#scan button[aria-label="Scan website"]')
          if (scanBtn) {
            scanBtn.click()
          } else {
            // Fallback: dispatch Enter key on the input
            heroInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
          }
        }, 100)
      }
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleScan()
    if (error) setError('')
  }

  return (
    <section
      style={{
        padding:    'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--bg-subtle)',
        textAlign:  'center',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-narrow)',
          margin:   '0 auto',
        }}
      >
        <ScrollReveal>
          <p className="section-label">{CONSUMER_COPY.cta.heading}</p>
          <h2
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(28px, 5vw, 52px)',
              fontWeight:   800,
              color:        'var(--text-primary)',
              letterSpacing:'var(--tracking-tight)',
              marginBottom: '16px',
            }}
          >
            Don&apos;t guess.{' '}
            <span style={{ color: 'var(--prism-green)' }}>Know.</span>
          </h2>
          <p
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-md)',
              color:        'var(--text-secondary)',
              lineHeight:   'var(--leading-relaxed)',
              marginBottom: '40px',
            }}
          >
            {CONSUMER_COPY.cta.sub}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* INPUT BOX */}
            <div
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '6px',
                background:   'var(--bg-card)',
                border:       `1.5px solid ${error ? 'var(--prism-red)' : focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-xl)',
                padding:      '8px 8px 8px 20px',
                boxShadow:    focused ? 'var(--shadow-focus-green)' : 'var(--shadow-sm)',
                transition:   'all var(--transition-base)',
              }}
            >
              <Search
                size={16}
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
              />

              <input
                type="url"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://example.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Enter website URL to scan"
                style={{
                  flex:       1,
                  border:     'none',
                  outline:    'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize:   'var(--text-sm)',
                  color:      'var(--text-primary)',
                  minWidth:   0,
                }}
              />

              <button
                onClick={handleScan}
                style={{
                  flexShrink:     0,
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '6px',
                  fontFamily:     'var(--font-display)',
                  fontSize:       'var(--text-base)',
                  fontWeight:     700,
                  color:          'white',
                  background:     'var(--text-primary)',
                  border:         'none',
                  borderRadius:   'var(--radius-lg)',
                  padding:        '12px 22px',
                  cursor:         'pointer',
                  transition:     'all var(--transition-fast)',
                  whiteSpace:     'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#333'
                  e.currentTarget.style.transform  = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow  = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--text-primary)'
                  e.currentTarget.style.transform  = 'translateY(0)'
                  e.currentTarget.style.boxShadow  = 'none'
                }}
              >
                Scan a Site Now
                <ArrowRight size={14} />
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <p style={{
                fontFamily:  'var(--font-body)',
                fontSize:    'var(--text-sm)',
                color:       'var(--prism-red)',
                marginTop:   '10px',
                textAlign:   'left',
              }}>
                {error}
              </p>
            )}

            {/* NOTE */}
            <p style={{
              fontFamily:     'var(--font-body)',
              fontSize:       'var(--text-xs)',
              color:          'var(--text-muted)',
              marginTop:      '12px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '16px',
              flexWrap:       'wrap',
            }}>
              {['No signup', 'Free, every time', 'Results in seconds'].map((note) => (
                <span key={note} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="var(--prism-green)" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {note}
                </span>
              ))}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}