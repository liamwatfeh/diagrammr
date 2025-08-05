import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Node, Edge, Viewport, XYPosition } from '@xyflow/react'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react'

// Types for our diagram state
export interface DiagramComment {
  id: string
  diagramId: string
  userId: string
  elementId?: string
  content: string
  position?: XYPosition
  isResolved: boolean
  threadId?: string
  createdAt: string
  updatedAt: string
}

export interface DiagramSession {
  id: string
  diagramId: string
  userId: string
  cursorPosition: XYPosition
  selectedElements: string[]
  isActive: boolean
  lastSeen: string
}

export interface DiagramSnapshot {
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  timestamp: number
  action: string
}

export interface CanvasSettings {
  zoom: number
  pan: XYPosition
  snapToGrid: boolean
  gridSize: number
}

export interface EditorSettings {
  showGrid: boolean
  showMinimap: boolean
  showControls: boolean
  autoSave: boolean
  autoSaveInterval: number
}

// Main store interface
interface DiagramEditorState {
  // Diagram data
  diagramId: string | null
  nodes: Node[]
  edges: Edge[]
  
  // Canvas state
  viewport: Viewport
  canvasSettings: CanvasSettings
  editorSettings: EditorSettings
  
  // Selection state
  selectedNodes: string[]
  selectedEdges: string[]
  
  // Editor state
  isEditing: boolean
  isDragging: boolean
  isConnecting: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  
  // History for undo/redo
  history: DiagramSnapshot[]
  historyIndex: number
  maxHistorySize: number
  
  // Collaboration
  activeSessions: DiagramSession[]
  comments: DiagramComment[]
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  
  // Actions for diagram management
  setDiagramId: (id: string) => void
  loadDiagram: (nodes: Node[], edges: Edge[], settings?: Partial<CanvasSettings>) => void
  
  // Node operations
  addNode: (node: Omit<Node, 'id'> & { id?: string }) => void
  updateNode: (id: string, updates: Partial<Node>) => void
  deleteNode: (id: string) => void
  deleteNodes: (ids: string[]) => void
  
  // Edge operations
  addEdge: (edge: Omit<Edge, 'id'> & { id?: string }) => void
  updateEdge: (id: string, updates: Partial<Edge>) => void
  deleteEdge: (id: string) => void
  deleteEdges: (ids: string[]) => void
  
  // React Flow event handlers
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  
  // Selection operations
  selectNodes: (ids: string[]) => void
  selectEdges: (ids: string[]) => void
  clearSelection: () => void
  selectAll: () => void
  
  // Viewport operations
  setViewport: (viewport: Viewport) => void
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void
  updateEditorSettings: (settings: Partial<EditorSettings>) => void
  
  // History operations
  saveToHistory: (action: string) => void
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  
  // Collaboration operations
  updateActiveSessions: (sessions: DiagramSession[]) => void
  addComment: (comment: Omit<DiagramComment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateComment: (id: string, updates: Partial<DiagramComment>) => void
  deleteComment: (id: string) => void
  
  // Save state management
  markSaved: () => void
  markUnsaved: () => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  
  // Utility actions
  reset: () => void
  getNodeById: (id: string) => Node | undefined
  getEdgeById: (id: string) => Edge | undefined
}

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Initial state
const initialState = {
  diagramId: null,
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  canvasSettings: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    snapToGrid: true,
    gridSize: 20,
  },
  editorSettings: {
    showGrid: true,
    showMinimap: true,
    showControls: true,
    autoSave: true,
    autoSaveInterval: 3000, // 3 seconds
  },
  selectedNodes: [],
  selectedEdges: [],
  isEditing: false,
  isDragging: false,
  isConnecting: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  activeSessions: [],
  comments: [],
  isLoading: false,
  isSaving: false,
}

