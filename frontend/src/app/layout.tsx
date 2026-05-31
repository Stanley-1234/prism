// ============================================================
// PRISM — ROOT LAYOUT
// Wraps every page. Sets fonts, metadata, and favicon.
// ============================================================

import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default:  'Prism — See through every site.',
    template: '%s | Prism',
  },
  description:
    'Paste any URL and find out instantly if it\'s safe to share your personal information. Free, instant, no signup required.',
  keywords: [
    'website security checker',
    'is this site safe',
    'SSL checker',
    'security scanner',
    'phishing checker',
    'website trust score',
  ],
  authors:  [{ name: 'SIU' }],
  creator:  'SIU',
  metadataBase: new URL('https://prism.siu.com'),
  openGraph: {
    type:        'website',
    locale:      'en_GB',
    url:         'https://prism.siu.com',
    title:       'Prism — See through every site.',
    description: 'Free instant security scanner. Know if a site is safe before you trust it with your data.',
    siteName:    'Prism by SIU',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Prism — See through every site.',
    description: 'Free instant security scanner. Know if a site is safe before you trust it with your data.',
    creator:     '@SIU',
  },
  icons: {
    icon:   '/favicon.svg',
    apple:  '/PRISM_FAVICON.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Nav />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}