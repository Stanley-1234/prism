// ============================================================
// PRISM — FOOTER
// Clean minimal footer.
// Logo + links + copyright.
// ============================================================
'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { label: 'Check a Site',    href: '/#scan'       },
      { label: 'For Developers',  href: '/developers'  },
      { label: 'How It Works',    href: '/#how-it-works'},
    ],
    company: [
      { label: 'About SIU',       href: '/about'       },
      { label: 'Contact',         href: '/contact'     },
      { label: 'Book a Pen Test', href: '/contact'     },
    ],
    legal: [
      { label: 'Privacy Policy',  href: '/privacy'     },
      { label: 'Terms of Use',    href: '/terms'       },
    ],
  }

  return (
    <footer
      role="contentinfo"
      style={{
        background:   'var(--bg-card)',
        borderTop:    '1px solid var(--border-default)',
        paddingTop:   '64px',
        paddingBottom:'32px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  '0 var(--section-padding-x)',
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap:                 '48px',
            paddingBottom:       '48px',
            borderBottom:        '1px solid var(--border-default)',
          }}
          className="footer-grid"
        >
          {/* BRAND COLUMN */}
          <div>
            <Link href="/" aria-label="Prism home">
              <Image
                src="/PRISM_FULL_LOGO.png"
                alt="Prism"
                width={155}
                height={44}
                style={{ objectFit: 'contain', height: '60px', width: 'auto', marginBottom: '16px' }}
              />
            </Link>
            <p
              style={{
                fontFamily:  'var(--font-body)',
                fontSize:    'var(--text-sm)',
                color:       'var(--text-muted)',
                lineHeight:  'var(--leading-relaxed)',
                maxWidth:    '280px',
                marginTop:   '12px',
              }}
            >
              Free, instant website security scanning.
              Know if a site is safe before you trust it
              with your data.
            </p>

            {/* CTA */}
            <Link
              href="/#scan"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                marginTop:      '20px',
                fontFamily:     'var(--font-display)',
                fontSize:       'var(--text-sm)',
                fontWeight:     'var(--weight-bold)',
                color:          'var(--text-inverse)',
                background:     'var(--text-primary)',
                borderRadius:   'var(--radius-md)',
                padding:        '10px 18px',
                textDecoration: 'none',
                transition:     'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-primary)' }}
            >
              Check a Site Free →
            </Link>
          </div>

          {/* PRODUCT LINKS */}
          <div>
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      'var(--text-xs)',
                fontWeight:    'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-widest)',
                textTransform: 'uppercase',
                color:         'var(--text-muted)',
                marginBottom:  '20px',
              }}
            >
              Product
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily:     'var(--font-body)',
                      fontSize:       'var(--text-sm)',
                      color:          'var(--text-secondary)',
                      textDecoration: 'none',
                      transition:     'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      'var(--text-xs)',
                fontWeight:    'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-widest)',
                textTransform: 'uppercase',
                color:         'var(--text-muted)',
                marginBottom:  '20px',
              }}
            >
              Company
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily:     'var(--font-body)',
                      fontSize:       'var(--text-sm)',
                      color:          'var(--text-secondary)',
                      textDecoration: 'none',
                      transition:     'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL LINKS */}
          <div>
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      'var(--text-xs)',
                fontWeight:    'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-widest)',
                textTransform: 'uppercase',
                color:         'var(--text-muted)',
                marginBottom:  '20px',
              }}
            >
              Legal
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily:     'var(--font-body)',
                      fontSize:       'var(--text-sm)',
                      color:          'var(--text-secondary)',
                      textDecoration: 'none',
                      transition:     'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            paddingTop:     '24px',
            flexWrap:       'wrap',
            gap:            '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'var(--text-muted)',
            }}
          >
            © {currentYear} SIU. All rights reserved.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'var(--text-muted)',
            }}
          >
            Built by{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--weight-medium)' }}>
              SIU Security
            </span>
            {' '}· Prism is free for everyone.
          </p>
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}