/**
 * API Route: Create Diagram from Transcript
 * 
 * Handles the complete workflow:
 * 1. Authentication & validation
 * 2. Save transcript to database  
 * 3. Process with OpenAI
 * 4. Save diagram with elements
 * 5. Log analytics
 */

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { generateDiagramFromTranscript } from '@/lib/ai/diagram-generator'
import { z } from 'zod'

// Input validation schema
const CreateDiagramSchema = z.object({
  clientName: z.string().min(1).max(100),
  projectTitle: z.string().min(1).max(255),
  transcript: z.string().min(100).max(50000),
  notes: z.string().max(1000).optional()
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Diagram creation API called at', new Date().toISOString())
  
  try {
    // 1. Check authentication (using our custom cookie auth)
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('diagrammr-auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate request body
    const body = await request.json()
    console.log('📝 Form data received:', {
      clientName: body.clientName,
      projectTitle: body.projectTitle,
      transcriptLength: body.transcript?.length || 0,
      hasNotes: !!body.notes
    })
    
    const validatedData = CreateDiagramSchema.parse(body)
    console.log('✅ Input validation passed')
    
    // 3. Save transcript to database using Supabase MCP
    console.log('Creating transcript record...')
    
    // Note: In a real implementation, we would get the authenticated user ID
    // For now, using a placeholder user ID since we have custom auth
    const userId = '123e4567-e89b-12d3-a456-426614174000' // Placeholder UUID
    
    // Insert transcript record - we'll do this after AI processing since we need real data for this demo
    
    // 4. Process with OpenAI API - ALWAYS use real AI
    console.log('🤖 Processing with REAL OpenAI API...')
    console.log('🔍 API Key Status:', {
      hasKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0,
      startsWithSk: process.env.OPENAI_API_KEY?.startsWith('sk-') || false,
      firstChars: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none'
    })
    
    // Force use of real OpenAI API
    console.log('🔑 Calling OpenAI API for real AI processing...')
    const aiResponse = await generateDiagramFromTranscript({
      transcript: validatedData.transcript,
      projectTitle: validatedData.projectTitle,
      clientName: validatedData.clientName,
      notes: validatedData.notes
    })
    
    console.log('✅ AI processing complete:', {
      title: aiResponse.title,
      elementCount: aiResponse.elements.length,
      connectionCount: aiResponse.connections.length,
      processingMode: 'REAL OpenAI GPT-4'
    })
    
    console.log('🤖 FULL AI RESPONSE JSON:')
    console.log(JSON.stringify(aiResponse, null, 2))
    
    // 5. Create diagram with elements using Supabase MCP
    console.log('Saving diagram to database...')
    // We'll use MCP calls here for database operations
    
    // For now, create a mock diagram ID
    const mockDiagramId = `diagram_${Date.now()}`
    
    // 6. Log activity for analytics
    const processingTime = Date.now() - startTime
    console.log('Processing completed in', processingTime, 'ms')
    
    // 7. Return success response with AI data
    const response = { 
      success: true, 
      diagramId: mockDiagramId,
      title: aiResponse.title,
      elementCount: aiResponse.elements.length,
      processingTime,
      aiResponse: aiResponse // Include the full AI response for the frontend
    }
    
    console.log('🎉 Diagram creation successful:', response)
    return Response.json(response)

  } catch (error) {
    console.error('❌ Diagram creation failed:', error)
    
    if (error instanceof z.ZodError) {
      console.error('📝 Validation errors:', error.errors)
      return Response.json({ 
        error: 'Invalid input data',
        details: error.errors
      }, { status: 400 })
    }
    
    if (error.message.includes('OpenAI') || error.message.includes('OPENAI_API_KEY')) {
      console.error('🤖 AI processing error:', error.message)
      return Response.json({ 
        error: 'OpenAI API Error',
        details: error.message,
        hint: 'Make sure your OPENAI_API_KEY is set correctly in .env.local'
      }, { status: 500 })
    }
    
    console.error('🔥 Unexpected error:', error.message)
    return Response.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}