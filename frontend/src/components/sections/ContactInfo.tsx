'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Clock } from 'lucide-react'

export default function ContactInfo() {
  return (
    <div>
      {/* BACK LINK */}
      <Link
        href="/"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '6px',
          fontFamily:     'var(--font-body)',
          fontSize:       'var(--text-sm)',
          color:          'var(--text-muted)',
          textDecoration: 'none',
          marginBottom:   '40px',
          transition:     'color var(--transition-fast)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Prism
      </Link>

      {/* LOGO */}
      <div style={{ marginBottom: '28px' }}>
        <Image
          src="/PRISM_FULL_LOGO.png"
          alt="Prism by SIU"
          width={140}
          height={48}
          style={{ objectFit: 'contain', height: '44px', width: 'auto' }}
        />
      </div>

      {/* HEADING */}
      <h1
        style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'clamp(28px, 4vw, 44px)',
          fontWeight:   800,
          lineHeight:   1.1,
          letterSpacing:'-0.02em',
          color:        'var(--text-primary)',
          marginBottom: '16px',
        }}
      >
        Let&apos;s secure<br />
        <span style={{ color: 'var(--prism-green)' }}>your business.</span>
      </h1>

      <p
        style={{
          fontFamily:   'var(--font-body)',
          fontSize:     'var(--text-md)',
          color:        'var(--text-secondary)',
          lineHeight:   'var(--leading-relaxed)',
          marginBottom: '40px',
          maxWidth:     '400px',
        }}
      >
        Tell us what you need. A member of the SIU Security
        team will be in touch within 24 hours.
      </p>

      {/* WHAT YOU GET */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {[
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--prism-green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
          text: 'Manual penetration testing by certified security professionals',
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--prism-green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
          text: 'Full written report with prioritised findings and fix guidance',
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--prism-green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
          text: 'Remediation support — we help you fix what we find',
        },
        {
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--prism-green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
          text: 'Certificate of security compliance on completion',
        },
      ].map((item) => (
        <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-sm)',
            color:      'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
          }}>
            {item.text}
          </p>
        </div>
      ))}
          
      </div>

      {/* DIVIDER */}
      <div style={{ height: '1px', background: 'var(--border-default)', marginBottom: '32px' }} />

      {/* CONTACT DETAILS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{
          fontFamily:    'var(--font-body)',
          fontSize:      'var(--text-xs)',
          fontWeight:    600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color:         'var(--text-muted)',
          marginBottom:  '4px',
        }}>
          Contact us directly
        </p>

        {/* PHONE */}
        <a
          href="tel:+2347072403048"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          <div style={{
            width: '36px', height: '36px',
            borderRadius:   'var(--radius-md)',
            background:     'var(--prism-green-light)',
            border:         '1px solid var(--prism-green-border)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
          }}>
            <Phone size={16} style={{ color: 'var(--prism-green)' }} />
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'var(--text-base)',
              fontWeight: 700,
              color:      'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              +234 707 240 3048
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'var(--text-muted)',
            }}>
              Mon–Fri, 9am–6pm WAT
            </p>
          </div>
        </a>

        {/* EMAIL */}
        <a
          href="mailto:siutech.info@gmail.com"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          <div style={{
            width: '36px', height: '36px',
            borderRadius:   'var(--radius-md)',
            background:     'var(--prism-green-light)',
            border:         '1px solid var(--prism-green-border)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
          }}>
            <Mail size={16} style={{ color: 'var(--prism-green)' }} />
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'var(--text-base)',
              fontWeight: 700,
              color:      'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              siutech.info@gmail.com
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'var(--text-muted)',
            }}>
              We reply within 24 hours
            </p>
          </div>
        </a>

        {/* RESPONSE TIME */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '12px',
          marginTop:    '8px',
          background:   'var(--bg-subtle)',
          border:       '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding:      '12px 16px',
        }}>
          <Clock size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-sm)',
            color:      'var(--text-secondary)',
          }}>
            Average response time:{' '}
            <strong>under 4 hours</strong> during business hours
          </p>
        </div>
      </div>
    </div>
  )
}