export const useDiagramEditorStore = create<DiagramEditorState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Diagram management
      setDiagramId: (id: string) => {
        set((state) => {
          state.diagramId = id
        })
      },

      loadDiagram: (nodes: Node[], edges: Edge[], settings?: Partial<CanvasSettings>) => {
        set((state) => {
          state.nodes = nodes
          state.edges = edges
          state.selectedNodes = []
          state.selectedEdges = []
          state.hasUnsavedChanges = false
          state.lastSaved = new Date()
          
          if (settings) {
            Object.assign(state.canvasSettings, settings)
          }
          
          // Clear history when loading new diagram
          state.history = []
          state.historyIndex = -1
        })
      },

      // Node operations
      addNode: (nodeData) => {
        set((state) => {
          const node: Node = {
            id: nodeData.id || `node-${generateId()}`,
            ...nodeData,
          }
          state.nodes.push(node)
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Add Node')
      },

      updateNode: (id: string, updates: Partial<Node>) => {
        set((state) => {
          const nodeIndex = state.nodes.findIndex(n => n.id === id)
          if (nodeIndex !== -1) {
            Object.assign(state.nodes[nodeIndex], updates)
            state.hasUnsavedChanges = true
          }
        })
      },

      deleteNode: (id: string) => {
        set((state) => {
          state.nodes = state.nodes.filter(n => n.id !== id)
          state.edges = state.edges.filter(e => e.source !== id && e.target !== id)
          state.selectedNodes = state.selectedNodes.filter(nId => nId !== id)
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Delete Node')
      },

      deleteNodes: (ids: string[]) => {
        set((state) => {
          state.nodes = state.nodes.filter(n => !ids.includes(n.id))
          state.edges = state.edges.filter(e => !ids.includes(e.source) && !ids.includes(e.target))
          state.selectedNodes = state.selectedNodes.filter(nId => !ids.includes(nId))
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Delete Nodes')
      },

      // Edge operations
      addEdge: (edgeData) => {
        set((state) => {
          const edge: Edge = {
            id: edgeData.id || `edge-${generateId()}`,
            ...edgeData,
          }
          state.edges.push(edge)
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Add Edge')
      },

      updateEdge: (id: string, updates: Partial<Edge>) => {
        set((state) => {
          const edgeIndex = state.edges.findIndex(e => e.id === id)
          if (edgeIndex !== -1) {
            Object.assign(state.edges[edgeIndex], updates)
            state.hasUnsavedChanges = true
          }
        })
      },

      deleteEdge: (id: string) => {
        set((state) => {
          state.edges = state.edges.filter(e => e.id !== id)
          state.selectedEdges = state.selectedEdges.filter(eId => eId !== id)
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Delete Edge')
      },

      deleteEdges: (ids: string[]) => {
        set((state) => {
          state.edges = state.edges.filter(e => !ids.includes(e.id))
          state.selectedEdges = state.selectedEdges.filter(eId => !ids.includes(eId))
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Delete Edges')
      },

      // React Flow event handlers
      onNodesChange: (changes: NodeChange[]) => {
        set((state) => {
          state.nodes = applyNodeChanges(changes, state.nodes)
          
          // Check if any changes are position updates (dragging)
          const hasPositionChanges = changes.some(
            change => change.type === 'position' && change.dragging
          )
          
          if (hasPositionChanges) {
            state.isDragging = true
            state.hasUnsavedChanges = true
          } else if (state.isDragging) {
            state.isDragging = false
            get().saveToHistory('Move Nodes')
          }
        })
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set((state) => {
          state.edges = applyEdgeChanges(changes, state.edges)
          state.hasUnsavedChanges = true
        })
      },

      onConnect: (connection: Connection) => {
        set((state) => {
          state.edges = addEdge({
            ...connection,
            id: `edge-${generateId()}`,
          }, state.edges)
          state.hasUnsavedChanges = true
        })
        get().saveToHistory('Connect Nodes')
      },

      // Selection operations
      selectNodes: (ids: string[]) => {
        set((state) => {
          state.selectedNodes = ids
          state.selectedEdges = []
        })
      },

      selectEdges: (ids: string[]) => {
        set((state) => {
          state.selectedEdges = ids
          state.selectedNodes = []
        })
      },

      clearSelection: () => {
        set((state) => {
          state.selectedNodes = []
          state.selectedEdges = []
        })
      },

      selectAll: () => {
        set((state) => {
          state.selectedNodes = state.nodes.map(n => n.id)
          state.selectedEdges = state.edges.map(e => e.id)
        })
      },

      // Viewport operations
      setViewport: (viewport: Viewport) => {
        set((state) => {
          state.viewport = viewport
          state.canvasSettings.zoom = viewport.zoom
          state.canvasSettings.pan = { x: viewport.x, y: viewport.y }
        })
      },

      updateCanvasSettings: (settings: Partial<CanvasSettings>) => {
        set((state) => {
          Object.assign(state.canvasSettings, settings)
        })
      },

      updateEditorSettings: (settings: Partial<EditorSettings>) => {
        set((state) => {
          Object.assign(state.editorSettings, settings)
        })
      },

      // History operations
      saveToHistory: (action: string) => {
        set((state) => {
          const snapshot: DiagramSnapshot = {
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges)),
            viewport: { ...state.viewport },
            timestamp: Date.now(),
            action,
          }

          // Remove any history after current index
          state.history = state.history.slice(0, state.historyIndex + 1)
          
          // Add new snapshot
          state.history.push(snapshot)
          state.historyIndex = state.history.length - 1

          // Limit history size
          if (state.history.length > state.maxHistorySize) {
            state.history = state.history.slice(-state.maxHistorySize)
            state.historyIndex = state.history.length - 1
          }
        })
      },

      undo: () => {
        const state = get()
        if (!state.canUndo()) return false

        set((draft) => {
          draft.historyIndex -= 1
          const snapshot = draft.history[draft.historyIndex]
          draft.nodes = JSON.parse(JSON.stringify(snapshot.nodes))
          draft.edges = JSON.parse(JSON.stringify(snapshot.edges))
          draft.viewport = { ...snapshot.viewport }
          draft.hasUnsavedChanges = true
        })
        return true
      },

      redo: () => {
        const state = get()
        if (!state.canRedo()) return false

        set((draft) => {
          draft.historyIndex += 1
          const snapshot = draft.history[draft.historyIndex]
          draft.nodes = JSON.parse(JSON.stringify(snapshot.nodes))
          draft.edges = JSON.parse(JSON.stringify(snapshot.edges))
          draft.viewport = { ...snapshot.viewport }
          draft.hasUnsavedChanges = true
        })
        return true
      },

      canUndo: () => {
        const { historyIndex } = get()
        return historyIndex > 0
      },

      canRedo: () => {
        const { history, historyIndex } = get()
        return historyIndex < history.length - 1
      },

      clearHistory: () => {
        set((state) => {
          state.history = []
          state.historyIndex = -1
        })
      },

      // Collaboration operations
      updateActiveSessions: (sessions: DiagramSession[]) => {
        set((state) => {
          state.activeSessions = sessions
        })
      },

      addComment: (commentData) => {
        set((state) => {
          const comment: DiagramComment = {
            ...commentData,
            id: `comment-${generateId()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          state.comments.push(comment)
        })
      },

      updateComment: (id: string, updates: Partial<DiagramComment>) => {
        set((state) => {
          const commentIndex = state.comments.findIndex(c => c.id === id)
          if (commentIndex !== -1) {
            Object.assign(state.comments[commentIndex], {
              ...updates,
              updatedAt: new Date().toISOString(),
            })
          }
        })
      },

      deleteComment: (id: string) => {
        set((state) => {
          state.comments = state.comments.filter(c => c.id !== id)
        })
      },

      // Save state management
      markSaved: () => {
        set((state) => {
          state.hasUnsavedChanges = false
          state.lastSaved = new Date()
          state.isSaving = false
        })
      },

      markUnsaved: () => {
        set((state) => {
          state.hasUnsavedChanges = true
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      setSaving: (saving: boolean) => {
        set((state) => {
          state.isSaving = saving
        })
      },

      // Utility functions
      reset: () => {
        set(() => ({ ...initialState }))
      },

      getNodeById: (id: string) => {
        return get().nodes.find(n => n.id === id)
      },

      getEdgeById: (id: string) => {
        return get().edges.find(e => e.id === id)
      },
    })),
    {
      name: 'diagram-editor-store',
    }
  )
)

// Selector hooks for performance
export const useNodes = () => useDiagramEditorStore(state => state.nodes)
export const useEdges = () => useDiagramEditorStore(state => state.edges)
export const useViewport = () => useDiagramEditorStore(state => state.viewport)
export const useSelectedNodes = () => useDiagramEditorStore(state => state.selectedNodes)
export const useSelectedEdges = () => useDiagramEditorStore(state => state.selectedEdges)
export const useHasUnsavedChanges = () => useDiagramEditorStore(state => state.hasUnsavedChanges)
export const useCanvasSettings = () => useDiagramEditorStore(state => state.canvasSettings)
export const useEditorSettings = () => useDiagramEditorStore(state => state.editorSettings)
export const useIsLoading = () => useDiagramEditorStore(state => state.isLoading)
export const useIsSaving = () => useDiagramEditorStore(state => state.isSaving)
export const useActiveSessions = () => useDiagramEditorStore(state => state.activeSessions)
export const useComments = () => useDiagramEditorStore(state => state.comments)