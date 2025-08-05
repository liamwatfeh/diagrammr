'use client'

import React, { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'

interface BaseNodeData {
  label: string
  description?: string
  elementType?: 'process' | 'decision' | 'data' | 'system' | 'user_action'
  colors?: {
    background: string
    border: string
    text: string
  }
  isEditing?: boolean
  showDetails?: boolean
}

export interface BaseNodeProps extends NodeProps {
  data: BaseNodeData
}

function BaseNode({ data, selected, dragging, id }: BaseNodeProps) {
  const {
    label,
    description,
    elementType = 'process',
    colors = {
      background: '#E3F2FD',
      border: '#1976D2',
      text: '#0D47A1'
    },
    isEditing = false,
    showDetails = false,
  } = data

  const isDecision = elementType === 'decision'
  const isData = elementType === 'data'

  return (
    <div
      className={cn(
        "relative border-2 transition-all duration-200",
        {
          // Shape variants
          "rounded-full": isDecision,
          "rounded-lg": !isDecision && !isData,
          "rounded-t-lg rounded-b-none": isData,
          
          // Selection state
          "ring-2 ring-primary ring-offset-2": selected,
          "shadow-lg": selected || dragging,
          "shadow-md": !selected && !dragging,
          
          // Interaction states
          "cursor-move": !isEditing,
          "scale-105": dragging,
        }
      )}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
        minWidth: isDecision ? '120px' : '200px',
        minHeight: isDecision ? '120px' : '80px',
        width: isDecision ? '120px' : '200px',
        height: isDecision ? '120px' : '80px',
      }}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 bg-background"
        style={{ borderColor: colors.border }}
      />

      {/* Content */}
      <div className={cn(
        "flex flex-col items-center justify-center h-full p-3 text-center",
        {
          "p-2": isDecision,
        }
      )}>
        {/* Label */}
        <div className={cn(
          "font-medium text-sm leading-tight",
          {
            "text-xs": isDecision,
          }
        )}>
          {label}
        </div>

        {/* Description (if show details is enabled) */}
        {showDetails && description && (
          <div className="text-xs mt-2 opacity-75 line-clamp-2">
            {description}
          </div>
        )}

        {/* Element type indicator */}
        <div className="absolute top-1 right-1">
          <div className={cn(
            "w-2 h-2 rounded-full opacity-50",
            {
              "bg-blue-500": elementType === 'process',
              "bg-orange-500": elementType === 'decision',
              "bg-green-500": elementType === 'data',
              "bg-purple-500": elementType === 'system',
              "bg-pink-500": elementType === 'user_action',
            }
          )} />
        </div>
      </div>

      {/* Data shape extension */}
      {isData && (
        <div
          className="absolute bottom-0 left-0 right-0 h-4 border-l-2 border-r-2 border-b-2 rounded-b-lg"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        />
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 bg-background"
        style={{ borderColor: colors.border }}
      />

      {/* Side handles for more connection options */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 bg-background"
        style={{ borderColor: colors.border }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 bg-background"
        style={{ borderColor: colors.border }}
      />
    </div>
  )
}

export default memo(BaseNode)