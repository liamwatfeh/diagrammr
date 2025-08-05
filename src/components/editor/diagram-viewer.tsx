'use client'

import React, { useEffect, useState } from 'react'
import { useDiagramEditorStore } from '@/stores/diagram-editor-store'
import { aiResponseToReactFlow } from '@/lib/diagram/data-converter'
import DiagramCanvas from './diagram-canvas'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DiagramViewerProps {
  diagramId: string
  className?: string
  readOnly?: boolean
}

interface DiagramData {
  id: string
  title: string
  ai_response: any // The AI-generated diagram data
  status: 'processing' | 'completed' | 'failed'
  created_at: string
}

export function DiagramViewer({ 
  diagramId, 
  className,
  readOnly = false 
}: DiagramViewerProps) {
  const { loadDiagram } = useDiagramEditorStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null)

  useEffect(() => {
    async function fetchDiagram() {
      try {
        setLoading(true)
        setError(null)

        console.log('🔍 Fetching diagram data for ID:', diagramId)

        // In a real implementation, this would call our Supabase API
        // For now, we'll simulate the API call and return mock data based on the AI response
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // For now, we'll need to get the AI response from localStorage or session
        // This is a temporary solution until we implement proper database storage
        const storedAiResponse = sessionStorage.getItem(`diagram_${diagramId}_ai_response`)
        
        if (storedAiResponse) {
          const aiResponse = JSON.parse(storedAiResponse)
          console.log('📊 Loading AI response from session storage:', aiResponse)
          
          // Convert AI response to React Flow format
          const { nodes, edges } = aiResponseToReactFlow(aiResponse)
          console.log('🔗 Converted to React Flow format:', { nodeCount: nodes.length, edgeCount: edges.length })
          
          // Load the diagram into the store
          loadDiagram(nodes, edges)
          
          setDiagramData({
            id: diagramId,
            title: aiResponse.title,
            ai_response: aiResponse,
            status: 'completed',
            created_at: new Date().toISOString()
          })
        } else {
          // If no stored data, show an error
          throw new Error('Diagram data not found. This might be because the diagram was created in a different session.')
        }

      } catch (err) {
        console.error('❌ Failed to fetch diagram:', err)
        setError(err instanceof Error ? err.message : 'Failed to load diagram')
      } finally {
        setLoading(false)
      }
    }

    if (diagramId) {
      fetchDiagram()
    }
  }, [diagramId, loadDiagram])

  if (loading) {
    return (
      <div className={`space-y-4 p-4 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!diagramData) {
    return (
      <div className={className}>
        <Alert>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            No diagram data found for ID: {diagramId}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={className}>
      <DiagramCanvas 
        diagramId={diagramId}
        readOnly={readOnly}
        className="w-full h-full"
      />
    </div>
  )
}

export default DiagramViewer