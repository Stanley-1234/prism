import Link from 'next/link'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)', marginBottom: '56px',
        }}>
          Last updated: May 2026
        </p>

        {[
          {
            title: 'What Prism collects',
            body: `When you use Prism to scan a website, we record the URL you submitted, the scan result, and a timestamp. We do not collect your name, email address, or any identifying information unless you voluntarily submit it through our contact form.

If you leave a review, we store your rating, comment, display name (optional), and whether you chose to show the scanned domain.

If you submit a booking enquiry, we store the information you provided: name, email, phone, company, and your message.`,
          },
          {
            title: 'How we use your data',
            body: `Scan results are stored to improve our scoring engine and detect patterns across scanned domains. We do not sell this data, share it with third parties, or use it for advertising.

Contact form submissions are used solely to respond to your enquiry. Booking information is used to arrange and deliver the service you requested.

Review data is displayed publicly on the Prism website if approved.`,
          },
          {
            title: 'Cookies',
            body: `Prism does not use tracking cookies or third-party analytics. We do not use Google Analytics, Facebook Pixel, or any behavioural tracking tools. The site may set a session cookie for functional purposes only.`,
          },
          {
            title: 'Data retention',
            body: `Scan records are retained for up to 12 months. Booking enquiries are retained for up to 24 months for our records. You may request deletion of your data at any time by emailing siutech.info@gmail.com.`,
          },
          {
            title: 'Your rights',
            body: `You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us at siutech.info@gmail.com. We will respond within 5 business days.`,
          },
          {
            title: 'Contact',
            body: `For any privacy-related questions, contact SIU Security at siutech.info@gmail.com or call +234 707 240 3048.`,
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