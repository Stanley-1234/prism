'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'

const STEPS = [
  {
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    label: 'Build',
    body:  'Write your code and deploy to staging.',
    color: 'var(--prism-green)',
  },
  {
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    label: 'Scan',
    body:  'Run Prism against your staging URL.',
    color: 'var(--prism-amber)',
  },
  {
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    label: 'Fix',
    body:  'Fix the issues Prism flagged — with AI-generated guidance.',
    color: 'var(--prism-red)',
  },
  {
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    label: 'Ship',
    body:  'Deploy with confidence. Your users are protected.',
    color: 'var(--text-primary)',
  },
]

export default function WorkflowSteps() {
  return (
    <section
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
        <ScrollReveal>
          <p style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '11px',
            fontWeight:    600,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color:         'var(--text-muted)',
            marginBottom:  '12px',
          }}>
            Developer workflow
          </p>
          <h2
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(28px, 3.5vw, 44px)',
              fontWeight:   800,
              color:        'var(--text-primary)',
              letterSpacing:'-0.02em',
              marginBottom: '56px',
              maxWidth:     '480px',
            }}
          >
            Prism fits in your existing workflow
          </h2>
        </ScrollReveal>

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 '0',
            position:            'relative',
          }}
          className="workflow-grid"
        >
          {STEPS.map((step, index) => (
            <ScrollReveal key={step.label} delay={index * 100}>
              <div style={{ position: 'relative', padding: '0 24px 0 0' }}>

                {/* CONNECTOR LINE */}
                {index < STEPS.length - 1 && (
                  <div
                    className="connector"
                    style={{
                      position:   'absolute',
                      top:        '22px',
                      right:      '0',
                      width:      '100%',
                      height:     '1px',
                      background: 'var(--border-default)',
                      zIndex:     0,
                    }}
                  />
                )}

                {/* STEP CIRCLE */}
                <div
                  style={{
                    width:          '44px',
                    height:         '44px',
                    borderRadius:   '50%',
                    background:     step.color,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    marginBottom:   '20px',
                    position:       'relative',
                    zIndex:         1,
                    boxShadow:      'var(--shadow-sm)',
                  }}
                >
                  {step.svg}
                </div>

                <h3
                  style={{
                    fontFamily:   'var(--font-display)',
                    fontSize:     'var(--text-lg)',
                    fontWeight:   700,
                    color:        'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {step.label}
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
          .workflow-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
          .connector { display: none !important; }
        }
        @media (max-width: 480px) {
          .workflow-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}