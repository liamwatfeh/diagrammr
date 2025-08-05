/**
 * API Route: Get Diagram Processing Status
 * 
 * Used by the processing page to poll for completion status
 */

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('diagrammr-auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: diagramId } = await params
    
    // For this demo, we'll simulate that diagrams are immediately ready
    // In a real implementation, we would check the database status
    
    // Simulate some processing time for the first few requests
    const now = Date.now()
    const diagramTimestamp = parseInt(diagramId.replace('diagram_', ''))
    const timeSinceCreation = now - diagramTimestamp
    
    if (timeSinceCreation < 3000) { // Still processing for first 3 seconds
      return Response.json({
        status: 'processing',
        message: 'AI is analyzing transcript and generating elements...'
      })
    }
    
    // After 3 seconds, mark as ready
    return Response.json({
      status: 'ready',
      message: 'Diagram generation complete',
      elementCount: 12 // Mock element count
    })

  } catch (error) {
    console.error('Status check failed:', error)
    
    return Response.json({
      status: 'error',
      error: 'Failed to check processing status'
    }, { status: 500 })
  }
}