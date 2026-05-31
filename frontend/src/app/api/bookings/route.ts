// ============================================================
// PRISM — BOOKINGS API PROXY
// POST /api/bookings — forward to FastAPI backend
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/bookings`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Booking failed.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Booking proxy error:', error)
    return NextResponse.json(
      { success: false, error: 'Booking service unavailable.' },
      { status: 503 }
    )
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: 'GET',
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Could not fetch bookings.' },
      { status: 503 }
    )
  }
}