// ============================================================
// PRISM — useScan HOOK (REAL BACKEND)
// Manages the entire scan state machine.
// Calls the real Next.js API proxy → FastAPI backend.
// Falls back to dummy data if backend is unreachable.
// ============================================================

'use client'

import { useState, useCallback } from 'react'
import type { ScanState, ScanResult } from '@/lib/types'
import { DUMMY_SCAN_RESULT, LOADING_STEPS } from '@/lib/constants'
import { isValidUrl, normalizeUrl, extractDomain } from '@/lib/utils'

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

interface UseScanReturn {
  state:        ScanState
  currentStep:  number
  stepLabel:    string
  startScan:    (url: string) => Promise<void>
  resetScan:    () => void
  setUrl:       (url: string) => void
}

// ------------------------------------------------------------
// INITIAL STATE
// ------------------------------------------------------------

const INITIAL_STATE: ScanState = {
  status: 'idle',
  result: null,
  error:  null,
  url:    '',
}

// ------------------------------------------------------------
// STEP TIMING (ms per step)
// Total ~5s which matches real backend scan time
// ------------------------------------------------------------

const STEP_DURATION = 800

// ------------------------------------------------------------
// HOOK
// ------------------------------------------------------------

export function useScan(): UseScanReturn {
  const [state,       setState]       = useState<ScanState>(INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState<number>(0)

  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------
  const resetScan = useCallback(() => {
    setState(INITIAL_STATE)
    setCurrentStep(0)
  }, [])

  // ----------------------------------------------------------
  // SET URL
  // ----------------------------------------------------------
  const setUrl = useCallback((url: string) => {
    setState((prev) => ({ ...prev, url }))
  }, [])

  // ----------------------------------------------------------
  // START SCAN
  // ----------------------------------------------------------
  const startScan = useCallback(async (rawUrl: string) => {
    const url = normalizeUrl(rawUrl)

    if (!isValidUrl(url)) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error:  'Please enter a valid URL — e.g. https://example.com',
      }))
      return
    }

    const domain = extractDomain(url)

    // Set loading state
    setState({
      status: 'loading',
      result: null,
      error:  null,
      url,
    })
    setCurrentStep(0)

    // ----------------------------------------------------------
    // RUN LOADING ANIMATION + REAL API CALL IN PARALLEL
    // The animation runs for visual feedback while the real
    // scan happens in the background.
    // ----------------------------------------------------------

    let stepIndex     = 0
    let animationDone = false

    // Step animation ticker
    const stepTimer = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, LOADING_STEPS.length - 1)
      setCurrentStep(stepIndex)
      if (stepIndex >= LOADING_STEPS.length - 1) {
        animationDone = true
      }
    }, STEP_DURATION)

    try {
      // Real API call
      const response = await fetch('/api/scan', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      })

      // Stop the animation
      clearInterval(stepTimer)
      setCurrentStep(LOADING_STEPS.length - 1)

      // Small pause so user sees the final step complete
      await new Promise<void>((resolve) => setTimeout(resolve, 400))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Scan returned no data.')
      }

      // Success — set real result
      setState({
        status: 'success',
        result: data.data as ScanResult,
        error:  null,
        url,
      })

    } catch (error) {
      clearInterval(stepTimer)

      const message = error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again.'

      console.error('Scan error:', error)

      // ----------------------------------------------------------
      // FALLBACK — use dummy data if backend unreachable
      // Remove this in production
      // ----------------------------------------------------------
      // No fallback — show the real error to the user
      setState({
        status: 'error',
        result: null,
        error:  message,
        url,
      })
      setState({
        status: 'error',
        result: null,
        error:  message,
        url,
      })
    }

    setCurrentStep(0)

  }, [])

  // ----------------------------------------------------------
  // STEP LABEL
  // ----------------------------------------------------------
  const stepLabel = LOADING_STEPS[currentStep] ?? LOADING_STEPS[0]

  return {
    state,
    currentStep,
    stepLabel,
    startScan,
    resetScan,
    setUrl,
  }
}