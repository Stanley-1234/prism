// ============================================================
// PRISM — CONSTANTS
// Fixed values, copy strings, and configuration.
// All copy comes from the brief's copy bank.
// ============================================================

import type { Grade, Verdict, CTAConfig, CategoryKey } from './types'

// ------------------------------------------------------------
// SCORING — GRADE THRESHOLDS
// ------------------------------------------------------------

export const GRADE_THRESHOLDS: { min: number; max: number; grade: Grade }[] = [
  { min: 97, max: 100, grade: 'A+' },
  { min: 93, max: 96,  grade: 'A'  },
  { min: 90, max: 92,  grade: 'A-' },
  { min: 87, max: 89,  grade: 'B+' },
  { min: 83, max: 86,  grade: 'B'  },
  { min: 80, max: 82,  grade: 'B-' },
  { min: 77, max: 79,  grade: 'C+' },
  { min: 73, max: 76,  grade: 'C'  },
  { min: 70, max: 72,  grade: 'C-' },
  { min: 60, max: 69,  grade: 'D'  },
  { min: 0,  max: 59,  grade: 'F'  },
]

// ------------------------------------------------------------
// SCORING — VERDICT THRESHOLDS
// ------------------------------------------------------------

export const VERDICT_THRESHOLDS: { min: number; verdict: Verdict }[] = [
  { min: 90, verdict: 'Excellent'     },
  { min: 75, verdict: 'Good'          },
  { min: 60, verdict: 'Moderate Risk' },
  { min: 40, verdict: 'High Risk'     },
  { min: 0,  verdict: 'Critical Risk' },
]

// ------------------------------------------------------------
// SCORING — CATEGORY WEIGHTS
// Must add up to 100
// ------------------------------------------------------------

export const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  ssl:        25,   // Highest — fundamental trust signal
  headers:    20,   // Very impactful — easy wins for attackers
  reputation: 20,   // Critical — known bad = instant fail
  dns:        15,   // Important — spoofing and email fraud
  cookies:    10,   // Meaningful — session hijacking risk
  stack:      10,   // Informational — exposure risk
}

// ------------------------------------------------------------
// CATEGORY METADATA
// ------------------------------------------------------------

export const CATEGORY_META: Record<CategoryKey, { label: string; icon: string; description: string }> = {
  ssl: {
    label: 'SSL Certificate',
    icon: '🔒',
    description: 'Verifies the site has a valid, trusted certificate securing your connection.',
  },
  headers: {
    label: 'Security Headers',
    icon: '🛡️',
    description: 'Checks whether the site sends the right HTTP headers to protect your browser.',
  },
  cookies: {
    label: 'Cookie Security',
    icon: '🍪',
    description: 'Checks whether session cookies are set with secure, HttpOnly, and SameSite flags.',
  },
  dns: {
    label: 'DNS & Email Security',
    icon: '🌐',
    description: 'Checks SPF, DMARC, and DNSSEC records to prevent spoofing and phishing.',
  },
  reputation: {
    label: 'Reputation & Blacklists',
    icon: '🔍',
    description: 'Cross-references the domain against 85+ threat intelligence databases.',
  },
  stack: {
    label: 'Tech Stack Exposure',
    icon: '⚙️',
    description: 'Detects exposed software versions and matches them against known CVEs.',
  },
}

// ------------------------------------------------------------
// POST-SCAN CTA CONFIG
// Copy from brief Section 14
// ------------------------------------------------------------

