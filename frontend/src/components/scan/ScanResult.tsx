// ============================================================
// PRISM — SCAN RESULT
// Desktop layout preserved. Mobile optimised.
// Download button at bottom of card. Scan again top right.
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import { Lock, RefreshCw, ExternalLink, Download } from 'lucide-react'
import type { ScanResult as ScanResultType } from '@/lib/types'
import ScoreRing      from '@/components/results/ScoreRing'
import GradeBadge     from '@/components/results/GradeBadge'
import CategoryCard   from '@/components/results/CategoryCard'
import ResultCTA      from '@/components/results/ResultCTA'
import { formatTimeAgo } from '@/lib/utils'

interface ScanResultProps {
  result:    ScanResultType
  onRescan?: () => void
}

async function generatePDFReport(result: ScanResultType) {
  let logoBase64 = ''
  try {
    const res  = await fetch('/PRISM_FULL_LOGO.png')
    const blob = await res.blob()
    logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    // continue without logo
  }

  const scoreColor = result.overall_score >= 85
    ? '#2D9E5F'
    : result.overall_score >= 70
    ? '#F4A261'
    : '#E63946'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Prism Security Report — ${result.domain}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    background: #ffffff; color: #1A1A1A;
    padding: 48px 56px; max-width: 860px; margin: 0 auto;
    font-size: 14px; line-height: 1.5;
  }
  .letterhead {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 24px; border-bottom: 2px solid #F0EDE8; margin-bottom: 36px;
  }
  .letterhead-left { display: flex; align-items: center; gap: 16px; }
  .letterhead-logo { height: 40px; width: auto; }
  .letterhead-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; line-height: 1.1; }
  .letterhead-subtitle { font-size: 12px; color: #888; margin-top: 2px; }
  .letterhead-right { text-align: right; font-size: 12px; color: #888; line-height: 1.8; }
  .letterhead-right strong { color: #1A1A1A; font-weight: 600; }
  .score-block {
    display: flex; align-items: center; gap: 28px;
    background: #F9F7F4; border: 1px solid #E8E4DE;
    border-radius: 14px; padding: 28px 32px; margin-bottom: 28px;
  }
  .score-num { font-size: 72px; font-weight: 800; letter-spacing: -0.05em; line-height: 1; color: ${scoreColor}; flex-shrink: 0; }
  .score-denom { font-size: 24px; color: #CCC; font-weight: 400; }
  .grade-pill { display: inline-block; font-size: 16px; font-weight: 800; padding: 5px 14px; border-radius: 6px; background: rgba(244,162,97,0.15); color: #a05c10; margin-bottom: 8px; }
  .verdict-text { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; color: #1A1A1A; margin-bottom: 4px; }
  .verdict-sub { font-size: 13px; color: #888; }
  .summary-box { background: rgba(45,158,95,0.05); border: 1px solid rgba(45,158,95,0.20); border-left: 3px solid #2D9E5F; border-radius: 8px; padding: 16px 20px; margin-bottom: 32px; }
  .summary-label { font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: #2D9E5F; margin-bottom: 8px; }
  .summary-text { font-size: 14px; color: #444; line-height: 1.7; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: #888; margin-bottom: 14px; margin-top: 8px; }
  .category { border: 1px solid #E8E4DE; border-radius: 10px; margin-bottom: 12px; overflow: hidden; page-break-inside: avoid; }
  .cat-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #F9F7F4; border-bottom: 1px solid #E8E4DE; }
  .cat-name { font-size: 14px; font-weight: 700; color: #1A1A1A; }
  .cat-meta { display: flex; align-items: center; gap: 10px; }
  .cat-score-txt { font-size: 13px; font-weight: 600; color: #555; }
  .badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 9px; border-radius: 4px; }
  .badge-pass     { background: rgba(45,158,95,0.10);  color: #1d7a46; }
  .badge-warning  { background: rgba(244,162,97,0.15); color: #b5671a; }
  .badge-critical { background: rgba(230,57,70,0.10);  color: #c0242f; }
  .cat-body { padding: 8px 18px 14px; }
  .finding { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F5F3F0; font-size: 13px; }
  .finding:last-child { border-bottom: none; }
  .finding-icon { font-weight: 800; width: 16px; flex-shrink: 0; margin-top: 1px; }
  .f-pass { color: #2D9E5F; } .f-warning { color: #b5671a; } .f-critical { color: #c0242f; }
  .finding-content { flex: 1; }
  .finding-msg  { color: #222; line-height: 1.5; font-weight: 500; }
  .finding-tech { color: #888; font-size: 11px; font-family: monospace; margin-top: 3px; word-break: break-all; }
  .finding-fix  { color: #1d7a46; font-size: 12px; margin-top: 4px; }
  .doc-footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #E8E4DE; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #AAA; }
  .footer-brand { color: #2D9E5F; font-weight: 700; }
  .footer-contact { text-align: right; line-height: 1.7; }
  @media print { body { padding: 32px 40px; } .category { page-break-inside: avoid; } }
</style>
</head>
<body>
  <div class="letterhead">
    <div class="letterhead-left">
      ${logoBase64
        ? `<img src="${logoBase64}" alt="Prism" class="letterhead-logo" />`
        : `<div style="font-size:20px;font-weight:800;color:#1A1A1A;">PRISM</div>`
      }
      <div>
        <div class="letterhead-title">Security Report</div>
        <div class="letterhead-subtitle">by SIU Security · Automated Scan</div>
      </div>
    </div>
    <div class="letterhead-right">
      <div><strong>${result.domain}</strong></div>
      <div>${result.url}</div>
      <div>Scanned: ${new Date(result.scanned_at).toLocaleString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })}</div>
    </div>
  </div>
  <div class="score-block">
    <div class="score-num">${result.overall_score}<span class="score-denom">/100</span></div>
    <div>
      <div class="grade-pill">${result.grade}</div>
      <div class="verdict-text">${result.verdict}</div>
      <div class="verdict-sub">${result.overall_score}/100 overall security score</div>
    </div>
  </div>
  ${result.ai_summary ? `
  <div class="summary-box">
    <div class="summary-label">Plain English Summary</div>
    <div class="summary-text">${result.ai_summary}</div>
  </div>` : ''}
  <div class="section-label">Category Breakdown</div>
  ${Object.values(result.categories).map((cat) => `
  <div class="category">
    <div class="cat-header">
      <div class="cat-name">${cat.label}</div>
      <div class="cat-meta">
        <span class="cat-score-txt">${cat.score}/100</span>
        <span class="badge badge-${cat.status}">${cat.status === 'pass' ? 'Pass' : cat.status === 'warning' ? 'Warning' : 'Critical'}</span>
      </div>
    </div>
    <div class="cat-body">
      ${cat.findings.map((f) => `
      <div class="finding">
        <span class="finding-icon f-${f.severity}">${f.severity === 'pass' ? '✓' : f.severity === 'warning' ? '!' : '✕'}</span>
        <div class="finding-content">
          <div class="finding-msg">${f.message}</div>
          ${f.technical ? `<div class="finding-tech">${f.technical}</div>` : ''}
          ${f.recommendation ? `<div class="finding-fix">Fix: ${f.recommendation}</div>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>`).join('')}
  <div class="doc-footer">
    <div>Generated by <span class="footer-brand">Prism</span> — prismapp.space<br/>This report is based on automated checks only. For a full audit, book a penetration test with SIU Security.</div>
    <div class="footer-contact"><strong style="color:#1A1A1A;">SIU Security</strong><br/>siutech.info@gmail.com<br/>+234 707 240 3048</div>
  </div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `prism-report-${result.domain}-${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ScanResult({ result, onRescan }: ScanResultProps) {
  const [showReview,  setShowReview]  = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowReview(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleDownload = async () => {
    setDownloading(true)
    await generatePDFReport(result)
    setDownloading(false)
  }

  const categories = Object.values(result.categories)
  const defaultOpenIndex = categories.findIndex(
    (c) => c.status === 'critical' || c.status === 'warning'
  )

  return (
    <div
      style={{
        width:     '100%',
        maxWidth:  '720px',
        margin:    '0 auto',
        animation: 'slideUp 0.45s cubic-bezier(0.34,1.10,0.64,1) forwards',
      }}
    >
      {/* MAIN CARD */}
      <div
        style={{
          background:   'var(--bg-card)',
          border:       '1px solid var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          overflow:     'hidden',
          boxShadow:    'var(--shadow-xl)',
        }}
      >
        {/* TOP — SCORE BLOCK */}
        <div
          style={{
            padding:      'clamp(20px, 4vw, 32px)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {/* DOMAIN + TIMESTAMP + SCAN AGAIN */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              marginBottom:   '20px',
              gap:            '8px',
              flexWrap:       'wrap',
            }}
          >
            <div
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '6px',
                fontFamily: 'var(--font-mono)',
                fontSize:   'clamp(11px, 2.5vw, 13px)',
                color:      'var(--text-muted)',
                minWidth:   0,
                overflow:   'hidden',
              }}
            >
              <Lock size={12} style={{ color: 'var(--prism-green)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {result.domain}
              </span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <ExternalLink size={11} />
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'var(--text-xs)',
                  color:      'var(--text-muted)',
                }}
              >
                {formatTimeAgo(result.scanned_at)}
              </span>

              {/* SCAN AGAIN — top right, desktop style */}
              {/* RESCAN BUTTON */}
            {onRescan && (
              <button
                onClick={onRescan}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '6px',
                  fontFamily:   'var(--font-body)',
                  fontSize:     'var(--text-sm)',
                  fontWeight:   'var(--weight-medium)',
                  color:        'var(--text-secondary)',
                  background:   'var(--bg-subtle)',
                  border:       '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding:      '8px 14px',
                  cursor:       'pointer',
                  transition:   'all var(--transition-fast)',
                  alignSelf:    'flex-start',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = 'var(--bg-hover)'
                  e.currentTarget.style.borderColor  = 'var(--border-strong)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background   = 'var(--bg-subtle)'
                  e.currentTarget.style.borderColor  = 'var(--border-default)'
                }}
              >
                <RefreshCw size={13} />
                Scan again
              </button>
            )}

            </div>
          </div>

          {/* SCORE ROW */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        'clamp(16px, 3vw, 32px)',
            }}
          >
            {/* RING — large on desktop, smaller on mobile via clamp */}
            <div style={{ flexShrink: 0 }}>
              <ScoreRing
                score={result.overall_score}
                size={typeof window !== 'undefined' && window.innerWidth < 480 ? 80 : 120}
                stroke={typeof window !== 'undefined' && window.innerWidth < 480 ? 6 : 8}
              />
            </div>

            {/* GRADE + VERDICT */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <GradeBadge grade={result.grade} size="md" />
              <h2
                style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      'clamp(20px, 4vw, 32px)',
                  fontWeight:    800,
                  color:         'var(--text-primary)',
                  marginTop:     '8px',
                  marginBottom:  '4px',
                  letterSpacing: 'var(--tracking-tight)',
                  lineHeight:    1.1,
                }}
              >
                {result.verdict}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(12px, 2.5vw, 14px)',
                  color:      'var(--text-muted)',
                }}
              >
                {result.overall_score}/100 overall security score
              </p>
            </div>
          </div>
        </div>

        {/* AI SUMMARY */}
        {result.ai_summary && (
          <div
            style={{
              padding:      'clamp(14px, 3vw, 20px) clamp(16px, 4vw, 32px)',
              borderBottom: '1px solid var(--border-default)',
              background:   'rgba(45,158,95,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width:          '30px',
                  height:         '30px',
                  borderRadius:   'var(--radius-md)',
                  background:     'var(--prism-green-light)',
                  border:         '1px solid var(--prism-green-border)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--prism-green)" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontFamily:    'var(--font-body)',
                    fontSize:      'var(--text-xs)',
                    fontWeight:    'var(--weight-semibold)',
                    letterSpacing: 'var(--tracking-widest)',
                    textTransform: 'uppercase',
                    color:         'var(--prism-green)',
                    marginBottom:  '5px',
                  }}
                >
                  AI Summary
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'clamp(12px, 2.5vw, 14px)',
                    color:      'var(--text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {result.ai_summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY CARDS */}
        <div
          style={{
            padding:       'clamp(14px, 3vw, 24px) clamp(12px, 3vw, 24px) 8px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '6px',
          }}
        >
          <p
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      'var(--text-xs)',
              fontWeight:    'var(--weight-semibold)',
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color:         'var(--text-muted)',
              marginBottom:  '6px',
            }}
          >
            Category Breakdown
          </p>
          {categories.map((category, index) => (
            <CategoryCard
              key={category.key}
              category={category}
              defaultOpen={index === defaultOpenIndex}
              animDelay={index * 60}
            />
          ))}
        </div>

        {/* RESULT CTA */}
        <div style={{ padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 24px) 0' }}>
          <ResultCTA result={result} />
        </div>

        {/* DOWNLOAD REPORT — bottom of card */}
        <div
          style={{
            padding:     'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px) clamp(16px, 3vw, 24px)',
            borderTop:   '1px solid var(--border-default)',
            marginTop:   '12px',
          }}
        >
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '6px',
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-sm)',
              fontWeight:   'var(--weight-medium)',
              color:        downloading ? 'var(--text-muted)' : 'var(--text-secondary)',
              background:   'var(--bg-subtle)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding:      '9px 16px',
              cursor:       downloading ? 'not-allowed' : 'pointer',
              transition:   'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.background  = 'var(--bg-hover)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'var(--bg-subtle)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
          >
            {downloading ? (
              <>
                <span style={{
                  width:        '12px',
                  height:       '12px',
                  border:       '1.5px solid var(--border-strong)',
                  borderTop:    '1.5px solid var(--text-muted)',
                  borderRadius: '50%',
                  animation:    'spin 0.8s linear infinite',
                  display:      'inline-block',
                }} />
                Generating…
              </>
            ) : (
              <>
                <Download size={13} />
                Download Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* REVIEW PROMPT */}
      {showReview && (
        <div
          style={{
            marginTop:      '16px',
            background:     'var(--bg-card)',
            border:         '1px solid var(--border-default)',
            borderRadius:   'var(--radius-xl)',
            padding:        'clamp(14px, 3vw, 20px) clamp(16px, 3vw, 24px)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            '12px',
            flexWrap:       'wrap',
            animation:      'fadeUp 0.4s ease-out forwards',
            boxShadow:      'var(--shadow-sm)',
          }}
        >
          <div>
            <p style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'clamp(13px, 3vw, 15px)',
              fontWeight:   'var(--weight-bold)',
              color:        'var(--text-primary)',
              marginBottom: '3px',
            }}>
              Was this helpful?
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(11px, 2.5vw, 13px)',
              color:      'var(--text-muted)',
            }}>
              Leave a review — it helps others trust Prism.
            </p>
          </div>
          <button
            onClick={() => {
              const event = new CustomEvent('prism:open-review')
              window.dispatchEvent(event)
            }}
            style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'var(--text-sm)',
              fontWeight:   'var(--weight-bold)',
              color:        'var(--text-primary)',
              background:   'var(--bg-subtle)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding:      '9px 18px',
              cursor:       'pointer',
              transition:   'all var(--transition-fast)',
              whiteSpace:   'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'var(--bg-hover)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'var(--bg-subtle)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
          >
            ⭐ Leave a Review
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          /* ensure card doesn't overflow viewport */
          .scan-result-card {
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}