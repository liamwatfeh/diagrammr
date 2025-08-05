'use client'

import React, { useEffect } from 'react'
import { useDiagramEditorStore } from '@/stores/diagram-editor-store'
import { aiResponseToReactFlow } from '@/lib/diagram/data-converter'
import DiagramCanvas from './diagram-canvas'
import type { AIGeneratedDiagram } from '@/lib/ai/schemas'

// Sample data for testing the canvas
const sampleDiagramData: AIGeneratedDiagram = {
  title: "Sample Process Flow",
  elements: [
    {
      type: "user_action",
      position: { x: 100, y: 100 },
      highLevelDescription: "User initiates process",
      technicalDescription: "User clicks start button to begin the workflow process"
    },
    {
      type: "process", 
      position: { x: 400, y: 100 },
      highLevelDescription: "Validate input",
      technicalDescription: "System validates user input and checks for required fields"
    },
    {
      type: "decision",
      position: { x: 700, y: 100 },
      highLevelDescription: "Is input valid?",
      technicalDescription: "Decision point to determine if input meets validation criteria"
    },
    {
      type: "process",
      position: { x: 700, y: 300 },
      highLevelDescription: "Process request",
      technicalDescription: "System processes the validated request and performs business logic"
    },
    {
      type: "data",
      position: { x: 1000, y: 300 },
      highLevelDescription: "Save to database",
      technicalDescription: "Persist processed data to the main database"
    },
    {
      type: "system",
      position: { x: 400, y: 300 },
      highLevelDescription: "Show error message",
      technicalDescription: "Display validation error message to user"
    }
  ],
  connections: [
    {
      sourceElementIndex: 0,
      targetElementIndex: 1,
      connectionType: "process_flow",
      label: "Start"
    },
    {
      sourceElementIndex: 1,
      targetElementIndex: 2,
      connectionType: "process_flow",
      label: "Submit"
    },
    {
      sourceElementIndex: 2,
      targetElementIndex: 3,
      connectionType: "process_flow",
      label: "Valid"
    },
    {
      sourceElementIndex: 2,
      targetElementIndex: 5,
      connectionType: "process_flow",
      label: "Invalid"
    },
    {
      sourceElementIndex: 3,
      targetElementIndex: 4,
      connectionType: "data_flow",
      label: "Store data"
    },
    {
      sourceElementIndex: 5,
      targetElementIndex: 0,
      connectionType: "trigger",
      label: "Retry"
    }
  ]
}

interface CanvasDemoProps {
  diagramId?: string
  className?: string
  readOnly?: boolean
}

export function CanvasDemo({ 
  diagramId = "demo-diagram", 
  className,
  readOnly = false 
}: CanvasDemoProps) {
  const { loadDiagram, setLoading } = useDiagramEditorStore()

  useEffect(() => {
    // Simulate loading
    setLoading(true)
    
    setTimeout(() => {
      // Convert sample data to React Flow format
      const { nodes, edges } = aiResponseToReactFlow(sampleDiagramData)
      
      // Load the diagram into the store
      loadDiagram(nodes, edges, {
        zoom: 1,
        pan: { x: 0, y: 0 },
        snapToGrid: true,
        gridSize: 20,
      })
      
      setLoading(false)
    }, 500) // Simulate loading delay
  }, [loadDiagram, setLoading])

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

export default CanvasDemo