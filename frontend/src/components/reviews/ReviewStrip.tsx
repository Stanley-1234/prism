'use client'

import { useState, useEffect } from 'react'
import type { Review } from '@/lib/types'
import { PLACEHOLDER_REVIEWS } from '@/lib/constants'
import ReviewCard from './ReviewCard'

export default function ReviewStrip() {
  const [reviews, setReviews] = useState<Review[]>(
    PLACEHOLDER_REVIEWS as unknown as Review[]
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        if (data.success && data.data && data.data.length > 0) {
          setReviews(data.data as Review[])
        }
      } catch {
        console.warn('Could not fetch reviews, using placeholders')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent
      setReviews((prev) => [custom.detail as Review, ...prev])
    }
    window.addEventListener('prism:new-review', handler)
    return () => window.removeEventListener('prism:new-review', handler)
  }, [])

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const doubled = [...reviews, ...reviews]

  return (
    <section
      style={{
        padding:    '80px 0',
        background: 'var(--bg-subtle)',
        overflow:   'hidden',
      }}
    >
      <div
        style={{
          maxWidth:      'var(--container-max)',
          margin:        '0 auto',
          padding:       '0 var(--section-padding-x)',
          marginBottom:  '40px',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          flexWrap:      'wrap',
          gap:           '12px',
        }}
      >
        <div>
          <p className="section-label">What people are saying</p>
          <h2
            style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(26px, 3.5vw, 36px)',
              fontWeight:    'var(--weight-extrabold)',
              color:         'var(--text-primary)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            Trusted by thousands
          </h2>
        </div>

        <div
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
            background:   'var(--bg-card)',
            border:       '1px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            padding:      '10px 20px',
            boxShadow:    'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '14px',
                  opacity:  s <= Math.round(parseFloat(averageRating)) ? 1 : 0.25,
                }}
              >
                ⭐
              </span>
            ))}
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'var(--text-base)',
              fontWeight: 'var(--weight-bold)',
              color:      'var(--text-primary)',
            }}>
              {averageRating}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-xs)',
              color:      'var(--text-muted)',
              marginLeft: '4px',
            }}>
              / 5 - {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position:      'absolute',
          left:          0, top: 0, bottom: 0,
          width:         '80px',
          background:    'linear-gradient(to right, var(--bg-subtle), transparent)',
          zIndex:        2,
          pointerEvents: 'none',
        }} />

        <div style={{
          position:      'absolute',
          right:         0, top: 0, bottom: 0,
          width:         '80px',
          background:    'linear-gradient(to left, var(--bg-subtle), transparent)',
          zIndex:        2,
          pointerEvents: 'none',
        }} />

        {loading ? (
          <div style={{
            display:        'flex',
            justifyContent: 'center',
            padding:        '40px',
            fontFamily:     'var(--font-body)',
            fontSize:       'var(--text-sm)',
            color:          'var(--text-muted)',
          }}>
            Loading reviews...
          </div>
        ) : (
          <div
            style={{
              display:   'flex',
              gap:       '16px',
              width:     'max-content',
              animation: 'scrollLeft 40s linear infinite',
              padding:   '8px 0',
            }}
          >
            {doubled.map((review, index) => (
              <ReviewCard
                key={`${review.id}-${index}`}
                review={review}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}