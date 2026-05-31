// ============================================================
// PRISM — DEVELOPER LANDING PAGE
// Route: /developers
// Audience: Developers and technical users.
// "Know your security score before your users find out."
// ============================================================

import type { Metadata } from 'next'
import HeroDeveloper   from '@/components/sections/HeroDeveloper'
import TrustBar        from '@/components/sections/TrustBar'
import WorkflowSteps   from '@/components/sections/WorkflowSteps'
import WhatWeCheck     from '@/components/sections/WhatWeCheck'
import ScoreBreakdown  from '@/components/sections/ScoreBreakdown'
import ReviewStrip     from '@/components/reviews/ReviewStrip'
import FunnelSection   from '@/components/sections/FunnelSection'
import CTABanner       from '@/components/sections/CTABanner'

// ------------------------------------------------------------
// PAGE METADATA
// ------------------------------------------------------------

export const metadata: Metadata = {
  title:       'Prism for Developers — Security Scanner',
  description: 'Automated security scanning for developers. SSL, headers, DNS, reputation, cookies and tech stack — scored and explained. Free, instant, no signup.',
  openGraph: {
    title:       'Prism for Developers — Know your security score.',
    description: 'Automated security scanning for developers. Get a score, find the gaps, fix them fast.',
    url:         'https://prism.siu.com/developers',
  },
}

// ------------------------------------------------------------
// PAGE
// ------------------------------------------------------------

export default function DeveloperPage() {
  return (
    <>
      {/* 1. HERO — split layout, headline + scan input card */}
      <HeroDeveloper />

      {/* 2. TRUST BAR — social proof stats */}
      <TrustBar />

      {/* 3. WORKFLOW — Build → Scan → Fix → Ship */}
      <WorkflowSteps />

      {/* 4. WHAT WE CHECK — all 6 categories */}
      <WhatWeCheck variant="developer" />

      {/* 5. SCORE BREAKDOWN — category bars demo */}
      <ScoreBreakdown />

      {/* 6. REVIEWS — scrolling strip */}
      <ReviewStrip />

      {/* 7. FUNNEL — pen test CTA dark section */}
      <FunnelSection />

      {/* 8. BOTTOM CTA — scan input repeat */}
      <CTABanner />
    </>
  )
}