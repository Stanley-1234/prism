// ============================================================
// PRISM — UTILITY FUNCTIONS
// Pure helper functions used across the app.
// No side effects. No imports from other PRISM files
// except types and constants.
// ============================================================

import { GRADE_THRESHOLDS, VERDICT_THRESHOLDS, CTA_CONFIG } from './constants'
import type { Grade, Verdict, Severity, CTAConfig } from './types'

// ------------------------------------------------------------
// SCORE → GRADE
// ------------------------------------------------------------

export function getGrade(score: number): Grade {
  const clamped = Math.max(0, Math.min(100, score))
  const threshold = GRADE_THRESHOLDS.find(
    (t) => clamped >= t.min && clamped <= t.max
  )
  return threshold?.grade ?? 'F'
}

// ------------------------------------------------------------
// SCORE → VERDICT
// ------------------------------------------------------------

export function getVerdict(score: number): Verdict {
  const clamped = Math.max(0, Math.min(100, score))
  const threshold = VERDICT_THRESHOLDS.find((t) => clamped >= t.min)
  return threshold?.verdict ?? 'Critical Risk'
}

// ------------------------------------------------------------
// SCORE → CTA CONFIG
// Returns the right CTA block based on score range
// ------------------------------------------------------------

export function getCTAConfig(score: number): CTAConfig {
  if (score < 50)  return { ...CTA_CONFIG[0], subtext: CTA_CONFIG[0].subtext.replace('{score}', String(score)) }
  if (score < 70)  return { ...CTA_CONFIG[1], subtext: CTA_CONFIG[1].subtext.replace('{score}', String(score)) }
  if (score < 85)  return { ...CTA_CONFIG[2], subtext: CTA_CONFIG[2].subtext.replace('{score}', String(score)) }
  return { ...CTA_CONFIG[3], subtext: CTA_CONFIG[3].subtext.replace('{score}', String(score)) }
}

// ------------------------------------------------------------
// SCORE → COLOR CLASS
// Returns a Tailwind/CSS class string for coloring
// ------------------------------------------------------------

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-prism-green'
  if (score >= 70) return 'text-prism-amber'
  if (score >= 50) return 'text-orange-500'
  return 'text-prism-red'
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-prism-green'
  if (score >= 70) return 'bg-prism-amber'
  if (score >= 50) return 'bg-orange-500'
  return 'bg-prism-red'
}

export function getScoreRingColor(score: number): string {
  if (score >= 85) return '#2D9E5F'
  if (score >= 70) return '#F4A261'
  if (score >= 50) return '#f97316'
  return '#E63946'
}

// ------------------------------------------------------------
// SEVERITY → STYLES
// ------------------------------------------------------------

export function getSeverityStyles(severity: Severity): {
  text: string
  bg: string
  border: string
  label: string
  icon: string
} {
  switch (severity) {
    case 'pass':
      return {
        text:   'text-prism-green',
        bg:     'bg-prism-green-light',
        border: 'border-prism-green/20',
        label:  'Pass',
        icon:   '✓',
      }
    case 'warning':
      return {
        text:   'text-amber-700',
        bg:     'bg-prism-amber-light',
        border: 'border-prism-amber/25',
        label:  'Warning',
        icon:   '⚠',
      }
    case 'critical':
      return {
        text:   'text-red-700',
        bg:     'bg-prism-red-light',
        border: 'border-prism-red/20',
        label:  'Critical',
        icon:   '✕',
      }
  }
}

// ------------------------------------------------------------
// URL VALIDATION
// ------------------------------------------------------------

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)

    // Must be http or https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }

    const hostname = parsed.hostname

    // Must have at least one dot (a TLD) — rejects "localhost", "test", etc
    if (!hostname.includes('.')) {
      return false
    }

    // Must not end or start with a dot or hyphen
    if (
      hostname.startsWith('.') ||
      hostname.endsWith('.') ||
      hostname.startsWith('-') ||
      hostname.endsWith('-')
    ) {
      return false
    }

    // Each label between dots must be valid (letters, numbers, hyphens)
    const labels = hostname.split('.')
    const labelPattern = /^[a-zA-Z0-9-]+$/

    for (const label of labels) {
      if (!label || !labelPattern.test(label)) {
        return false
      }
    }

    // TLD (last label) must be at least 2 letters, no numbers
    const tld = labels[labels.length - 1]
    if (!/^[a-zA-Z]{2,}$/.test(tld)) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// ------------------------------------------------------------
// DATE FORMATTING
// ------------------------------------------------------------

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

export function formatTimeAgo(iso: string): string {
  const now  = Date.now()
  const then = new Date(iso).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60)   return 'Scanned just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ------------------------------------------------------------
// NUMBER FORMATTING
// ------------------------------------------------------------

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ------------------------------------------------------------
// SCORE RING — SVG DASH CALCULATION
// Used by ScoreRing component
// ------------------------------------------------------------

export function getStrokeDashOffset(score: number, radius: number): number {
  const circumference = 2 * Math.PI * radius
  const clamped = clamp(score, 0, 100)
  return circumference - (clamped / 100) * circumference
}

export function getCircumference(radius: number): number {
  return 2 * Math.PI * radius
}

// ------------------------------------------------------------
// REVIEW HELPERS
// ------------------------------------------------------------

export function formatRating(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export function getReviewLabel(rating: number): string {
  switch (rating) {
    case 5: return 'Excellent'
    case 4: return 'Good'
    case 3: return 'Average'
    case 2: return 'Poor'
    case 1: return 'Terrible'
    default: return ''
  }
}

// ------------------------------------------------------------
// CLASS NAME MERGER
// Simple cn() utility — merges class strings
// (Replaces clsx/cn without adding a dependency)
// ------------------------------------------------------------

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}