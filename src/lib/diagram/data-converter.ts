import type { Node, Edge } from '@xyflow/react'
import type { AIGeneratedDiagram } from '@/lib/ai/schemas'
import type { Diagram, Element, Connection } from '@/types/database'

// Node type mapping
export const NODE_TYPE_MAP = {
  process: 'processNode',
  decision: 'decisionNode', 
  data: 'dataNode',
  system: 'systemNode',
  user_action: 'userActionNode',
} as const

// Edge type mapping
export const EDGE_TYPE_MAP = {
  data_flow: 'dataFlowEdge',
  process_flow: 'processFlowEdge',
  dependency: 'dependencyEdge',
  trigger: 'triggerEdge',
} as const

// Colors for different node types
export const NODE_COLORS = {
  process: {
    background: '#E3F2FD',
    border: '#1976D2',
    text: '#0D47A1'
  },
  decision: {
    background: '#FFF3E0',
    border: '#F57C00',
    text: '#E65100'
  },
  data: {
    background: '#E8F5E8',
    border: '#388E3C',
    text: '#1B5E20'
  },
  system: {
    background: '#F3E5F5',
    border: '#7B1FA2',
    text: '#4A148C'
  },
  user_action: {
    background: '#FCE4EC',
    border: '#C2185B',
    text: '#880E4F'
  }
} as const

// Edge colors for different connection types
export const EDGE_COLORS = {
  data_flow: '#1976D2',
  process_flow: '#388E3C',
  dependency: '#F57C00',
  trigger: '#7B1FA2'
} as const

/**
 * Convert AI-generated diagram to React Flow format
 */
export function aiResponseToReactFlow(aiResponse: AIGeneratedDiagram): { nodes: Node[], edges: Edge[] } {
  // Convert elements to nodes
  const nodes: Node[] = aiResponse.elements.map((element, index) => {
    const nodeType = NODE_TYPE_MAP[element.type] || 'processNode'
    const colors = NODE_COLORS[element.type] || NODE_COLORS.process

    return {
      id: `node-${index}`,
      type: nodeType,
      position: {
        x: element.position.x,
        y: element.position.y
      },
      data: {
        label: element.highLevelDescription,
        description: element.technicalDescription,
        elementType: element.type,
        originalIndex: index,
        colors: colors,
        // Additional data for editing
        isEditing: false,
        showDetails: false,
      },
      style: {
        backgroundColor: colors.background,
        border: `2px solid ${colors.border}`,
        borderRadius: element.type === 'decision' ? '50%' : '8px',
        color: colors.text,
        fontSize: '12px',
        width: element.type === 'decision' ? 120 : 200,
        height: element.type === 'decision' ? 120 : 80,
      },
      draggable: true,
      selectable: true,
      deletable: true,
    }
  })

  // Convert connections to edges  
  const edges: Edge[] = aiResponse.connections.map((connection, index) => {
    const sourceNode = nodes[connection.sourceElementIndex]
    const targetNode = nodes[connection.targetElementIndex]
    
    if (!sourceNode || !targetNode) {
      console.warn(`Invalid connection: source=${connection.sourceElementIndex}, target=${connection.targetElementIndex}`)
      return null
    }

    const edgeType = EDGE_TYPE_MAP[connection.connectionType] || 'processFlowEdge'
    const color = EDGE_COLORS[connection.connectionType] || EDGE_COLORS.process_flow

    return {
      id: `edge-${index}`,
      type: edgeType,
      source: sourceNode.id,
      target: targetNode.id,
      label: connection.label,
      data: {
        connectionType: connection.connectionType,
        originalIndex: index,
        color: color,
      },
      style: {
        stroke: color,
        strokeWidth: 2,
      },
      animated: connection.connectionType === 'data_flow',
      markerEnd: {
        type: 'arrowclosed',
        color: color,
      },
      labelStyle: {
        fontSize: '11px',
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.8,
      },
    }
  }).filter(Boolean) as Edge[]

  return { nodes, edges }
}

/**
 * Convert React Flow format to Supabase database format
 */
