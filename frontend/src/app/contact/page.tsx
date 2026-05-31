'use client'

import ContactInfo from '@/components/sections/ContactInfo'
import BookingForm from '@/components/sections/BookingForm'

export default function ContactPage() {
  return (
    <div
      style={{
        minHeight:  'calc(100vh - var(--nav-height))',
        background: 'var(--bg-page)',
        padding:    'var(--section-padding-y) var(--section-padding-x)',
      }}
    >
      <div
        style={{
          maxWidth:            'var(--container-max)',
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap:                 '80px',
          alignItems:          'flex-start',
        }}
        className="contact-grid"
      >
        <ContactInfo />
        <BookingForm />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  )
}