export const CTA_CONFIG: CTAConfig[] = [
  {
    emoji: '🔴',
    headline: 'Critical vulnerabilities detected.',
    subtext: 'Score: {score}/100. This site has critical vulnerabilities. If this is your app — you need a full pen test immediately.',
    buttonText: 'Book a Pen Test with SIU →',
    buttonHref: '/contact',
    urgency: 'critical',
  },
  {
    emoji: '🟡',
    headline: 'Several issues need attention.',
    subtext: 'Score: {score}/100. Our full pen test will find everything Prism missed.',
    buttonText: 'Book a Full Pen Test →',
    buttonHref: '/contact',
    urgency: 'high',
  },
  {
    emoji: '🟢',
    headline: 'Decent baseline — but there\'s more.',
    subtext: 'Score: {score}/100. Automated scans only scratch the surface. Get the complete picture.',
    buttonText: 'Get a Complete Audit →',
    buttonHref: '/contact',
    urgency: 'medium',
  },
  {
    emoji: '✅',
    headline: 'Strong security hygiene.',
    subtext: 'Score: {score}/100. For a complete audit including authenticated testing and business logic — book with SIU.',
    buttonText: 'Book a Full Audit with SIU →',
    buttonHref: '/contact',
    urgency: 'low',
  },
]

// ------------------------------------------------------------
// COPY BANK — CONSUMER PAGE
// From brief Section 14
// ------------------------------------------------------------

export const CONSUMER_COPY = {
  hero: {
    eyebrow:     'Free · Instant · No signup required',
    h1:          'Before you trust a site with your data — check it.',
    sub:         'Paste any URL and find out instantly if it\'s safe to share your personal information, password, or card details.',
    placeholder: 'https://the-site-youre-unsure-about.com',
    cta:         'Check Now',
    note:        'No signup. No credit card. Free, every time.',
  },
  howItWorks: {
    label:   'How it works',
    heading: 'Three steps between you and a scam',
  },
  whatWeCheck: {
    label:   'What Prism looks for',
    heading: 'The things you\'d never think to check',
    sub:     'Most people just look for the padlock. Prism goes much deeper — in seconds.',
  },
  cta: {
    heading: 'Don\'t guess. Know.',
    sub:     'The next time someone asks for your email, password, or card number — check them first.',
  },
} as const

// ------------------------------------------------------------
// COPY BANK — DEVELOPER PAGE
// From brief Section 14
// ------------------------------------------------------------

export const DEVELOPER_COPY = {
  hero: {
    eyebrow:        'Security Scanner for Developers',
    h1:             'Know your security score before your users find out the hard way.',
    sub:            'Prism runs automated checks across SSL, headers, DNS, reputation, and your tech stack — then gives you a score and tells you how to fix it.',
    placeholder:    'https://your-app.com',
    primaryCTA:     'Scan My App',
    secondaryCTA:   'Book a Full Pen Test →',
  },
  funnel: {
    heading: 'Score under 70? You need more than a scanner.',
    sub:     'Prism finds the obvious gaps. SIU finds everything else.',
    cta:     'Book a Penetration Test with SIU →',
  },
} as const

// ------------------------------------------------------------
// TRUST BAR STATS
// ------------------------------------------------------------

export const TRUST_STATS = [
  { value: '2,400+', label: 'scans run'           },
  { value: '85+',    label: 'threat databases'     },
  { value: '30+',    label: 'countries served'     },
  { value: '6',      label: 'security categories'  },
] as const

// ------------------------------------------------------------
// HOW IT WORKS STEPS — CONSUMER
// ------------------------------------------------------------

export const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title:  'Paste a URL',
    body:   'Any website you\'re about to trust with your email, password, or payment details.',
    icon:   'link',
  },
  {
    number: '02',
    title:  'We scan it',
    body:   'Prism checks SSL certificates, blacklists, security headers, domain age, and more — automatically.',
    icon:   'search',
  },
  {
    number: '03',
    title:  'See if it\'s safe',
    body:   'Get a plain-English trust score and verdict in seconds. No jargon. No login. Just the answer.',
    icon:   'shield-check',
  },
] as const

// ------------------------------------------------------------
// LOADING STATE STEPS
// ------------------------------------------------------------

export const LOADING_STEPS = [
  'Checking SSL certificate',
  'Scanning security headers',
  'Checking reputation databases',
  'Analysing DNS records',
  'Detecting tech stack',
  'Calculating your score',
] as const

