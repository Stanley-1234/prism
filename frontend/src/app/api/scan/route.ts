// ============================================================
// PRISM — NEXT.JS API PROXY
// Proxies scan requests from the frontend to the FastAPI backend.
// Keeps the backend URL server-side only — never exposed to browser.
// Route: POST /api/scan
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.url) {
      return NextResponse.json(
        { success: false, error: 'URL is required.' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/scan`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ url: body.url }),
      // 30 second timeout for slow scans
      signal:  AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { success: false, error: `Scan failed: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Scan proxy error:', error)

    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { success: false, error: 'Scan timed out. Please try again.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Scan service unavailable. Please try again.' },
      { status: 503 }
    )
  }
}