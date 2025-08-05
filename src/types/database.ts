// Database Types for Diagrammr

export type ElementType = 'process' | 'decision' | 'data' | 'system' | 'user_action'
export type ConnectionType = 'data_flow' | 'process_flow' | 'dependency' | 'trigger'
export type DiagramStatus = 'draft' | 'ready' | 'archived'
export type ExportStatus = 'generating' | 'ready' | 'failed'
export type ExportType = 'gif' | 'png' | 'pdf'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Transcript {
  id: string
  user_id: string
  content: string
  title?: string
  client_name?: string
  notes?: string
  processed_at?: string
  processing_duration_ms?: number
  ai_confidence_score?: number
  word_count?: number
  technical_complexity_score?: number
  created_at: string
  updated_at: string
}

export interface Diagram {
  id: string
  user_id: string
  transcript_id: string
  title: string
  description?: string
  status: DiagramStatus
  version_number: number
  parent_diagram_id?: string
  presentation_settings: Record<string, any>
  element_count: number
  connection_count: number
  last_presented_at?: string
  presentation_count: number
  created_at: string
  updated_at: string
}

export interface DiagramElement {
  id: string
  diagram_id: string
  element_type: ElementType
  position_x: number
  position_y: number
  high_level_description: string
  technical_description: string
  custom_styling: Record<string, any>
  animation_order?: number
  created_at: string
  updated_at: string
}

export interface Connection {
  id: string
  diagram_id: string
  source_element_id: string
  target_element_id: string
  connection_type: ConnectionType
  label?: string
  styling: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Export {
  id: string
  diagram_id: string
  user_id: string
  file_type: ExportType
  file_path: string
  file_name: string
  file_size?: number
  export_settings: Record<string, any>
  status: ExportStatus
  generation_duration_ms?: number
  download_count: number
  last_downloaded_at?: string
  generated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  resource_type: string
  resource_id?: string
  metadata: Record<string, any>
  session_id?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface DailyAnalytics {
  id: string
  user_id: string
  date: string
  transcripts_created: number
  diagrams_created: number
  diagrams_presented: number
  exports_generated: number
  total_presentation_time_seconds: number
  active_clients: number
  created_at: string
}

export interface ClientProject {
  id: string
  user_id: string
  client_name: string
  total_diagrams: number
  total_exports: number
  total_presentations: number
  last_activity_at?: string
  first_created_at: string
  created_at: string
  updated_at: string
}

export interface SystemAnalytics {
  id: string
  date: string
  total_users: number
  active_users: number
  total_diagrams_created: number
  total_exports_generated: number
  total_presentations: number
  avg_processing_time_ms?: number
  success_rate?: number
  created_at: string
}

// Dashboard Analytics Types
export interface DashboardStats {
  total_diagrams: number
  active_clients: number
  total_exports: number
  recent_activity_count: number
  success_rate: number
}

// AI Generation Types
export interface AIGeneratedDiagram {
  title: string
  elements: {
    id: string
    type: ElementType
    position: { x: number; y: number }
    highLevelDescription: string
    technicalDescription: string
  }[]
  connections: {
    id: string
    sourceElementId: string
    targetElementId: string
    connectionType: ConnectionType
    label?: string
  }[]
}

// Form Types
export interface CreateDiagramForm {
  clientName: string
  projectTitle: string
  transcript: string
  notes?: string
}

// API Response Types
export interface APIResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ProcessingStatus {
  status: 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  estimatedTimeMs?: number
}