export function reactFlowToSupabase(
  nodes: Node[], 
  edges: Edge[],
  diagramId: string
): { elements: Omit<Element, 'id' | 'created_at' | 'updated_at'>[], connections: Omit<Connection, 'id' | 'created_at' | 'updated_at'>[] } {
  
  // Create node ID mapping for edges
  const nodeIdMap = new Map<string, number>()
  
  const elements = nodes.map((node, index) => {
    nodeIdMap.set(node.id, index)
    
    // Extract element type from node data or type
    let elementType: 'process' | 'decision' | 'data' | 'system' | 'user_action' = 'process'
    if (node.data?.elementType) {
      elementType = node.data.elementType
    } else if (node.type) {
      // Reverse map from node type to element type
      const typeEntry = Object.entries(NODE_TYPE_MAP).find(([_, nodeType]) => nodeType === node.type)
      if (typeEntry) {
        elementType = typeEntry[0] as typeof elementType
      }
    }

    return {
      diagram_id: diagramId,
      element_type: elementType,
      position_x: Math.round(node.position.x),
      position_y: Math.round(node.position.y),
      high_level_description: node.data?.label || 'Untitled Element',
      technical_description: node.data?.description || node.data?.label || 'No description',
      custom_styling: {
        width: node.style?.width || (node.type === 'decisionNode' ? 120 : 200),
        height: node.style?.height || (node.type === 'decisionNode' ? 120 : 80),
        backgroundColor: node.style?.backgroundColor,
        borderColor: node.style?.borderColor,
        borderRadius: node.style?.borderRadius,
        fontSize: node.style?.fontSize,
      },
      animation_order: index + 1, // For presentation ordering
    }
  })

  const connections = edges.map((edge) => {
    const sourceIndex = nodeIdMap.get(edge.source)
    const targetIndex = nodeIdMap.get(edge.target)
    
    if (sourceIndex === undefined || targetIndex === undefined) {
      console.warn(`Edge ${edge.id} has invalid source or target`)
      return null
    }

    // Extract connection type from edge data or type
    let connectionType: 'data_flow' | 'process_flow' | 'dependency' | 'trigger' = 'process_flow'
    if (edge.data?.connectionType) {
      connectionType = edge.data.connectionType
    } else if (edge.type) {
      // Reverse map from edge type to connection type
      const typeEntry = Object.entries(EDGE_TYPE_MAP).find(([_, edgeType]) => edgeType === edge.type)
      if (typeEntry) {
        connectionType = typeEntry[0] as typeof connectionType
      }
    }

    return {
      diagram_id: diagramId,
      source_element_id: `element-${sourceIndex}`, // Will be replaced with actual UUIDs in API
      target_element_id: `element-${targetIndex}`, // Will be replaced with actual UUIDs in API
      connection_type: connectionType,
      label: edge.label || null,
      styling: {
        stroke: edge.style?.stroke,
        strokeWidth: edge.style?.strokeWidth,
        animated: edge.animated,
        markerEnd: edge.markerEnd,
      },
    }
  }).filter(Boolean) as Omit<Connection, 'id' | 'created_at' | 'updated_at'>[]

  return { elements, connections }
}

/**
 * Convert Supabase database format to React Flow format
 */
