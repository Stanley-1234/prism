'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Shield, Award, Users, Zap,
  ArrowRight, CheckCircle, Lock
} from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const SERVICES = [
  {
    title: 'Penetration Testing',
    body:  'Full manual pen test — OWASP Top 10, business logic, authenticated scanning.',
    icon:  Shield,
    bg:    'rgba(45,158,95,0.08)',
    color: 'var(--prism-green)',
  },
  {
    title: 'Security Audit',
    body:  'Comprehensive review of your infrastructure, code, and security posture.',
    icon:  CheckCircle,
    bg:    'rgba(59,130,246,0.08)',
    color: '#3b82f6',
  },
  {
    title: 'Security Consultation',
    body:  'Expert advice on your security strategy, tools, and team practices.',
    icon:  Users,
    bg:    'rgba(139,92,246,0.08)',
    color: '#8b5cf6',
  },
]

const STATS = [
  { value: '5+',   label: 'Years in cybersecurity' },
  { value: '50+',  label: 'Systems secured'         },
  { value: '100%', label: 'Client confidentiality'  },
  { value: '24h',  label: 'Response time'           },
]

const VALUES = [
  {
    icon:  Lock,
    title: 'Integrity first',
    body:  'We never share client information. What we find stays between us and you.',
  },
  {
    icon:  Zap,
    title: 'Speed without compromise',
    body:  'Fast turnarounds, thorough results. We don\'t make you choose between speed and depth.',
  },
  {
    icon:  Users,
    title: 'Real humans, real advice',
    body:  'No automated reports passed off as expert work. Every engagement is handled by our team personally.',
  },
  {
    icon:  Award,
    title: 'Results you can act on',
    body:  'We don\'t just find problems — we tell you exactly how to fix them, in plain English.',
  },
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-page)' }}>

      {/* HERO */}
      <section style={{
        padding: '100px var(--section-padding-x) 80px',
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg-page)',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '48px', left: '80px', right: '80px',
          height: '200px', pointerEvents: 'none', zIndex: 0,
        }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-grid" width="140" height="140" patternUnits="userSpaceOnUse">
                <path d="M 140 0 L 0 0 0 140" fill="none" stroke="rgba(26,26,26,0.055)" strokeWidth="0.8"/>
              </pattern>
              <linearGradient id="about-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="white" stopOpacity="0"/>
                <stop offset="100%" stopColor="white" stopOpacity="1"/>
              </linearGradient>
              <mask id="about-mask">
                <rect width="100%" height="100%" fill="white"/>
                <rect width="100%" height="100%" fill="url(#about-fade)"/>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" mask="url(#about-mask)"/>
            <g transform="translate(0,0)">
              <line x1="-4" y1="0" x2="4" y2="0" stroke="rgba(26,26,26,0.25)" strokeWidth="0.9"/>
              <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(26,26,26,0.25)" strokeWidth="0.9"/>
            </g>
          </svg>
        </div>

        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)', textDecoration: 'none',
            marginBottom: '48px', transition: 'color var(--transition-fast)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Prism
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="about-hero-grid">
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--text-muted)', background: 'var(--bg-card)',
                border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)',
                padding: '6px 16px', marginBottom: '28px',
              }}>
                <Shield size={11} style={{ color: 'var(--prism-green)' }}/>
                About SIU Security
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 800, lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)', marginBottom: '24px',
              }}>
                Security you can<br/>
                <span style={{ color: 'var(--prism-green)' }}>actually trust.</span>
              </h1>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '18px',
                color: 'var(--text-secondary)', lineHeight: 1.7,
                marginBottom: '36px', maxWidth: '440px',
              }}>
                SIU is a Nigerian cybersecurity and web design firm.
                We built Prism because we were tired of watching
                businesses get compromised by problems a basic scan
                would have caught.
              </p>

              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',
                fontWeight: 700, color: 'white',
                background: 'var(--text-primary)',
                borderRadius: 'var(--radius-lg)', padding: '14px 28px',
                textDecoration: 'none', transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#333'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--text-primary)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Work with us
                <ArrowRight size={16}/>
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-2xl)',
                padding: '48px 40px', textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
                maxWidth: '360px', width: '100%',
              }}>
                <Image
                  src="/PRISM_FULL_LOGO.png"
                  alt="SIU Security"
                  width={200} height={80}
                  style={{ objectFit: 'contain', height: '64px', width: 'auto', margin: '0 auto 24px' }}
                />
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)',
                  marginBottom: '24px',
                }}>
                  SIU Cybersecurity Services &amp;<br/>SIU Web Designs
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Penetration Testing',
                    'Security Audits',
                    'Web Design & Development',
                    'Security Consulting',
                  ].map((s) => (
                    <div key={s} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                    }}>
                      <CheckCircle size={14} style={{ color: 'var(--prism-green)', flexShrink: 0 }}/>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-card)',
        padding: '28px var(--section-padding-x)',
      }}>
        <div style={{
          maxWidth: 'var(--container-max)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px', textAlign: 'center',
        }} className="stats-grid">
          {STATS.map((stat) => (
            <ScrollReveal key={stat.label}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  color: 'var(--text-primary)', lineHeight: 1, marginBottom: '6px',
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)',
                }}>
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section style={{ padding: 'var(--section-padding-y) var(--section-padding-x)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <ScrollReveal>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '12px',
            }}>
              What we do
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: '56px', maxWidth: '480px',
            }}>
              Two companies. One mission.
            </h2>
          </ScrollReveal>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
          }} className="services-grid">
            {SERVICES.map((service, i) => {
              const Icon = service.icon
              return (
                <ScrollReveal key={`service-${i}`} delay={i * 80}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '32px 28px', height: '100%',
                    transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: '48px', height: '48px',
                      borderRadius: 'var(--radius-lg)',
                      background: service.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '20px',
                    }}>
                      <Icon size={22} style={{ color: service.color }} strokeWidth={1.5}/>
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
                      fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px',
                    }}>
                      {service.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)',
                    }}>
                      {service.body}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--bg-subtle)',
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <ScrollReveal>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '12px',
            }}>
              How we work
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', marginBottom: '56px', maxWidth: '480px',
            }}>
              What makes SIU different.
            </h2>
          </ScrollReveal>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px',
          }} className="values-grid">
            {VALUES.map((val, i) => {
              const Icon = val.icon
              return (
                <ScrollReveal key={`value-${i}`} delay={i * 60}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '28px 32px',
                    display: 'flex', gap: '20px', alignItems: 'flex-start',
                    transition: 'box-shadow var(--transition-base)',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{
                      width: '40px', height: '40px', flexShrink: 0,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} style={{ color: 'var(--text-secondary)' }} strokeWidth={1.5}/>
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',
                        fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px',
                      }}>
                        {val.title}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)',
                      }}>
                        {val.body}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--text-primary)', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto' }}>
          <ScrollReveal>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: 'white', marginBottom: '16px',
            }}>
              Ready to secure your business?
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
              color: 'rgba(255,255,255,0.6)', lineHeight: 'var(--leading-relaxed)',
              marginBottom: '40px',
            }}>
              Start with a free Prism scan, or book a full penetration test with our team.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',
                fontWeight: 700, color: 'var(--text-primary)',
                background: 'white', borderRadius: 'var(--radius-lg)',
                padding: '14px 28px', textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.20)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Run a Free Scan
                <ArrowRight size={16}/>
              </Link>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)',
                fontWeight: 700, color: 'white',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 28px', textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)' }}
              >
                Book a Pen Test
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-hero-grid  { grid-template-columns: 1fr !important; gap: 40px !important; }
          .services-grid    { grid-template-columns: 1fr !important; }
          .values-grid      { grid-template-columns: 1fr !important; }
          .stats-grid       { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}