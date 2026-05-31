// ============================================================
// PRISM — CONSUMER LANDING PAGE
// Route: /
// Audience: Regular users — "Is this site safe?"
// Assembles all section components in order.
// ============================================================

import type { Metadata } from 'next'
import HeroConsumer   from '@/components/sections/HeroConsumer'
import TrustBar       from '@/components/sections/TrustBar'
import HowItWorks     from '@/components/sections/HowItWorks'
import WhatWeCheck    from '@/components/sections/WhatWeCheck'
import ResultPreview  from '@/components/sections/ResultPreview'
import ReviewStrip    from '@/components/reviews/ReviewStrip'
import FunnelSection  from '@/components/sections/FunnelSection'
import CTABanner      from '@/components/sections/CTABanner'

// ------------------------------------------------------------
// PAGE METADATA
// ------------------------------------------------------------

export const metadata: Metadata = {
  title:       'Prism — See through every site.',
  description: 'Paste any URL and find out instantly if it\'s safe to share your personal information, password, or card details. Free, instant, no signup required.',
  openGraph: {
    title:       'Prism — See through every site.',
    description: 'Free instant website security scanner. Know if a site is safe before you trust it with your data.',
    url:         'https://prism.siu.com',
  },
}

// ------------------------------------------------------------
// PAGE
// ------------------------------------------------------------

export default function ConsumerPage() {
  return (
    <>
      {/* 1. HERO — headline + scan input */}
      <HeroConsumer />

      {/* 2. TRUST BAR — social proof stats */}
      <TrustBar />

      {/* 3. HOW IT WORKS — 3-step explainer */}
      <HowItWorks />

      {/* 4. WHAT WE CHECK — 3 feature cards */}
      <WhatWeCheck variant="consumer" />

      {/* 5. RESULT PREVIEW — static mockup */}
      <ResultPreview />

      {/* 6. REVIEWS — scrolling strip */}
      <ReviewStrip />

      {/* 7. FUNNEL — pen test CTA */}
      <FunnelSection />

      {/* 8. BOTTOM CTA — scan input repeat */}
      <CTABanner />
    </>
  )
}