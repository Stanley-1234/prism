import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{
      background: 'var(--bg-page)',
      padding: 'var(--section-padding-y) var(--section-padding-x)',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '48px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Prism
        </Link>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '12px',
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 800, letterSpacing: '-0.02em',
          color: 'var(--text-primary)', marginBottom: '8px',
        }}>
          Terms of Use
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)', marginBottom: '56px',
        }}>
          Last updated: May 2026
        </p>

        {[
          {
            title: 'What Prism is',
            body: `Prism is a free automated security scanning tool operated by SIU Security. It performs passive checks on publicly accessible websites and returns a security score based on observable characteristics.

Prism is an informational tool. It does not constitute a professional security audit or penetration test.`,
          },
          {
            title: 'Acceptable use',
            body: `You may only scan websites that you own or have explicit written permission to test. Scanning websites without authorisation may be illegal under applicable law.

You may not use Prism to harass, defame, or interfere with any person or organisation. You may not attempt to reverse-engineer, overload, or abuse the Prism service.`,
          },
          {
            title: 'Accuracy of results',
            body: `Prism performs automated checks only. Results are indicative, not exhaustive. A high score does not guarantee a site is secure. A low score does not guarantee a site is malicious.

SIU Security accepts no liability for decisions made based on Prism scan results. For authoritative security assessments, book a professional penetration test with our team.`,
          },
          {
            title: 'Intellectual property',
            body: `All content, design, and code within Prism is the property of SIU Security. You may not copy, reproduce, or distribute any part of the Prism service without written permission.`,
          },
          {
            title: 'Limitation of liability',
            body: `Prism is provided "as is" without warranties of any kind. SIU Security is not liable for any loss or damage arising from your use of the service, including but not limited to reliance on scan results.`,
          },
          {
            title: 'Changes to these terms',
            body: `We may update these terms at any time. Continued use of Prism after changes constitutes acceptance of the updated terms.`,
          },
          {
            title: 'Contact',
            body: `For questions about these terms, contact SIU Security at siutech.info@gmail.com or +234 707 240 3048.`,
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px',
            }}>
              {section.title}
            </h2>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)',
              whiteSpace: 'pre-line',
            }}>
              {section.body}
            </div>
            <div style={{ height: '1px', background: 'var(--border-default)', marginTop: '40px' }}/>
          </div>
        ))}
      </div>
    </div>
  )
}