export function supabaseToReactFlow(
  elements: Element[], 
  connections: Connection[]
): { nodes: Node[], edges: Edge[] } {
  
  // Create element ID to node ID mapping
  const elementIdToNodeId = new Map<string, string>()
  
  const nodes: Node[] = elements.map((element, index) => {
    const nodeId = `node-${index}-${element.id}`
    elementIdToNodeId.set(element.id, nodeId)
    
    const nodeType = NODE_TYPE_MAP[element.element_type] || 'processNode'
    const colors = NODE_COLORS[element.element_type] || NODE_COLORS.process

    // Parse custom styling
    const customStyle = element.custom_styling || {}
    
    return {
      id: nodeId,
      type: nodeType,
      position: {
        x: element.position_x,
        y: element.position_y
      },
      data: {
        label: element.high_level_description,
        description: element.technical_description,
        elementType: element.element_type,
        elementId: element.id, // Store original database ID
        colors: colors,
        isEditing: false,
        showDetails: false,
      },
      style: {
        backgroundColor: customStyle.backgroundColor || colors.background,
        border: `2px solid ${customStyle.borderColor || colors.border}`,
        borderRadius: customStyle.borderRadius || (element.element_type === 'decision' ? '50%' : '8px'),
        color: colors.text,
        fontSize: customStyle.fontSize || '12px',
        width: customStyle.width || (element.element_type === 'decision' ? 120 : 200),
        height: customStyle.height || (element.element_type === 'decision' ? 120 : 80),
      },
      draggable: true,
      selectable: true,
      deletable: true,
    }
  })

  const edges: Edge[] = connections.map((connection, index) => {
    const sourceNodeId = elementIdToNodeId.get(connection.source_element_id)
    const targetNodeId = elementIdToNodeId.get(connection.target_element_id)
    
    if (!sourceNodeId || !targetNodeId) {
      console.warn(`Connection ${connection.id} has invalid source or target element`)
      return null
    }

    const edgeType = EDGE_TYPE_MAP[connection.connection_type] || 'processFlowEdge'
    const color = EDGE_COLORS[connection.connection_type] || EDGE_COLORS.process_flow

    // Parse custom styling
    const customStyle = connection.styling || {}

    return {
      id: `edge-${index}-${connection.id}`,
      type: edgeType,
      source: sourceNodeId,
      target: targetNodeId,
      label: connection.label,
      data: {
        connectionType: connection.connection_type,
        connectionId: connection.id, // Store original database ID
        color: customStyle.stroke || color,
      },
      style: {
        stroke: customStyle.stroke || color,
        strokeWidth: customStyle.strokeWidth || 2,
      },
      animated: customStyle.animated || connection.connection_type === 'data_flow',
      markerEnd: customStyle.markerEnd || {
        type: 'arrowclosed',
        color: customStyle.stroke || color,
      },
      labelStyle: {
        fontSize: '11px',
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.8,
      },
    }
  }).filter(Boolean) as Edge[]

  return { nodes, edges }
}

/**
 * Generate layout positions for nodes using a simple force-directed algorithm
 */
export function generateLayout(nodes: Node[], edges: Edge[]): Node[] {
  // Simple grid layout for now - can be enhanced with proper force-directed algorithm
  const gridSize = Math.ceil(Math.sqrt(nodes.length))
  const spacing = 250
  const startX = 100
  const startY = 100

  return nodes.map((node, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    
    return {
      ...node,
      position: {
        x: startX + col * spacing,
        y: startY + row * spacing,
      }
    }
  })
}

/**
 * Validate node and edge data
 */
export function validateDiagramData(nodes: Node[], edges: Edge[]): { isValid: boolean, errors: string[] } {
  const errors: string[] = []
  
  // Validate nodes
  const nodeIds = new Set<string>()
  nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Node at index ${index} is missing an ID`)
    } else if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`)
    } else {
      nodeIds.add(node.id)
    }
    
    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      errors.push(`Node ${node.id} has invalid position`)
    }
    
    if (!node.data?.label) {
      errors.push(`Node ${node.id} is missing a label`)
    }
  })
  
  // Validate edges
  const edgeIds = new Set<string>()
  edges.forEach((edge, index) => {
    if (!edge.id) {
      errors.push(`Edge at index ${index} is missing an ID`)
    } else if (edgeIds.has(edge.id)) {
      errors.push(`Duplicate edge ID: ${edge.id}`)
    } else {
      edgeIds.add(edge.id)
    }
    
    if (!edge.source || !nodeIds.has(edge.source)) {
      errors.push(`Edge ${edge.id} has invalid source: ${edge.source}`)
    }
    
    if (!edge.target || !nodeIds.has(edge.target)) {
      errors.push(`Edge ${edge.id} has invalid target: ${edge.target}`)
    }
    
    if (edge.source === edge.target) {
      errors.push(`Edge ${edge.id} is a self-loop`)
    }
  })
  
  return { 
    isValid: errors.length === 0, 
    errors 
  }
}

/**
 * Calculate diagram bounds
 */
export function getDiagramBounds(nodes: Node[]): { x: number, y: number, width: number, height: number } {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }
  
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  
  nodes.forEach(node => {
    const nodeWidth = (node.style?.width as number) || 200
    const nodeHeight = (node.style?.height as number) || 80
    
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + nodeWidth)
    maxY = Math.max(maxY, node.position.y + nodeHeight)
  })
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}