// ------------------------------------------------------------
// DUMMY SCAN RESULT
// Hardcoded realistic sample for demo mode
// Domain: example-store.com, Score: 74, Grade: C+
// ------------------------------------------------------------

export const DUMMY_SCAN_RESULT = {
  id:            'demo-scan-001',
  url:           'https://example-store.com',
  domain:        'example-store.com',
  scanned_at:    new Date().toISOString(),
  overall_score: 74,
  grade:         'C+' as Grade,
  verdict:       'Moderate Risk' as Verdict,
  ai_summary:    'This site has a mixed security profile. It passes some checks but has gaps that could put your data at risk. The most urgent issue is: no Content Security Policy found. There are 2 warnings including: session cookie missing HttpOnly flag. SSL Certificate, Reputation, and DNS both look good. For a full security audit including authenticated testing, consider booking a penetration test with SIU.',
  categories: {
    ssl: {
      key:         'ssl' as CategoryKey,
      label:       'SSL Certificate',
      icon:        '🔒',
      score:       90,
      status:      'pass' as const,
      description: 'Valid certificate from a trusted authority.',
      findings: [
        {
          severity:       'pass' as const,
          message:        'Valid SSL certificate installed',
          technical:      'Certificate issued by Let\'s Encrypt. Expires in 89 days.',
          recommendation: 'Set up auto-renewal to avoid expiry.',
        },
        {
          severity:       'warning' as const,
          message:        'Certificate expires in less than 90 days',
          technical:      'Valid until: ' + new Date(Date.now() + 89 * 86400000).toDateString(),
          recommendation: 'Enable auto-renewal via your hosting provider or certbot.',
        },
      ],
    },
    headers: {
      key:         'headers' as CategoryKey,
      label:       'Security Headers',
      icon:        '🛡️',
      score:       40,
      status:      'critical' as const,
      description: 'Several critical security headers are missing.',
      findings: [
        {
          severity:       'critical' as const,
          message:        'No Content Security Policy found',
          technical:      'Missing Content-Security-Policy header — exposes users to XSS attacks.',
          recommendation: 'Add a CSP header in your server config or next.config.ts headers().',
        },
        {
          severity:       'critical' as const,
          message:        'HSTS not configured',
          technical:      'Strict-Transport-Security header absent — allows downgrade attacks.',
          recommendation: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains',
        },
        {
          severity:       'warning' as const,
          message:        'X-Frame-Options not set',
          technical:      'Missing X-Frame-Options header — site could be embedded in iframes.',
          recommendation: 'Add: X-Frame-Options: DENY',
        },
      ],
    },
    cookies: {
      key:         'cookies' as CategoryKey,
      label:       'Cookie Security',
      icon:        '🍪',
      score:       60,
      status:      'warning' as const,
      description: 'Session cookie is missing important security flags.',
      findings: [
        {
          severity:       'warning' as const,
          message:        'Session cookie missing HttpOnly flag',
          technical:      'Cookie \'session_id\' is readable by JavaScript — risk of session hijacking.',
          recommendation: 'Set HttpOnly flag on all session cookies.',
        },
        {
          severity:       'warning' as const,
          message:        'SameSite attribute not set',
          technical:      'Cookie \'session_id\' missing SameSite=Strict — vulnerable to CSRF.',
          recommendation: 'Add SameSite=Strict or SameSite=Lax to all session cookies.',
        },
      ],
    },
    dns: {
      key:         'dns' as CategoryKey,
      label:       'DNS & Email Security',
      icon:        '🌐',
      score:       80,
      status:      'pass' as const,
      description: 'SPF configured. DMARC policy missing.',
      findings: [
        {
          severity:       'pass' as const,
          message:        'SPF record configured correctly',
          technical:      'v=spf1 include:_spf.google.com ~all',
          recommendation: 'No action needed.',
        },
        {
          severity:       'warning' as const,
          message:        'No DMARC policy found',
          technical:      'Missing _dmarc TXT record — domain can be spoofed in emails.',
          recommendation: 'Add: _dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"',
        },
      ],
    },
    reputation: {
      key:         'reputation' as CategoryKey,
      label:       'Reputation & Blacklists',
      icon:        '🔍',
      score:       95,
      status:      'pass' as const,
      description: 'Clean across all threat intelligence databases.',
      findings: [
        {
          severity:       'pass' as const,
          message:        'Not found on any blacklist',
          technical:      'Clean across 85 threat databases including VirusTotal and Google Safe Browsing.',
          recommendation: 'No action needed.',
        },
      ],
    },
    stack: {
      key:         'stack' as CategoryKey,
      label:       'Tech Stack Exposure',
      icon:        '⚙️',
      score:       65,
      status:      'warning' as const,
      description: 'WordPress version exposed. Update recommended.',
      findings: [
        {
          severity:       'warning' as const,
          message:        'WordPress version exposed in page source',
          technical:      'WordPress 6.4.1 detected via meta generator tag — update to latest version.',
          recommendation: 'Remove the generator meta tag and update to WordPress 6.5+.',
        },
        {
          severity:       'warning' as const,
          message:        'Server software version disclosed',
          technical:      'Server: nginx/1.18.0 — older version with known CVEs.',
          recommendation: 'Update nginx to 1.25+ and suppress version disclosure.',
        },
      ],
    },
  },
}

