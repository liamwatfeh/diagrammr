/**
 * AI Diagram Generation Service
 * 
 * Handles OpenAI API integration for converting technical transcripts
 * into structured diagram data using GPT-4 with structured outputs.
 */

import OpenAI from 'openai'
import { 
  AIGeneratedDiagram, 
  OPENAI_DIAGRAM_SCHEMA, 
  validateAIResponse 
} from './schemas'

// OpenAI client will be initialized in the function to handle missing keys properly

/**
 * System prompt for diagram generation
 * Optimized for technical accuracy and client presentation quality
 */
const SYSTEM_PROMPT = `You are a senior technical systems analyst and diagram specialist for Brilliant Noise, a premium technical consultancy. Your job is to create professional flowchart diagrams from technical conversation transcripts that will be used in client presentations.

CORE REQUIREMENTS:
- Maximum 25 elements total (quality over quantity)
- Focus on technical systems, APIs, databases, and data flows
- Create client-friendly descriptions that business stakeholders can understand
- Provide detailed technical descriptions for development teams
- Position elements in logical flow patterns (left-to-right, top-to-bottom)
- Generate meaningful connections that show data flow and dependencies

ELEMENT TYPES TO USE:
- "system": External services, APIs, databases, infrastructure
- "process": Business logic, data processing, transformations
- "decision": Conditional logic, validation checks, approval gates
- "data": Data stores, file systems, message queues
- "user_action": User interactions, manual processes, human decisions

CONNECTION TYPES TO USE:
- "data_flow": Data moving between systems
- "process_flow": Sequential workflow steps
- "dependency": One system depends on another
- "trigger": Events that initiate actions

POSITIONING STRATEGY:
- Start flows from left (x: 100-300)
- End flows on right (x: 1500-1800)
- Use vertical spacing (y: 100-1800) for parallel processes
- Create clear visual hierarchy with logical groupings

CRITICAL VALIDATION RULES:
- Element indices start at 0 and must be consecutive (0, 1, 2, 3...)
- Connection sourceElementIndex and targetElementIndex MUST be valid array indices
- If you have N elements, valid indices are 0 to N-1 (inclusive)
- NO self-referencing connections (source !== target)
- ALWAYS double-check your connection indices before outputting

OUTPUT QUALITY:
- High-level descriptions: Business-friendly, concise, action-oriented
- Technical descriptions: Developer-focused, specific, implementation details
- Connections: Clear labels showing what data/control flows between elements
- Professional naming: Use proper technical terminology and client business language`

interface DiagramGenerationOptions {
  transcript: string
  projectTitle: string
  clientName: string
  notes?: string
}

/**
 * Generate a diagram from a technical conversation transcript
 */
export async function generateDiagramFromTranscript({
  transcript,
  projectTitle,
  clientName,
  notes
}: DiagramGenerationOptions): Promise<AIGeneratedDiagram> {
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required. Please add it to your .env.local file.')
  }
  
  console.log('🔧 OpenAI API Key Check:', {
    provided: !!process.env.OPENAI_API_KEY,
    length: process.env.OPENAI_API_KEY?.length,
    format: process.env.OPENAI_API_KEY?.startsWith('sk-') ? 'Valid format' : 'Invalid format'
  })

  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Attempt ${attempt}/${maxRetries} - Generating diagram...`)
      
      // Initialize OpenAI client here to handle errors properly
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      
      const userPrompt = buildUserPrompt(transcript, projectTitle, clientName, notes)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Use stable model
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "technical_diagram_generation",
            description: "Generate a professional technical flowchart diagram from conversation transcript",
            schema: OPENAI_DIAGRAM_SCHEMA
          }
        },
        temperature: 0.2, // Lower temperature for more consistent output
        max_tokens: 4000, // Enough for complex diagrams
      })

      const rawResponse = completion.choices[0].message.content
      
      if (!rawResponse) {
        throw new Error('No response received from OpenAI')
      }

      // Parse and validate the response
      const parsedResponse = JSON.parse(rawResponse)
      console.log('🔍 Validating AI response...')
      const validatedDiagram = validateAIResponse(parsedResponse)

      console.log(`✅ Attempt ${attempt} successful! Generated diagram with ${validatedDiagram.elements.length} elements and ${validatedDiagram.connections.length} connections`)
      return validatedDiagram

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      console.error(`⚠️  Attempt ${attempt} failed:`, lastError.message)
      
      if (attempt === maxRetries) {
        console.error(`❌ All ${maxRetries} attempts failed.`)
        break
      }
      
      console.log(`🔄 Retrying in ${attempt * 1000}ms...`)
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000))
    }
  }

  // If we get here, all attempts failed
  throw new Error(`AI diagram generation failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`)
}

/**
 * Build the user prompt with context and requirements
 */
function buildUserPrompt(
  transcript: string, 
  projectTitle: string, 
  clientName: string,
  notes?: string
): string {
  return `Create a professional technical flowchart diagram for this client project:

PROJECT DETAILS:
- Title: "${projectTitle}"
- Client: ${clientName}
- Context: ${notes || 'No additional context provided'}

TECHNICAL CONVERSATION TRANSCRIPT:
${transcript}

DIAGRAM REQUIREMENTS:
1. Extract the core technical workflow from this conversation
2. Focus on systems, data flows, and technical processes mentioned
3. Create 8-20 elements that tell the complete technical story
4. Use proper technical terminology while keeping descriptions client-friendly
5. Show logical connections between systems and processes
6. Position elements to create a clear left-to-right or top-to-bottom flow
7. Include any mentioned APIs, databases, authentication flows, or integrations

QUALITY STANDARDS:
- High-level descriptions should be clear to business stakeholders
- Technical descriptions should include specific implementation details
- Connection labels should explain what data or control flows between elements
- The diagram should be presentation-ready for client meetings
- Focus on the most critical technical components and their relationships

Generate a diagram that Brilliant Noise can confidently present to ${clientName} to demonstrate technical expertise and clear understanding of their requirements.`
}

/**
 * Test function for AI processing (development only)
 */
export async function testDiagramGeneration(): Promise<void> {
  const testTranscript = `
    We need to build an e-commerce API that handles user authentication through OAuth, 
    processes payments via Stripe, and stores product data in PostgreSQL. 
    When a user places an order, we validate their account, check inventory, 
    process the payment, and then update the database. 
    We also need to send email notifications and update our analytics dashboard.
  `
  
  try {
    const result = await generateDiagramFromTranscript({
      transcript: testTranscript,
      projectTitle: "E-commerce API System",
      clientName: "Test Client",
      notes: "Development testing"
    })
    
    console.log('Test diagram generated successfully:', {
      title: result.title,
      elementCount: result.elements.length,
      connectionCount: result.connections.length
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Test failed:', errorMessage)
  }
}