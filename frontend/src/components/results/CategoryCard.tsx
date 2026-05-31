// ============================================================
// PRISM — CATEGORY CARD
// One security category with its score, status, and findings.
// Expandable — click to reveal individual findings.
// ============================================================

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Category } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import FindingRow from '@/components/results/FindingRow'

const RESULT_ICONS = {
  ssl: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="#2D9E5F" fillOpacity="0.15"/>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2D9E5F" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2D9E5F" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="#2D9E5F"/>
    </svg>
  ),
  headers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F4A261" fillOpacity="0.15" stroke="#F4A261" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#F4A261" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cookies: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#378ADD" fillOpacity="0.12" stroke="#378ADD" strokeWidth="1.8"/>
      <circle cx="9" cy="10" r="1.2" fill="#378ADD"/>
      <circle cx="14" cy="8" r="1" fill="#378ADD"/>
      <circle cx="15" cy="14" r="1.2" fill="#378ADD"/>
      <circle cx="10" cy="15" r="0.9" fill="#378ADD"/>
    </svg>
  ),
  dns: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#8B5CF6" fillOpacity="0.12" stroke="#8B5CF6" strokeWidth="1.8"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="#8B5CF6" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke="#8B5CF6" strokeWidth="1.5"/>
    </svg>
  ),
  reputation: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill="#E63946" fillOpacity="0.12" stroke="#E63946" strokeWidth="1.8"/>
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#E63946" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  stack: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.6"/>
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.6"/>
    </svg>
  ),
}

interface CategoryCardProps {
  category:    Category
  defaultOpen?: boolean
  animDelay?:  number
}

export default function CategoryCard({
  category,
  defaultOpen = false,
  animDelay   = 0,
}: CategoryCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      style={{
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow:     'hidden',
        background:   'var(--bg-card)',
        animation:    `cardReveal 0.35s ease-out ${animDelay}ms both`,
      }}
    >
      {/* HEADER — clickable */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '16px 20px',
          background:     open ? 'var(--bg-subtle)' : 'var(--bg-card)',
          border:         'none',
          cursor:         'pointer',
          transition:     'background var(--transition-fast)',
          gap:            '12px',
        }}
      >
        {/* LEFT — icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
            {RESULT_ICONS[category.key as keyof typeof RESULT_ICONS] ?? null}
          </span>
          <span
            style={{
              fontFamily:  'var(--font-display)',
              fontSize:    'var(--text-base)',
              fontWeight:  'var(--weight-bold)',
              color:       'var(--text-primary)',
            }}
          >
            {category.label}
          </span>
        </div>

        {/* RIGHT — score + badge + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span
            style={{
              fontFamily:  'var(--font-display)',
              fontSize:    'var(--text-sm)',
              fontWeight:  'var(--weight-bold)',
              color:       'var(--text-secondary)',
            }}
          >
            {category.score}/100
          </span>
          <Badge severity={category.status} size="sm" />
          <ChevronDown
            size={16}
            style={{
              color:      'var(--text-muted)',
              transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)',
              flexShrink: 0,
            }}
          />
        </div>
      </button>

      {/* FINDINGS — revealed on open */}
      {open && (
        <div
          style={{
            padding:     '4px 20px 8px',
            borderTop:   '1px solid var(--border-default)',
            animation:   'fadeUp 0.2s ease-out forwards',
          }}
        >
          {/* CATEGORY DESCRIPTION */}
          <p
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-sm)',
              color:        'var(--text-muted)',
              padding:      '10px 0',
              borderBottom: '1px solid var(--border-default)',
              marginBottom: '4px',
            }}
          >
            {category.description}
          </p>

          {/* INDIVIDUAL FINDINGS */}
          {category.findings.map((finding, i) => (
            <FindingRow
              key={i}
              finding={finding}
              isLast={i === category.findings.length - 1}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}