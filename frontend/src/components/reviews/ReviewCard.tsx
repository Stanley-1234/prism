// ============================================================
// PRISM — REVIEW CARD
// Displays a single user review.
// Used inside ReviewStrip.
// ============================================================

import type { Review } from '@/lib/types'
import { formatTimeAgo } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding:      '20px 24px',
        minWidth:     '300px',
        maxWidth:     '340px',
        flexShrink:   0,
        boxShadow:    'var(--shadow-sm)',
      }}
    >
      {/* STARS */}
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '2px',
          marginBottom: '12px',
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '14px',
              filter:   star <= review.rating
                ? 'none'
                : 'grayscale(1) opacity(0.25)',
            }}
          >
            ⭐
          </span>
        ))}
        <span
          style={{
            fontFamily:  'var(--font-body)',
            fontSize:    'var(--text-xs)',
            color:       'var(--text-muted)',
            marginLeft:  '6px',
          }}
        >
          {formatTimeAgo(review.created_at)}
        </span>
      </div>

      {/* COMMENT */}
      <p
        style={{
          fontFamily:   'var(--font-body)',
          fontSize:     'var(--text-sm)',
          color:        'var(--text-secondary)',
          lineHeight:   'var(--leading-relaxed)',
          marginBottom: '16px',
          display:      '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow:     'hidden',
        }}
      >
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* REVIEWER */}
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '10px',
        }}
      >
        {/* AVATAR */}
        <div
          style={{
            width:          '28px',
            height:         '28px',
            borderRadius:   '50%',
            background:     'var(--bg-subtle)',
            border:         '1px solid var(--border-default)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontFamily:     'var(--font-display)',
            fontSize:       'var(--text-xs)',
            fontWeight:     'var(--weight-bold)',
            color:          'var(--text-secondary)',
            flexShrink:     0,
          }}
        >
          {(review.reviewer_name || 'A')[0].toUpperCase()}
        </div>

        <div>
          <p
            style={{
              fontFamily:  'var(--font-body)',
              fontSize:    'var(--text-sm)',
              fontWeight:  'var(--weight-medium)',
              color:       'var(--text-primary)',
              lineHeight:  1.2,
            }}
          >
            {review.reviewer_name || 'Anonymous'}
          </p>

          {/* DOMAIN IF SHOWN */}
          {review.show_domain && review.domain_scanned && (
            <p
              style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    'var(--text-xs)',
                color:       'var(--text-muted)',
                marginTop:   '2px',
              }}
            >
              Scanned: {review.domain_scanned}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}