// ------------------------------------------------------------
// REVIEW FORM — PLACEHOLDER REVIEWS
// Shown in ReviewStrip before real reviews load
// ------------------------------------------------------------

export const PLACEHOLDER_REVIEWS = [
  {
    id:             'r1',
    rating:         5,
    comment:        'Checked a site before entering my card details. Found it had critical security issues. Saved me from a potential scam.',
    reviewer_name:  'Sarah M.',
    domain_scanned: 'checkout-deals.com',
    show_domain:    true,
    created_at:     '2026-05-01T10:00:00Z',
    is_approved:    true,
  },
  {
    id:             'r2',
    rating:         5,
    comment:        'As a developer, this is now part of my pre-launch checklist. Instant, accurate, and the plain-English explanations are brilliant.',
    reviewer_name:  'Kwame A.',
    domain_scanned: undefined,
    show_domain:    false,
    created_at:     '2026-05-03T14:00:00Z',
    is_approved:    true,
  },
  {
    id:             'r3',
    rating:         4,
    comment:        'Really clean tool. Got my results in seconds and immediately knew what to fix. Would love a PDF export.',
    reviewer_name:  'Priya S.',
    domain_scanned: 'myportfolio.dev',
    show_domain:    true,
    created_at:     '2026-05-07T09:00:00Z',
    is_approved:    true,
  },
  {
    id:             'r4',
    rating:         5,
    comment:        'Shared this with my whole team. We run it on every client site before handover now. Absolute must-have.',
    reviewer_name:  'James O.',
    domain_scanned: undefined,
    show_domain:    false,
    created_at:     '2026-05-10T11:00:00Z',
    is_approved:    true,
  },
  {
    id:             'r5',
    rating:         5,
    comment:        'My mum called asking if a site was safe to buy from. Sent her the Prism link. Problem solved.',
    reviewer_name:  'Tunde B.',
    domain_scanned: undefined,
    show_domain:    false,
    created_at:     '2026-05-12T16:00:00Z',
    is_approved:    true,
  },
  {
    id:             'r6',
    rating:         4,
    comment:        'Incredibly useful for quick security checks. The category breakdown is exactly what I needed.',
    reviewer_name:  'Amara K.',
    domain_scanned: 'shopnow-deals.ng',
    show_domain:    true,
    created_at:     '2026-05-15T08:00:00Z',
    is_approved:    true,
  },
] as const