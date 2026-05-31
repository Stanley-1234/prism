// ============================================================
// PRISM — HOW IT WORKS
// 3-step explainer grid.
// Used on the consumer landing page.
// ============================================================
'use client'
import { Link, Search, ShieldCheck } from 'lucide-react'
import { HOW_IT_WORKS_STEPS, CONSUMER_COPY } from '@/lib/constants'
import ScrollReveal from '@/components/ui/ScrollReveal'

const ICONS = [
  <Link    size={20} key="link"   stroke="var(--text-secondary)" />,
  <Search  size={20} key="search" stroke="var(--text-secondary)" />,
  <ShieldCheck size={20} key="shield" stroke="var(--text-secondary)" />,
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding:    'var(--section-padding-y) var(--section-padding-x)',
        background: 'var(--bg-page)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
        }}
      >
        {/* HEADING */}
        <ScrollReveal>
          <p className="section-label">{CONSUMER_COPY.howItWorks.label}</p>
          <h2
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(28px, 3.5vw, 44px)',
              fontWeight:   'var(--weight-extrabold)',
              color:        'var(--text-primary)',
              letterSpacing:'var(--tracking-tight)',
              marginBottom: '56px',
              maxWidth:     '480px',
            }}
          >
            {CONSUMER_COPY.howItWorks.heading}
          </h2>
        </ScrollReveal>

        {/* STEPS GRID */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '2px',
            background:          'var(--border-default)',
            border:              '1px solid var(--border-default)',
            borderRadius:        'var(--radius-xl)',
            overflow:            'hidden',
          }}
          className="how-grid"
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 100}>
              <div
                style={{
                  background:  'var(--bg-card)',
                  padding:     '40px 36px',
                  height:      '100%',
                  transition:  'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-page)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)'
                }}
              >
                {/* STEP NUMBER */}
                <div
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '8px',
                    marginBottom: '20px',
                    fontFamily:   'var(--font-body)',
                    fontSize:     'var(--text-xs)',
                    fontWeight:   'var(--weight-semibold)',
                    letterSpacing:'var(--tracking-widest)',
                    textTransform:'uppercase',
                    color:        'var(--text-muted)',
                  }}
                >
                  <span
                    style={{
                      display:    'inline-block',
                      width:      '20px',
                      height:     '1px',
                      background: 'var(--border-strong)',
                    }}
                  />
                  Step {step.number}
                </div>

                {/* ICON */}
                <div
                  style={{
                    width:          '44px',
                    height:         '44px',
                    borderRadius:   'var(--radius-md)',
                    background:     'var(--bg-subtle)',
                    border:         '1px solid var(--border-default)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    marginBottom:   '20px',
                  }}
                >
                  {ICONS[index]}
                </div>

                {/* CONTENT */}
                <h3
                  style={{
                    fontFamily:   'var(--font-display)',
                    fontSize:     'var(--text-lg)',
                    fontWeight:   'var(--weight-bold)',
                    color:        'var(--text-primary)',
                    marginBottom: '10px',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'var(--text-sm)',
                    color:      'var(--text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {step.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}