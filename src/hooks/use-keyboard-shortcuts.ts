'use client'

import { useHotkeys } from 'react-hotkeys-hook'
import { useDiagramEditorStore } from '@/stores/diagram-editor-store'

export interface KeyboardShortcutsOptions {
  enableOnFormTags?: boolean
  readOnly?: boolean
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { enableOnFormTags = true, readOnly = false } = options

  const {
    selectedNodes,
    selectedEdges,
    deleteNodes,
    deleteEdges,
    clearSelection,
    selectAll,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDiagramEditorStore()

  // Undo
  useHotkeys('ctrl+z, cmd+z', (e) => {
    if (readOnly) return
    e.preventDefault()
    if (canUndo()) {
      undo()
    }
  }, { enableOnFormTags })

  // Redo
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', (e) => {
    if (readOnly) return
    e.preventDefault()
    if (canRedo()) {
      redo()
    }
  }, { enableOnFormTags })

  // Delete selected elements
  useHotkeys('delete, backspace', (e) => {
    if (readOnly) return
    e.preventDefault()
    
    if (selectedNodes.length > 0) {
      deleteNodes(selectedNodes)
    }
    if (selectedEdges.length > 0) {
      deleteEdges(selectedEdges)
    }
  }, { enableOnFormTags })

  // Select all
  useHotkeys('ctrl+a, cmd+a', (e) => {
    e.preventDefault()
    selectAll()
  }, { enableOnFormTags })

  // Clear selection
  useHotkeys('escape', (e) => {
    e.preventDefault()
    clearSelection()
  }, { enableOnFormTags })

  // Copy (placeholder for future implementation)
  useHotkeys('ctrl+c, cmd+c', (e) => {
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      e.preventDefault()
      // TODO: Implement copy functionality
      console.log('Copy selected elements')
    }
  }, { enableOnFormTags })

  // Paste (placeholder for future implementation)
  useHotkeys('ctrl+v, cmd+v', (e) => {
    if (readOnly) return
    e.preventDefault()
    // TODO: Implement paste functionality
    console.log('Paste elements')
  }, { enableOnFormTags })

  // Duplicate (placeholder for future implementation)
  useHotkeys('ctrl+d, cmd+d', (e) => {
    if (readOnly) return
    if (selectedNodes.length > 0) {
      e.preventDefault()
      // TODO: Implement duplicate functionality
      console.log('Duplicate selected nodes')
    }
  }, { enableOnFormTags })

  return {
    shortcuts: {
      'Ctrl/Cmd + Z': 'Undo',
      'Ctrl/Cmd + Y': 'Redo', 
      'Ctrl/Cmd + A': 'Select All',
      'Delete/Backspace': 'Delete Selected',
      'Escape': 'Clear Selection',
      'Ctrl/Cmd + C': 'Copy (Coming Soon)',
      'Ctrl/Cmd + V': 'Paste (Coming Soon)',
      'Ctrl/Cmd + D': 'Duplicate (Coming Soon)',
    }
  }
}