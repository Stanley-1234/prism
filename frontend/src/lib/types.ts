// ============================================================
// PRISM — TYPE DEFINITIONS
// The contract between frontend and backend.
// Every piece of data in the app is described here.
// Never change a type without updating both sides.
// ============================================================

// ------------------------------------------------------------
// PRIMITIVES
// ------------------------------------------------------------

export type Severity = 'pass' | 'warning' | 'critical'

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'

export type Verdict =
  | 'Excellent'
  | 'Good'
  | 'Moderate Risk'
  | 'High Risk'
  | 'Critical Risk'

export type ScanStatus = 'idle' | 'loading' | 'success' | 'error'

export type CategoryKey =
  | 'ssl'
  | 'headers'
  | 'cookies'
  | 'dns'
  | 'reputation'
  | 'stack'

// ------------------------------------------------------------
// SCAN — FINDINGS & CATEGORIES
// ------------------------------------------------------------

export interface Finding {
  severity: Severity
  message: string       // Plain English — shown to all users
  technical: string     // Raw detail — shown in expanded/developer view
  recommendation?: string // What to do about it (AI-generated or static)
}

export interface Category {
  key: CategoryKey
  label: string         // Display name e.g. "SSL Certificate"
  icon: string          // Emoji icon e.g. "🔒"
  score: number         // 0–100
  status: Severity      // Overall status for this category
  findings: Finding[]
  description: string   // One-line plain English summary of this category
}

// ------------------------------------------------------------
// SCAN — FULL RESULT
// ------------------------------------------------------------

export interface ScanResult {
  id: string                        // Unique scan ID (UUID)
  url: string                       // The URL that was scanned
  domain: string                    // Cleaned domain e.g. "example.com"
  scanned_at: string                // ISO timestamp
  overall_score: number             // 0–100
  grade: Grade                      // Letter grade
  verdict: Verdict                  // Plain English verdict
  ai_summary: string                // AI-generated plain English explanation
  categories: {
    ssl:        Category
    headers:    Category
    cookies:    Category
    dns:        Category
    reputation: Category
    stack:      Category
  }
}

// ------------------------------------------------------------
// SCAN — STATE MACHINE
// Managed by useScan.ts hook
// ------------------------------------------------------------

export interface ScanState {
  status: ScanStatus
  result: ScanResult | null
  error: string | null
  url: string
}

// ------------------------------------------------------------
// SCAN — API REQUEST & RESPONSE
// ------------------------------------------------------------

export interface ScanRequest {
  url: string
}

export interface ScanResponse {
  success: boolean
  data?: ScanResult
  error?: string
}

// ------------------------------------------------------------
// REVIEWS
// ------------------------------------------------------------

export interface Review {
  id: string
  rating: number              // 1–5 stars
  comment: string             // The review text
  reviewer_name: string       // Name or "Anonymous"
  domain_scanned?: string     // Optional — the domain they scanned
  show_domain: boolean        // Whether they chose to show the domain
  created_at: string          // ISO timestamp
  is_approved: boolean        // AI moderation result
}

export interface ReviewFormData {
  rating: number
  comment: string
  reviewer_name: string
  domain_scanned?: string
  show_domain: boolean
}

export interface ReviewRequest {
  rating: number
  comment: string
  reviewer_name: string
  domain_scanned?: string
  show_domain: boolean
}

export interface ReviewResponse {
  success: boolean
  data?: Review
  error?: string
}

export interface ReviewsListResponse {
  success: boolean
  data?: Review[]
  total?: number
  error?: string
}

// ------------------------------------------------------------
// POST-SCAN CTA
// Changes based on score range
// ------------------------------------------------------------

export interface CTAConfig {
  emoji: string
  headline: string
  subtext: string
  buttonText: string
  buttonHref: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

// ------------------------------------------------------------
// NAV
// ------------------------------------------------------------

export interface NavLink {
  label: string
  href: string
  isExternal?: boolean
  variant?: 'default' | 'arrow'
}

// ------------------------------------------------------------
// DUMMY SCAN DATA SHAPE
// Used for static demo before backend is connected
// ------------------------------------------------------------

export interface DummyScanData {
  score: number
  grade: Grade
  verdict: Verdict
  domain: string
  categories: Category[]
}