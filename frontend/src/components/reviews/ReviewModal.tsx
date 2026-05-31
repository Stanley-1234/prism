// ============================================================
// PRISM — REVIEW MODAL (LIVE BACKEND)
// Submits reviews to the real backend via /api/reviews.
// Star rating + comment + optional name + domain toggle.
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import type { ReviewFormData } from '@/lib/types'
import { getReviewLabel } from '@/lib/utils'

interface ReviewModalProps {
  domainScanned?: string
}

export default function ReviewModal({ domainScanned }: ReviewModalProps) {
  const [isOpen,      setIsOpen]      = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)

  const [form, setForm] = useState<ReviewFormData>({
    rating:         0,
    comment:        '',
    reviewer_name:  '',
    domain_scanned: domainScanned ?? '',
    show_domain:    false,
  })

  // Update domain when prop changes
  useEffect(() => {
    if (domainScanned) {
      setForm((f) => ({ ...f, domain_scanned: domainScanned }))
    }
  }, [domainScanned])

  // Listen for open event from ScanResult
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('prism:open-review', handler)
    return () => window.removeEventListener('prism:open-review', handler)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close handler
  const handleClose = useCallback(() => {
    setIsOpen(false)
    setError('')
  }, [])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  // ----------------------------------------------------------
  // SUBMIT — real backend call
  // ----------------------------------------------------------
  const handleSubmit = async () => {
    setError('')

    if (form.rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (form.comment.trim().length < 10) {
      setError('Please write at least 10 characters.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          rating:         form.rating,
          comment:        form.comment.trim(),
          reviewer_name:  form.reviewer_name.trim() || 'Anonymous',
          domain_scanned: form.show_domain ? form.domain_scanned : undefined,
          show_domain:    form.show_domain,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not submit review.')
      }

      // Dispatch to ReviewStrip for live update
      const event = new CustomEvent('prism:new-review', {
        detail: data.data,
      })
      window.dispatchEvent(event)

      setSubmitted(true)

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(26,26,26,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex:     100,
          animation:  'fadeIn 0.2s ease-out forwards',
        }}
      />

      {/* MODAL PANEL */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Leave a review"
        style={{
          position:     'fixed',
          top:          '50%',
          left:         '50%',
          transform:    'translate(-50%, -50%)',
          zIndex:       110,
          width:        'calc(100% - 32px)',
          maxWidth:     '480px',
          background:   'var(--bg-card)',
          border:       '1px solid var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow:    'var(--shadow-modal)',
          overflow:     'hidden',
          animation:    'slideUp 0.4s cubic-bezier(0.34,1.20,0.64,1) forwards',
        }}
      >
        {/* HEADER */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '24px 24px 0',
        }}>
          <div>
            <h2 style={{
              fontFamily:  'var(--font-display)',
              fontSize:    'var(--text-lg)',
              fontWeight:  'var(--weight-bold)',
              color:       'var(--text-primary)',
              marginBottom:'4px',
            }}>
              How was your experience?
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-sm)',
              color:      'var(--text-muted)',
            }}>
              Your review helps others trust Prism.
            </p>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              width:          '32px',
              height:         '32px',
              borderRadius:   'var(--radius-md)',
              background:     'var(--bg-subtle)',
              border:         '1px solid var(--border-default)',
              cursor:         'pointer',
              color:          'var(--text-muted)',
              flexShrink:     0,
              transition:     'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)'
              e.currentTarget.style.color      = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-subtle)'
              e.currentTarget.style.color      = 'var(--text-muted)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        {submitted ? (
          // SUCCESS STATE
          <div style={{
            padding:   '48px 24px',
            textAlign: 'center',
            animation: 'fadeUp 0.3s ease-out forwards',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{
              fontFamily:   'var(--font-display)',
              fontSize:     'var(--text-lg)',
              fontWeight:   'var(--weight-bold)',
              color:        'var(--text-primary)',
              marginBottom: '8px',
            }}>
              Thank you!
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'var(--text-sm)',
              color:      'var(--text-muted)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              Your review has been submitted and will
              appear in the strip below.
            </p>
            <button
              onClick={handleClose}
              style={{
                marginTop:    '24px',
                fontFamily:   'var(--font-display)',
                fontSize:     'var(--text-sm)',
                fontWeight:   'var(--weight-bold)',
                color:        'white',
                background:   'var(--text-primary)',
                border:       'none',
                borderRadius: 'var(--radius-md)',
                padding:      '12px 28px',
                cursor:       'pointer',
                transition:   'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--text-primary)' }}
            >
              Done
            </button>
          </div>
        ) : (
          // FORM STATE
          <div style={{ padding: '24px' }}>

            {/* STAR RATING */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontFamily:   'var(--font-body)',
                fontSize:     'var(--text-sm)',
                fontWeight:   'var(--weight-medium)',
                color:        'var(--text-primary)',
                marginBottom: '12px',
              }}>
                Your rating
                <span style={{ color: 'var(--prism-red)', marginLeft: '2px' }}>*</span>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hoveredStar || form.rating)
                    return (
                      <button
                        key={star}
                        onClick={() => setForm((f) => ({ ...f, rating: star }))}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        style={{
                          background: 'none',
                          border:     'none',
                          cursor:     'pointer',
                          padding:    '2px',
                          fontSize:   '28px',
                          lineHeight: 1,
                          transition: 'transform var(--transition-fast)',
                          transform:  filled ? 'scale(1.15)' : 'scale(1)',
                          filter:     filled
                            ? 'none'
                            : 'grayscale(1) opacity(0.3)',
                        }}
                      >
                        ⭐
                      </button>
                    )
                  })}
                </div>

                {(hoveredStar || form.rating) > 0 && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color:      'var(--text-secondary)',
                    animation:  'fadeIn 0.15s ease-out forwards',
                  }}>
                    {getReviewLabel(hoveredStar || form.rating)}
                  </span>
                )}
              </div>
            </div>

            {/* COMMENT */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="review-comment"
                style={{
                  display:      'block',
                  fontFamily:   'var(--font-body)',
                  fontSize:     'var(--text-sm)',
                  fontWeight:   'var(--weight-medium)',
                  color:        'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Your review
                <span style={{ color: 'var(--prism-red)', marginLeft: '2px' }}>*</span>
              </label>
              <textarea
                id="review-comment"
                value={form.comment}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  comment: e.target.value.slice(0, 300),
                }))}
                placeholder="Tell others what you think about Prism..."
                rows={3}
                style={{
                  width:        '100%',
                  fontFamily:   'var(--font-body)',
                  fontSize:     'var(--text-sm)',
                  color:        'var(--text-primary)',
                  background:   'var(--bg-page)',
                  border:       '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding:      '12px 14px',
                  resize:       'vertical',
                  minHeight:    '88px',
                  outline:      'none',
                  transition:   'border-color var(--transition-fast)',
                  lineHeight:   'var(--leading-relaxed)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'var(--text-xs)',
                color:      'var(--text-muted)',
                marginTop:  '4px',
                textAlign:  'right',
              }}>
                {form.comment.length}/300
              </p>
            </div>

            {/* NAME */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="review-name"
                style={{
                  display:      'block',
                  fontFamily:   'var(--font-body)',
                  fontSize:     'var(--text-sm)',
                  fontWeight:   'var(--weight-medium)',
                  color:        'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Your name
                <span style={{
                  fontWeight: 'var(--weight-regular)',
                  color:      'var(--text-muted)',
                  marginLeft: '6px',
                  fontSize:   'var(--text-xs)',
                }}>
                  (optional)
                </span>
              </label>
              <input
                id="review-name"
                type="text"
                value={form.reviewer_name}
                onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                placeholder="e.g. Sarah M."
                maxLength={50}
                style={{
                  width:        '100%',
                  fontFamily:   'var(--font-body)',
                  fontSize:     'var(--text-sm)',
                  color:        'var(--text-primary)',
                  background:   'var(--bg-page)',
                  border:       '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding:      '10px 14px',
                  outline:      'none',
                  transition:   'border-color var(--transition-fast)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
            </div>

            {/* DOMAIN TOGGLE */}
            {domainScanned && (
              <div
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '10px',
                  marginBottom: '20px',
                  padding:      '12px 14px',
                  background:   'var(--bg-subtle)',
                  border:       '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor:       'pointer',
                }}
                onClick={() => setForm((f) => ({ ...f, show_domain: !f.show_domain }))}
              >
                {/* TOGGLE SWITCH */}
                <div style={{
                  width:        '36px',
                  height:       '20px',
                  borderRadius: 'var(--radius-full)',
                  background:   form.show_domain
                    ? 'var(--prism-green)'
                    : 'var(--border-strong)',
                  position:     'relative',
                  flexShrink:   0,
                  transition:   'background var(--transition-fast)',
                }}>
                  <div style={{
                    position:     'absolute',
                    top:          '2px',
                    left:         form.show_domain ? '18px' : '2px',
                    width:        '16px',
                    height:       '16px',
                    borderRadius: '50%',
                    background:   'white',
                    transition:   'left var(--transition-fast)',
                    boxShadow:    'var(--shadow-xs)',
                  }} />
                </div>

                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color:      'var(--text-primary)',
                  }}>
                    Show the site I scanned
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'var(--text-xs)',
                    color:      'var(--text-muted)',
                  }}>
                    {domainScanned}
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div style={{
                background:   'var(--prism-red-light)',
                border:       '1px solid var(--prism-red-border)',
                borderRadius: 'var(--radius-md)',
                padding:      '10px 14px',
                marginBottom: '12px',
                fontFamily:   'var(--font-body)',
                fontSize:     'var(--text-sm)',
                color:        'var(--prism-red)',
                animation:    'fadeUp 0.2s ease-out forwards',
              }}>
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width:          '100%',
                fontFamily:     'var(--font-display)',
                fontSize:       'var(--text-base)',
                fontWeight:     'var(--weight-bold)',
                color:          'white',
                background:     submitting
                  ? 'var(--border-strong)'
                  : 'var(--text-primary)',
                border:         'none',
                borderRadius:   'var(--radius-md)',
                padding:        '14px 24px',
                cursor:         submitting ? 'not-allowed' : 'pointer',
                transition:     'all var(--transition-fast)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.background = '#333'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = submitting
                  ? 'var(--border-strong)'
                  : 'var(--text-primary)'
              }}
            >
              {submitting ? (
                <>
                  <span style={{
                    width:        '14px',
                    height:       '14px',
                    border:       '2px solid rgba(255,255,255,0.3)',
                    borderTop:    '2px solid white',
                    borderRadius: '50%',
                    animation:    'spin 0.8s linear infinite',
                    display:      'inline-block',
                  }} />
                  Submitting…
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}