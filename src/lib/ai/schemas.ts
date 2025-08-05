/**
 * AI Response Schemas for Diagram Generation
 * 
 * This file contains all the structured schemas used for OpenAI API
 * responses and validation of AI-generated diagram data.
 */

import { z } from 'zod'

// Element type enum
export const ELEMENT_TYPES = ['process', 'decision', 'data', 'system', 'user_action'] as const
export type ElementType = typeof ELEMENT_TYPES[number]

// Connection type enum  
export const CONNECTION_TYPES = ['data_flow', 'process_flow', 'dependency', 'trigger'] as const
export type ConnectionType = typeof CONNECTION_TYPES[number]

// Zod schemas for validation
export const DiagramElementSchema = z.object({
  type: z.enum(ELEMENT_TYPES),
  position: z.object({ 
    x: z.number().min(0).max(2000), 
    y: z.number().min(0).max(2000) 
  }),
  highLevelDescription: z.string().min(1).max(255),
  technicalDescription: z.string().min(1).max(2000),
})

export const DiagramConnectionSchema = z.object({
  sourceElementIndex: z.number().min(0),
  targetElementIndex: z.number().min(0),
  connectionType: z.enum(CONNECTION_TYPES),
  label: z.string().max(100).optional(),
})

export const AIGeneratedDiagramSchema = z.object({
  title: z.string().min(1).max(255),
  elements: z.array(DiagramElementSchema).min(1).max(25),
  connections: z.array(DiagramConnectionSchema),
})

// TypeScript types derived from schemas
export type DiagramElement = z.infer<typeof DiagramElementSchema>
export type DiagramConnection = z.infer<typeof DiagramConnectionSchema>
export type AIGeneratedDiagram = z.infer<typeof AIGeneratedDiagramSchema>

/**
 * OpenAI JSON Schema for structured output
 * This is the exact schema format that OpenAI expects
 */
export const OPENAI_DIAGRAM_SCHEMA = {
  type: "object",
  properties: {
    title: { 
      type: "string",
      maxLength: 255,
      description: "Professional title for the technical diagram"
    },
    elements: {
      type: "array",
      maxItems: 25,
      minItems: 1,
      description: "Technical diagram elements (systems, processes, data flows)",
      items: {
        type: "object",
        properties: {
          type: { 
            type: "string", 
            enum: ELEMENT_TYPES,
            description: "Type of technical element"
          },
          position: {
            type: "object",
            properties: {
              x: { 
                type: "number", 
                minimum: 0, 
                maximum: 2000,
                description: "X coordinate for element positioning" 
              },
              y: { 
                type: "number", 
                minimum: 0, 
                maximum: 2000,
                description: "Y coordinate for element positioning" 
              }
            },
            required: ["x", "y"],
            description: "Canvas position coordinates"
          },
          highLevelDescription: { 
            type: "string", 
            maxLength: 255,
            minLength: 1,
            description: "Client-friendly description of what this element does" 
          },
          technicalDescription: { 
            type: "string",
            maxLength: 2000,
            minLength: 1,
            description: "Detailed technical explanation for developers" 
          }
        },
        required: ["type", "position", "highLevelDescription", "technicalDescription"],
        additionalProperties: false
      }
    },
    connections: {
      type: "array",
      description: "Logical connections between diagram elements",
      items: {
        type: "object",
        properties: {
          sourceElementIndex: { 
            type: "number",
            minimum: 0,
            description: "Index of source element in elements array" 
          },
          targetElementIndex: { 
            type: "number",
            minimum: 0,
            description: "Index of target element in elements array" 
          },
          connectionType: { 
            type: "string", 
            enum: CONNECTION_TYPES,
            description: "Type of connection between elements"
          },
          label: { 
            type: "string",
            maxLength: 100,
            description: "Optional descriptive label for the connection"
          }
        },
        required: ["sourceElementIndex", "targetElementIndex", "connectionType"],
        additionalProperties: false
      }
    }
  },
  required: ["title", "elements", "connections"],
  additionalProperties: false
} as const

/**
 * Validation function to ensure AI response matches our requirements
 */
export function validateAIResponse(data: unknown): AIGeneratedDiagram {
  try {
    console.log('🔍 Starting AI response validation...')
    const validated = AIGeneratedDiagramSchema.parse(data)
    
    // Additional business logic validation
    const elementCount = validated.elements.length
    console.log(`📊 Diagram has ${elementCount} elements and ${validated.connections.length} connections`)
    
    // Validate connection indices are within bounds
    const invalidConnections: string[] = []
    
    for (let i = 0; i < validated.connections.length; i++) {
      const connection = validated.connections[i]
      
      if (connection.sourceElementIndex >= elementCount) {
        invalidConnections.push(`Connection ${i}: source index ${connection.sourceElementIndex} >= ${elementCount}`)
      }
      if (connection.sourceElementIndex < 0) {
        invalidConnections.push(`Connection ${i}: source index ${connection.sourceElementIndex} < 0`)
      }
      if (connection.targetElementIndex >= elementCount) {
        invalidConnections.push(`Connection ${i}: target index ${connection.targetElementIndex} >= ${elementCount}`)
      }
      if (connection.targetElementIndex < 0) {
        invalidConnections.push(`Connection ${i}: target index ${connection.targetElementIndex} < 0`)
      }
      if (connection.sourceElementIndex === connection.targetElementIndex) {
        invalidConnections.push(`Connection ${i}: self-referencing connection (${connection.sourceElementIndex} -> ${connection.targetElementIndex})`)
      }
    }
    
    if (invalidConnections.length > 0) {
      console.error('❌ Invalid connections found:', invalidConnections)
      throw new Error(`Invalid connections found: ${invalidConnections.join(', ')}`)
    }
    
    console.log('✅ AI response validation passed')
    return validated
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
    console.error('❌ Validation failed:', errorMessage)
    throw new Error(`AI response validation failed: ${errorMessage}`)
  }
}