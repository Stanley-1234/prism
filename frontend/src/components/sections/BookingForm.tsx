'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'


interface BookingFormData {
  name:         string
  email:        string
  phone:        string
  company:      string
  website:      string
  service_type: string
  message:      string
}

const INITIAL_FORM: BookingFormData = {
  name:         '',
  email:        '',
  phone:        '',
  company:      '',
  website:      '',
  service_type: '',
  message:      '',
}

const SERVICES = [
  {
    value:       'pen_test',
    label:       'Penetration Test',
    description: 'Full manual pen test — OWASP Top 10, business logic, authenticated scanning.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    value:       'audit',
    label:       'Security Audit',
    description: 'Comprehensive review of your infrastructure, code, and security posture.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    value:       'consultation',
    label:       'Security Consultation',
    description: 'Expert advice on your security strategy, tools, and team practices.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
]
const inputStyle: React.CSSProperties = {
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
  lineHeight:   'var(--leading-normal)',
}

export default function BookingForm() {
  const [form,       setForm]       = useState<BookingFormData>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')

  const updateForm = (key: keyof BookingFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (error) setError('')
  }

  const handleSubmit = async () => {
    if (!form.name.trim())        return setError('Please enter your name.')
    if (!form.email.trim() || !form.email.includes('@'))
                                  return setError('Please enter a valid email address.')
    if (!form.service_type)       return setError('Please select a service.')

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:         form.name.trim(),
          email:        form.email.trim(),
          phone:        form.phone.trim() || null,
          company:      form.company.trim() || null,
          website:      form.website.trim() || null,
          service_type: form.service_type,
          message:      form.message.trim() || null,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Something went wrong.')
      setSubmitted(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)',
        padding:      '40px',
        boxShadow:    'var(--shadow-lg)',
        position:     'sticky',
        top:          'calc(var(--nav-height) + 24px)',
      }}
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeUp 0.4s ease-out forwards' }}>
          <div style={{
            width:          '64px',
            height:         '64px',
            borderRadius:   '50%',
            background:     'var(--prism-green-light)',
            border:         '2px solid var(--prism-green-border)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            margin:         '0 auto 24px',
          }}>
            <CheckCircle size={32} style={{ color: 'var(--prism-green)' }} />
          </div>

          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'var(--text-2xl)',
            fontWeight:   800,
            color:        'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Enquiry received!
          </h2>

          <p style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--text-base)',
            color:        'var(--text-secondary)',
            lineHeight:   'var(--leading-relaxed)',
            marginBottom: '32px',
            maxWidth:     '360px',
            margin:       '0 auto 32px',
          }}>
            Thank you {form.name.split(' ')[0]}. A member of the SIU Security
            team will be in touch within 24 hours.
          </p>

          <div style={{
            background:   'var(--bg-subtle)',
            border:       '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding:      '16px 20px',
            marginBottom: '24px',
            textAlign:    'left',
          }}>
            <p style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-sm)',
              color:        'var(--text-muted)',
              marginBottom: '4px',
            }}>
              Questions in the meantime? Reach us at:
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   'var(--text-sm)',
              color:      'var(--text-primary)',
              fontWeight: 600,
            }}>
              siutech.info@gmail.com
            </p>
          </div>

          <Link
            href="/"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              fontFamily:     'var(--font-display)',
              fontSize:       'var(--text-sm)',
              fontWeight:     700,
              color:          'white',
              background:     'var(--text-primary)',
              borderRadius:   'var(--radius-md)',
              padding:        '12px 24px',
              textDecoration: 'none',
            }}
          >
            Back to Prism
          </Link>
        </div>

      ) : (
        <>
          <h2 style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'var(--text-xl)',
            fontWeight:   800,
            color:        'var(--text-primary)',
            marginBottom: '6px',
          }}>
            Book a service
          </h2>
          <p style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--text-sm)',
            color:        'var(--text-muted)',
            marginBottom: '28px',
          }}>
            Fill in your details and we&apos;ll get back to you within 24 hours.
          </p>

          {/* SERVICE TYPE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display:      'block',
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-sm)',
              fontWeight:   600,
              color:        'var(--text-primary)',
              marginBottom: '10px',
            }}>
              What do you need?
              <span style={{ color: 'var(--prism-red)', marginLeft: '2px' }}>*</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SERVICES.map((service) => (
                <div
                  key={service.value}
                  onClick={() => updateForm('service_type', service.value)}
                  style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '12px',
                    padding:      '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border:       `1.5px solid ${form.service_type === service.value ? 'var(--prism-green)' : 'var(--border-default)'}`,
                    background:   form.service_type === service.value ? 'var(--prism-green-light)' : 'var(--bg-page)',
                    cursor:       'pointer',
                    transition:   'all var(--transition-fast)',
                  }}
                >
                  <span style={{ flexShrink: 0, color: form.service_type === service.value ? 'var(--prism-green)' : 'var(--text-muted)', display: 'flex' }}>
                    {service.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily:   'var(--font-display)',
                      fontSize:     'var(--text-sm)',
                      fontWeight:   700,
                      color:        'var(--text-primary)',
                      marginBottom: '2px',
                    }}>
                      {service.label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize:   'var(--text-xs)',
                      color:      'var(--text-muted)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}>
                      {service.description}
                    </p>
                  </div>
                  <div style={{
                    width:        '16px',
                    height:       '16px',
                    borderRadius: '50%',
                    border:       `2px solid ${form.service_type === service.value ? 'var(--prism-green)' : 'var(--border-strong)'}`,
                    background:   form.service_type === service.value ? 'var(--prism-green)' : 'transparent',
                    flexShrink:   0,
                    marginTop:    '2px',
                    transition:   'all var(--transition-fast)',
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* NAME + EMAIL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="form-row">
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Full name <span style={{ color: 'var(--prism-red)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="John Okafor"
                style={inputStyle}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Email <span style={{ color: 'var(--prism-red)' }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="john@company.com"
                style={inputStyle}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
            </div>
          </div>

          {/* PHONE + COMPANY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="form-row">
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Phone <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                placeholder="+234 800 000 0000"
                style={inputStyle}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Company <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>(optional)</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => updateForm('company', e.target.value)}
                placeholder="Acme Corp"
                style={inputStyle}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
              />
            </div>
          </div>

          {/* WEBSITE */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Website to test <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>(optional)</span>
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateForm('website', e.target.value)}
              placeholder="https://yoursite.com"
              style={inputStyle}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
            />
          </div>

          {/* MESSAGE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Tell us more <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>(optional)</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => updateForm('message', e.target.value)}
              placeholder="Describe your security needs, timeline, or any specific concerns..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
              onBlur={(e: React.FocusEvent<HTMLTextAreaElement>)  => { e.currentTarget.style.borderColor = 'var(--border-default)' }}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              background:   'var(--prism-red-light)',
              border:       '1px solid var(--prism-red-border)',
              borderRadius: 'var(--radius-md)',
              padding:      '10px 14px',
              marginBottom: '16px',
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--text-sm)',
              color:        'var(--prism-red)',
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
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
              fontFamily:     'var(--font-display)',
              fontSize:       'var(--text-base)',
              fontWeight:     800,
              color:          'white',
              background:     submitting ? 'var(--border-strong)' : 'var(--text-primary)',
              border:         'none',
              borderRadius:   'var(--radius-lg)',
              padding:        '16px 28px',
              cursor:         submitting ? 'not-allowed' : 'pointer',
              transition:     'all var(--transition-fast)',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!submitting) {
                e.currentTarget.style.background = '#333'
                e.currentTarget.style.transform  = 'translateY(-1px)'
                e.currentTarget.style.boxShadow  = 'var(--shadow-md)'
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = submitting ? 'var(--border-strong)' : 'var(--text-primary)'
              e.currentTarget.style.transform  = 'translateY(0)'
              e.currentTarget.style.boxShadow  = 'none'
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
                Sending…
              </>
            ) : (
              'Send Enquiry'
            )}
          </button>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-xs)',
            color:      'var(--text-muted)',
            textAlign:  'center',
            marginTop:  '12px',
          }}>
            🔒 Your information is kept strictly confidential.
          </p>

          <style>{`
            @media (max-width: 560px) {
              .form-row { grid-template-columns: 1fr !important; }
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  )
}