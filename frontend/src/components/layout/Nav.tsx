// ============================================================
// PRISM — NAV
// Sticky navigation bar.
// Frosted glass effect on scroll.
// Uses the real logo PNG from /public.
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const pathname = usePathname()

  // Frosted glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0)
    return () => clearTimeout(timer)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'For Developers', href: '/developers' },
    { label: 'How It Works',   href: '/#how-it-works' },
  ]

  return (
    <>
      <header
        role="banner"
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          right:      0,
          zIndex:     'var(--z-sticky)' as unknown as number,
          height:     'var(--nav-height)',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          ...(scrolled ? {
            background:   'rgba(249,247,244,0.88)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: '1px solid var(--border-default)',
            boxShadow:    'var(--shadow-sm)',
          } : {
            background:   'transparent',
            borderBottom: '1px solid transparent',
          }),
        }}
      >
        <div
          style={{
            maxWidth:      'var(--container-max)',
            margin:        '0 auto',
            padding:       '0 var(--section-padding-x)',
            height:        '100%',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'space-between',
            gap:           '24px',
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            style={{
              display:    'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
            aria-label="Prism home"
          >
            <Image
              src="/PRISM_FULL_LOGO.png"
              alt="Prism"
              width={160}
              height={55}
              style={{ objectFit: 'contain', height: '80px', width: 'auto' }}
              priority
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav
            aria-label="Main navigation"
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '32px',
            }}
            className="hide-mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily:     'var(--font-body)',
                  fontSize:       'var(--text-sm)',
                  fontWeight:     'var(--weight-medium)',
                  color:          pathname === link.href
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                  letterSpacing:  'var(--tracking-normal)',
                  transition:     'color var(--transition-fast)',
                  whiteSpace:     'nowrap',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP RIGHT ACTIONS */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '12px',
              flexShrink: 0,
            }}
            className="hide-mobile"
          >
            <Link
              href="/developers#scan"
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '6px',
                fontFamily:      'var(--font-display)',
                fontSize:        'var(--text-sm)',
                fontWeight:      'var(--weight-bold)',
                color:           'var(--text-primary)',
                background:      'var(--bg-card)',
                border:          '1px solid var(--border-default)',
                borderRadius:    'var(--radius-md)',
                padding:         '8px 16px',
                transition:      'all var(--transition-fast)',
                whiteSpace:      'nowrap',
                textDecoration:  'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.boxShadow   = 'var(--shadow-sm)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            >
              For Developers →
            </Link>

            <Link
              href="/#scan"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                fontFamily:     'var(--font-display)',
                fontSize:       'var(--text-sm)',
                fontWeight:     'var(--weight-bold)',
                color:          'var(--text-inverse)',
                background:     'var(--text-primary)',
                borderRadius:   'var(--radius-md)',
                padding:        '8px 18px',
                transition:     'all var(--transition-fast)',
                whiteSpace:     'nowrap',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333333'
                e.currentTarget.style.transform  = 'translateY(-1px)'
                e.currentTarget.style.boxShadow  = 'var(--shadow-md)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--text-primary)'
                e.currentTarget.style.transform  = 'translateY(0)'
                e.currentTarget.style.boxShadow  = 'none'
              }}
            >
              Check a Site
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              display:        'flex',
              flexDirection:  'column',
              gap:            '5px',
              padding:        '8px',
              background:     'none',
              border:         'none',
              cursor:         'pointer',
              borderRadius:   'var(--radius-sm)',
            }}
          >
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '2px',
              background:      'var(--text-primary)',
              borderRadius:    '2px',
              transition:      'all 0.3s ease',
              transform:       menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '2px',
              background:      'var(--text-primary)',
              borderRadius:    '2px',
              transition:      'all 0.3s ease',
              opacity:         menuOpen ? 0 : 1,
            }} />
            <span style={{
              display:         'block',
              width:           '22px',
              height:          '2px',
              background:      'var(--text-primary)',
              borderRadius:    '2px',
              transition:      'all 0.3s ease',
              transform:       menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            position:   'fixed',
            inset:      0,
            zIndex:     'var(--z-modal)' as unknown as number,
            background: 'var(--bg-page)',
            paddingTop: 'var(--nav-height)',
            animation:  'fadeIn 0.2s ease-out forwards',
          }}
        >
          <nav
            style={{
              display:        'flex',
              flexDirection:  'column',
              padding:        '32px var(--section-padding-x)',
              gap:            '8px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     'var(--text-xl)',
                  fontWeight:   'var(--weight-bold)',
                  color:        'var(--text-primary)',
                  padding:      '16px 0',
                  borderBottom: '1px solid var(--border-default)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/#scan"
                style={{
                  display:        'flex',
                  justifyContent: 'center',
                  fontFamily:     'var(--font-display)',
                  fontSize:       'var(--text-base)',
                  fontWeight:     'var(--weight-bold)',
                  color:          'var(--text-inverse)',
                  background:     'var(--text-primary)',
                  borderRadius:   'var(--radius-md)',
                  padding:        '14px 24px',
                  textDecoration: 'none',
                }}
              >
                Check a Site — Free
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* NAV HEIGHT SPACER */}
      <div style={{ height: 'var(--nav-height)' }} aria-hidden="true" />

      {/* RESPONSIVE HELPERS */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}