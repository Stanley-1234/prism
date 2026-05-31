// ============================================================
// PRISM — NEXT.JS REVIEWS API PROXY
// Proxies review requests to the FastAPI backend.
// GET  /api/reviews — fetch reviews
// POST /api/reviews — submit a review
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// GET — fetch all reviews
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/reviews`, {
      method:  'GET',
      headers: { 'Content-Type': 'application/json' },
      // Revalidate every 60 seconds
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch reviews.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Reviews GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Reviews service unavailable.' },
      { status: 503 }
    )
  }
}

// POST — submit a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.rating || !body.comment) {
      return NextResponse.json(
        { success: false, error: 'Rating and comment are required.' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/reviews`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { success: false, error },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Reviews POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Could not submit review.' },
      { status: 503 }
    )
  }
}