'use client'

import React, { memo } from 'react'
import { 
  getSmoothStepPath, 
  EdgeLabelRenderer, 
  type EdgeProps,
  type Edge 
} from '@xyflow/react'

interface BaseEdgeData {
  connectionType?: 'data_flow' | 'process_flow' | 'dependency' | 'trigger'
  color?: string
}

export interface BaseEdgeProps extends EdgeProps {
  data?: BaseEdgeData
}

function BaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  label,
  labelStyle,
  labelBgStyle,
  selected,
}: BaseEdgeProps) {
  const { connectionType = 'process_flow', color = '#1976D2' } = data || {}

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Different stroke patterns for different connection types
  const getStrokePattern = () => {
    switch (connectionType) {
      case 'data_flow':
        return 'none' // Solid line
      case 'process_flow':
        return 'none' // Solid line
      case 'dependency':
        return '5,5' // Dashed line
      case 'trigger':
        return '2,3' // Dotted line
      default:
        return 'none'
    }
  }

  // Animation for data flow
  const isAnimated = connectionType === 'data_flow'

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: color,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: getStrokePattern(),
        }}
        className={`react-flow__edge-path ${isAnimated ? 'animate-pulse' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* Animated flow indicator for data flow edges */}
      {isAnimated && (
        <circle
          r="3"
          fill={color}
          className="animate-pulse"
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}

      {/* Edge label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 11,
              fontWeight: 500,
              pointerEvents: 'all',
              ...labelStyle,
            }}
            className="nodrag nopan bg-background px-2 py-1 rounded border shadow-sm"
          >
            <div 
              style={{
                ...labelBgStyle,
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
              className="px-2 py-1 rounded text-xs"
            >
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Connection type indicator */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceX + (targetX - sourceX) * 0.2}px,${sourceY + (targetY - sourceY) * 0.2}px)`,
            pointerEvents: 'none',
          }}
        >
          <div 
            className="w-2 h-2 rounded-full opacity-60"
            style={{ backgroundColor: color }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(BaseEdge)