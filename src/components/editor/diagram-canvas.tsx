'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useDiagramEditorStore } from '@/stores/diagram-editor-store'
import { useHotkeys } from 'react-hotkeys-hook'
import { cn } from '@/lib/utils'
import BaseNode from './nodes/base-node'
import BaseEdge from './edges/base-edge'

// Node and Edge types - using base components for now
const nodeTypes = {
  processNode: BaseNode,
  decisionNode: BaseNode,
  dataNode: BaseNode,
  systemNode: BaseNode,
  userActionNode: BaseNode,
  // Fallback for default nodes
  default: BaseNode,
}

const edgeTypes = {
  dataFlowEdge: BaseEdge,
  processFlowEdge: BaseEdge,
  dependencyEdge: BaseEdge,
  triggerEdge: BaseEdge,
  // Fallback for default edges
  default: BaseEdge,
}

interface DiagramCanvasProps {
  diagramId: string
  className?: string
  readOnly?: boolean
}

function DiagramCanvasInner({ diagramId, className, readOnly = false }: DiagramCanvasProps) {
  const reactFlowInstance = useReactFlow()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Store selectors
  const nodes = useDiagramEditorStore(state => state.nodes)
  const edges = useDiagramEditorStore(state => state.edges)
  const viewport = useDiagramEditorStore(state => state.viewport)
  const canvasSettings = useDiagramEditorStore(state => state.canvasSettings)
  const editorSettings = useDiagramEditorStore(state => state.editorSettings)
  const selectedNodes = useDiagramEditorStore(state => state.selectedNodes)
  const selectedEdges = useDiagramEditorStore(state => state.selectedEdges)
  const isLoading = useDiagramEditorStore(state => state.isLoading)

  // Store actions
  const {
    onNodesChange,
    onEdgesChange,
    onConnect,
    setViewport,
    selectNodes,
    selectEdges,
    clearSelection,
    selectAll,
    deleteNodes,
    deleteEdges,
    undo,
    redo,
    canUndo,
    canRedo,
    setDiagramId,
  } = useDiagramEditorStore()

  // Initialize diagram ID
  useEffect(() => {
    if (diagramId) {
      setDiagramId(diagramId)
    }
  }, [diagramId, setDiagramId])

  // Handle selection changes
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
      const nodeIds = selectedNodes.map(node => node.id)
      const edgeIds = selectedEdges.map(edge => edge.id)
      
      if (nodeIds.length > 0) {
        selectNodes(nodeIds)
      } else if (edgeIds.length > 0) {
        selectEdges(edgeIds)
      } else {
        clearSelection()
      }
    },
    [selectNodes, selectEdges, clearSelection]
  )

  // Handle viewport changes
  const onViewportChange = useCallback(
    (newViewport: Viewport) => {
      setViewport(newViewport)
    },
    [setViewport]
  )

  // Handle node drag end - save to history
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node, nodes: Node[]) => {
      // History is automatically saved in the store's onNodesChange
    },
    []
  )

  // Handle edge updates (for reconnection)
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // TODO: Implement edge reconnection
      console.log('Edge reconnect:', oldEdge, newConnection)
    },
    []
  )

  // Keyboard shortcuts
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault()
    if (canUndo()) {
      undo()
    }
  }, { enableOnFormTags: true })

  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault()
    if (canRedo()) {
      redo()
    }
  }, { enableOnFormTags: true })

  useHotkeys('delete, backspace', (e) => {
    e.preventDefault()
    if (selectedNodes.length > 0) {
      deleteNodes(selectedNodes)
    }
    if (selectedEdges.length > 0) {
      deleteEdges(selectedEdges)
    }
  }, { enableOnFormTags: true })

  useHotkeys('ctrl+a, cmd+a', (e) => {
    e.preventDefault()
    selectAll()
  }, { enableOnFormTags: true })

  useHotkeys('escape', (e) => {
    e.preventDefault()
    clearSelection()
  }, { enableOnFormTags: true })

  // Fit view on load
  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 50, duration: 300 })
      }, 100)
    }
  }, [nodes.length, reactFlowInstance])

  // Handle pane click to clear selection
  const onPaneClick = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  // Prevent default drag behavior on edges
  const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
    // TODO: Implement edge hover effects
  }, [])

  const onEdgeMouseLeave = useCallback((event: React.MouseEvent, edge: Edge) => {
    // TODO: Implement edge hover effects
  }, [])

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center w-full h-full bg-background",
        className
      )}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading diagram...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={canvasRef}
      className={cn("w-full h-full relative bg-background", className)}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onSelectionChange={onSelectionChange}
        onViewportChange={onViewportChange}
        onNodeDragStop={onNodeDragStop}
        onReconnect={onReconnect}
        onPaneClick={onPaneClick}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        defaultViewport={viewport}
        minZoom={0.1}
        maxZoom={4}
        snapToGrid={canvasSettings.snapToGrid}
        snapGrid={[canvasSettings.gridSize, canvasSettings.gridSize]}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null} // We handle deletion with our own shortcuts
        multiSelectionKeyCode="Shift"
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScrollMode="vertical"
        panOnScrollSpeed={0.5}
        zoomOnDoubleClick={false}
        className="bg-background"
        fitView={false}
      >
        {/* Background */}
        {editorSettings.showGrid && (
          <Background
            variant="lines"
            gap={canvasSettings.gridSize}
            size={1}
            className="bg-background"
            style={{
              backgroundColor: 'hsl(var(--background))',
            }}
          />
        )}

        {/* MiniMap */}
        {editorSettings.showMinimap && (
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            className="bg-background border border-border rounded-lg shadow-sm"
            style={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }}
            nodeColor={(node) => {
              if (selectedNodes.includes(node.id)) {
                return 'hsl(var(--primary))'
              }
              return node.style?.backgroundColor || 'hsl(var(--muted))'
            }}
            maskColor="hsl(var(--background) / 0.6)"
          />
        )}

        {/* Controls */}
        {editorSettings.showControls && (
          <Controls
            position="bottom-left"
            className="bg-background border border-border rounded-lg shadow-sm"
            style={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }}
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
        )}

        {/* Info Panel */}
        <Panel position="top-left" className="pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Nodes: {nodes?.length || 0}</div>
              <div>Edges: {edges?.length || 0}</div>
              {(selectedNodes?.length || 0) > 0 && (
                <div>Selected: {selectedNodes?.length || 0} nodes</div>
              )}
              {(selectedEdges?.length || 0) > 0 && (
                <div>Selected: {selectedEdges?.length || 0} edges</div>
              )}
            </div>
          </div>
        </Panel>

        {/* Keyboard Shortcuts Panel */}
        <Panel position="top-right" className="pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="font-medium mb-2">Shortcuts</div>
              <div>⌘/Ctrl + Z: Undo</div>
              <div>⌘/Ctrl + Y: Redo</div>
              <div>⌘/Ctrl + A: Select All</div>
              <div>Del/Backspace: Delete</div>
              <div>Esc: Clear Selection</div>
              <div>Shift + Click: Multi-select</div>
            </div>
          </div>
        </Panel>

        {/* Read-only indicator */}
        {readOnly && (
          <Panel position="top-center" className="pointer-events-none">
            <div className="bg-muted/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-sm">
              <div className="text-xs text-muted-foreground font-medium">
                Read-only mode
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}

// Main component with ReactFlowProvider
export function DiagramCanvas({ diagramId, className, readOnly = false }: DiagramCanvasProps) {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner 
        diagramId={diagramId} 
        className={className} 
        readOnly={readOnly} 
      />
    </ReactFlowProvider>
  )
}

export default DiagramCanvas