// ============================================================
// PRISM — FINDING ROW
// A single security finding inside a category card.
// Shows severity icon + plain English message + technical detail.
// ============================================================

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Finding } from '@/lib/types'

interface FindingRowProps {
  finding:    Finding
  isLast?:    boolean
}

export default function FindingRow({ finding, isLast = false }: FindingRowProps) {
  const [expanded, setExpanded] = useState(false)

  const severityIcon = finding.severity === 'pass'
    ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--prism-green)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
    : finding.severity === 'warning'
    ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#b5671a" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
    : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#c0242f" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    )

  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--border-default)',
        padding:      '12px 0',
      }}
    >
      {/* MAIN ROW */}
      <div
        style={{
          display:    'flex',
          alignItems: 'flex-start',
          gap:        '10px',
          cursor:     finding.technical || finding.recommendation ? 'pointer' : 'default',
        }}
        onClick={() => {
          if (finding.technical || finding.recommendation) {
            setExpanded(!expanded)
          }
        }}
        role={finding.technical ? 'button' : undefined}
        aria-expanded={finding.technical ? expanded : undefined}
      >
        {/* ICON */}
        <span style={{ flexShrink: 0, marginTop: '1px' }}>
          {severityIcon}
        </span>

        {/* MESSAGE */}
        <span
          style={{
            flex:        1,
            fontFamily:  'var(--font-body)',
            fontSize:    'var(--text-sm)',
            fontWeight:  'var(--weight-medium)',
            color:       'var(--text-primary)',
            lineHeight:  'var(--leading-normal)',
          }}
        >
          {finding.message}
        </span>

        {/* EXPAND CHEVRON */}
        {(finding.technical || finding.recommendation) && (
          <ChevronDown
            size={15}
            style={{
              flexShrink: 0,
              color:      'var(--text-muted)',
              marginTop:  '2px',
              transform:  expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)',
            }}
          />
        )}
      </div>

      {/* EXPANDED DETAIL */}
      {expanded && (
        <div
          style={{
            marginTop:    '10px',
            marginLeft:   '26px',
            animation:    'fadeUp 0.2s ease-out forwards',
          }}
        >
          {/* TECHNICAL DETAIL */}
          {finding.technical && (
            <div
              style={{
                background:   'var(--bg-subtle)',
                border:       '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding:      '10px 14px',
                marginBottom: finding.recommendation ? '8px' : '0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   'var(--text-xs)',
                  color:      'var(--text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                  wordBreak:  'break-all',
                }}
              >
                {finding.technical}
              </p>
            </div>
          )}

          {/* RECOMMENDATION */}
          {finding.recommendation && (
            <div
              style={{
                background:   'rgba(45,158,95,0.05)',
                border:       '1px solid var(--prism-green-border)',
                borderRadius: 'var(--radius-md)',
                padding:      '10px 14px',
                display:      'flex',
                gap:          '8px',
                alignItems:   'flex-start',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--prism-green)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'var(--text-xs)',
                  color:      '#1d7a46',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                <strong>Fix: </strong>{finding.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}