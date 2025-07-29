# Diagramr - Technical Implementation Specification

## Document Purpose

This document provides comprehensive technical implementation specifications for Diagramr, Brilliant Noise's internal tool for transforming technical conversation transcripts into branded, animated flowcharts for client presentations. This serves as the definitive blueprint for AI code editors to build a production-ready application that supports the complete workflow: transcript input → AI generation → manual editing → presentation → export.

---

## 1. ARCHITECTURE OVERVIEW

### Application Structure

**Next.js App Router Organization:**

```
/app
├── page.tsx                    # Dashboard with project list
├── create/
│   └── page.tsx               # New diagram creation workflow
├── project/
│   └── [id]/page.tsx          # Individual project view
├── editor/
│   └── [id]/page.tsx          # Diagram editor interface
├── present/
│   └── [id]/page.tsx          # Full-screen presentation mode
└── api/
    ├── ai/
    │   └── analyze/route.ts   # AI transcript processing
    ├── diagrams/
    │   ├── route.ts           # CRUD operations
    │   └── [id]/route.ts      # Individual diagram operations
    └── exports/
        └── route.ts           # Export generation
```

**Component Architecture:**

- **Page Components:** Handle routing and top-level state
- **Feature Components:** Contain business logic (DiagramEditor, TranscriptProcessor, PresentationMode)
- **UI Components:** Reusable shadcn/ui components with brand customization
- **Canvas Components:** Diagram rendering and interaction logic

### Data Flow Patterns

**Core Application Flow:**

1. **Transcript Input** → Form validation (React Hook Form + Zod) → API submission
2. **AI Processing** → OpenAI API call → Structured diagram data generation
3. **Diagram State** → Zustand store management → Real-time canvas updates
4. **Data Persistence** → SWR mutations → Supabase database storage
5. **Export Generation** → Canvas-to-image conversion → Supabase file storage

**State Management Strategy:**

- **Zustand:** Diagram editor state (elements, connections, selections, canvas view)
- **SWR:** Server data caching (projects, diagrams, user preferences)
- **React Hook Form:** Form state management with Zod validation
- **Local State:** UI-only state (modals, loading states, temporary selections)

### Authentication & Security

**Supabase Auth Integration:**

- Row Level Security (RLS) policies for user data isolation
- Session management with automatic token refresh
- Protected API routes using Supabase JWT verification

---

## 2. AI INTEGRATION & PROCESSING

### Recommended AI SDK

**Primary Choice: OpenAI SDK**

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

**Rationale:** OpenAI's structured output capabilities and function calling are ideal for parsing technical conversations and generating consistent diagram data structures.

### AI Processing Workflow

**Transcript Analysis Pipeline:**

1. **Content Validation:** Verify transcript contains technical discussion
2. **System Extraction:** Identify technical systems, processes, and relationships
3. **Diagram Generation:** Create structured data for max 25 elements
4. **Description Generation:** Produce dual-level descriptions (high-level + technical)

**AI Prompt Strategy:**

```typescript
const DIAGRAM_GENERATION_PROMPT = `
Analyze this technical conversation transcript and generate a flowchart diagram.

Requirements:
- Maximum 25 elements total
- Each element needs: type (process/decision/data/system/user_action), high-level description (max 255 chars), technical description
- Generate logical connections between elements
- Focus on systems and data flow, not business processes
- Output as structured JSON

Transcript: {transcript}
`
```

### Structured Output Schema

**Generated Diagram Data Structure:**

```typescript
interface AIGeneratedDiagram {
  title: string
  elements: {
    id: string
    type: 'process' | 'decision' | 'data' | 'system' | 'user_action'
    position: { x: number; y: number }
    highLevelDescription: string
    technicalDescription: string
  }[]
  connections: {
    id: string
    sourceElementId: string
    targetElementId: string
    connectionType: 'data_flow' | 'process_flow' | 'dependency' | 'trigger'
    label?: string
  }[]
}
```

---

## 3. DATABASE IMPLEMENTATION

### Supabase Schema Design

**Core Tables:**

```sql
-- Users table (managed by Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title VARCHAR(255),
  client_name VARCHAR(100),
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagrams table
CREATE TABLE diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status diagram_status DEFAULT 'draft',
  version_number INTEGER DEFAULT 1,
  parent_diagram_id UUID REFERENCES diagrams(id),
  presentation_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom types
CREATE TYPE element_type AS ENUM ('process', 'decision', 'data', 'system', 'user_action');
CREATE TYPE connection_type AS ENUM ('data_flow', 'process_flow', 'dependency', 'trigger');
CREATE TYPE diagram_status AS ENUM ('draft', 'ready', 'archived');

-- Elements table
CREATE TABLE elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
  element_type element_type NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  high_level_description VARCHAR(255) NOT NULL,
  technical_description TEXT NOT NULL,
  custom_styling JSONB,
  animation_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connections table
CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
  source_element_id UUID REFERENCES elements(id) ON DELETE CASCADE,
  target_element_id UUID REFERENCES elements(id) ON DELETE CASCADE,
  connection_type connection_type NOT NULL,
  label VARCHAR(100),
  styling JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exports table
CREATE TABLE exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
  file_type VARCHAR(10) NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER,
  export_settings JSONB,
  status VARCHAR(20) DEFAULT 'generating',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

**User Data Isolation:**

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can access own data" ON transcripts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access own diagrams" ON diagrams
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

### Storage Configuration

**Supabase Storage for Exports:**

```sql
-- Create storage bucket for diagram exports
INSERT INTO storage.buckets (id, name, public) VALUES ('diagram-exports', 'diagram-exports', true);

-- Storage policy for user exports
CREATE POLICY "Users can upload exports" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'diagram-exports' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 4. API DESIGN & INTEGRATION

### Supabase Client Configuration

**Client Setup:**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe client with generated types
export type Database = // Generated from Supabase CLI
```

### SWR Data Fetching Patterns

**Project Data Management:**

```typescript
// Custom SWR hooks for type-safe data fetching
export function useProjects() {
  return useSWR('projects', async () => {
    const { data, error } = await supabase
      .from('diagrams')
      .select(
        `
        id,
        title,
        status,
        created_at,
        updated_at,
        transcripts(client_name)
      `
      )
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  })
}

export function useDiagram(id: string) {
  return useSWR(`diagram-${id}`, async () => {
    const { data, error } = await supabase
      .from('diagrams')
      .select(
        `
        *,
        elements(*),
        connections(*),
        exports(*)
      `
      )
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  })
}
```

### Form Handling with React Hook Form + Zod

**Transcript Input Validation:**

```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const transcriptSchema = z.object({
  title: z.string().min(1, 'Project name required').max(255),
  clientName: z.string().max(100).optional(),
  content: z.string().min(50, 'Transcript must be at least 50 characters'),
  notes: z.string().optional(),
})

type TranscriptFormData = z.infer<typeof transcriptSchema>

export function TranscriptForm() {
  const form = useForm<TranscriptFormData>({
    resolver: zodResolver(transcriptSchema),
  })

  const onSubmit = async (data: TranscriptFormData) => {
    // Submit to AI processing endpoint
  }
}
```

### Error Handling Patterns

**Consistent Error Management:**

```typescript
// Custom error boundary for diagram editor
export class DiagramErrorBoundary extends React.Component {
  // Handle canvas rendering errors gracefully
}

// API error handling utility
export async function handleSupabaseError<T>(
  operation: () => Promise<{ data: T; error: any }>
) {
  const { data, error } = await operation()
  if (error) {
    // Log to Sentry, show user-friendly message
    throw new Error(getErrorMessage(error))
  }
  return data
}
```

---

## 5. VISUAL IDENTITY & DESIGN SYSTEM

### Brand Implementation

**Technical Authority Aesthetic:**

- **Primary Philosophy:** Clean, precise, and sophisticated design emphasizing technical expertise
- **Visual Approach:** Sharp contrasts, professional typography, structured layouts
- **Color Strategy:** Existing blue-based palette (#3b82f6) conveys trust and technical competence
- **Presentation Impact:** Diagrams should look like they came from a premium technical consultancy

### Color Palette Specification

**Using Existing CSS Variables:**

**Primary Colors:**

- **Primary Blue:** `var(--primary)` - #3b82f6 (used for CTAs, active states, brand accent)
- **Primary Foreground:** `var(--primary-foreground)` - #ffffff (text on primary background)

**Interface Colors:**

- **Background:** `var(--background)` - #ffffff (light) / #171717 (dark)
- **Foreground:** `var(--foreground)` - #333333 (light) / #e5e5e5 (dark)
- **Card:** `var(--card)` - Clean surfaces for project cards and editor panels
- **Border:** `var(--border)` - Subtle separation elements

**Semantic Colors:**

- **Muted:** `var(--muted)` - Background for less important content
- **Accent:** `var(--accent)` - Highlighting and secondary actions
- **Destructive:** `var(--destructive)` - #ef4444 (delete operations, errors)

### Typography System

**Font Stack Implementation:**

```css
/* Primary font for interface */
.font-sans {
  font-family: var(--font-sans);
} /* Inter */

/* Technical documentation and code */
.font-mono {
  font-family: var(--font-mono);
} /* JetBrains Mono */

/* Presentation headings */
.font-serif {
  font-family: var(--font-serif);
} /* Source Serif 4 */
```

**Typography Scale:**

- **Headings:** Source Serif 4 for formal presentation titles
- **Interface:** Inter for all UI elements, descriptions, and navigation
- **Technical Details:** JetBrains Mono for element IDs, technical specifications

### Diagram Visual Style

**Element Styling:**

- **Process Elements:** Rounded rectangles with primary blue borders
- **Decision Elements:** Diamond shapes with accent colors
- **System Elements:** Bold rectangular borders indicating technical infrastructure
- **Data Elements:** Cylinder shapes with muted backgrounds
- **User Action Elements:** Rounded rectangles with interactive styling

**Connection Styling:**

- **Data Flow:** Solid arrows with primary blue color
- **Process Flow:** Dashed lines indicating sequence
- **Dependencies:** Dotted lines with subdued colors
- **Triggers:** Bold arrows with accent colors

**Animation Principles:**

- **Smooth Transitions:** 300ms ease-in-out for element reveals
- **Sequential Reveal:** Elements appear in logical flow order
- **Professional Pacing:** Balanced timing suitable for client explanations
- **Focus Management:** Clear visual hierarchy during animation

---

## 6. COMPONENT LIBRARY SPECIFICATION

### Core shadcn/ui Components

**Form Components:**

```typescript
// Transcript input form
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Usage pattern for transcript input
<Form {...form}>
  <FormField
    control={form.control}
    name="content"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Technical Conversation Transcript</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Paste your technical conversation here..."
            className="min-h-[200px] font-mono text-sm"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

**Layout Components:**

```typescript
// Project dashboard cards
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/ui/card';

// Project card implementation
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>{project.title}</CardTitle>
    <CardDescription>
      {project.transcripts?.client_name && `Client: ${project.transcripts.client_name}`}
    </CardDescription>
    <CardAction>
      <Button size="sm" variant="outline">
        <PresentationChartBarIcon />
        Present
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Project preview thumbnail */}
  </CardContent>
</Card>
```

**Dialog Components:**

```typescript
// Modal dialogs for workflows
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Export generation modal
<Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Export Diagram</DialogTitle>
      <DialogDescription>
        Generate presentation files for client sharing
      </DialogDescription>
    </DialogHeader>
    {/* Export options */}
  </DialogContent>
</Dialog>
```

### Custom Component Extensions

**DiagramCanvas Component:**

```typescript
// Custom diagram editor built on HTML5 Canvas
interface DiagramCanvasProps {
  elements: DiagramElement[]
  connections: DiagramConnection[]
  onElementSelect: (element: DiagramElement) => void
  onElementUpdate: (element: DiagramElement) => void
  presentationMode?: boolean
}

export function DiagramCanvas({
  elements,
  connections,
  onElementSelect,
  onElementUpdate,
  presentationMode = false,
}: DiagramCanvasProps) {
  // Canvas rendering logic with brand styling
}
```

**ProjectBrowser Component:**

```typescript
// Client-organized project navigation
interface ProjectBrowserProps {
  projects: Project[]
  groupBy: 'client' | 'date' | 'status'
  onProjectSelect: (project: Project) => void
}

export function ProjectBrowser({
  projects,
  groupBy,
  onProjectSelect,
}: ProjectBrowserProps) {
  // Organized project display using Cards
}
```

### Icon Implementation

**Essential Heroicons:**

```typescript
// Import necessary icons
import {
  PencilIcon,           // Edit mode
  PresentationChartBarIcon,  // Presentation mode
  PlusIcon,             // Add elements
  DocumentPlusIcon,     // Create new project
  // Additional icons as needed
} from '@heroicons/react/24/outline';

// Icon usage pattern
<Button variant="outline" size="sm">
  <PencilIcon />
  Edit Diagram
</Button>
```

---

## 7. LAYOUT & RESPONSIVE DESIGN

### Breakpoint Strategy

**Laptop-Optimized Design:**
Since Diagramr is exclusively for laptop presentation scenarios, optimize for standard laptop screen sizes:

```css
/* Primary breakpoints for laptop screens */
.container {
  @apply mx-auto px-6;
  max-width: 1400px; /* Accommodate wide laptop displays */
}

/* Responsive scaling for different laptop sizes */
@media (min-width: 1024px) {
  /* Standard laptop */
  /* Default layout optimizations */
}

@media (min-width: 1280px) {
  /* Large laptop/external monitor */
  /* Enhanced spacing and larger elements */
}

@media (min-width: 1440px) {
  /* Wide displays */
  /* Maximum layout width with centered content */
}
```

### Layout Patterns

**Dashboard Layout:**

```tsx
// Main dashboard grid for project organization
<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
```

**Editor Layout:**

```tsx
// Split-panel editor interface
<div className="flex h-screen">
  {/* Left toolbar */}
  <div className="w-16 bg-muted border-r">
    <DiagramToolbar />
  </div>

  {/* Main canvas area */}
  <div className="flex-1">
    <DiagramCanvas />
  </div>

  {/* Right properties panel */}
  <div className="w-80 bg-card border-l">
    <ElementProperties />
  </div>
</div>
```

**Presentation Layout:**

```tsx
// Full-screen presentation optimized for screen sharing
<div className="fixed inset-0 bg-background z-50">
  <div className="w-full h-full flex items-center justify-center">
    <DiagramCanvas presentationMode={true} />
  </div>

  {/* Minimal controls overlay */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
    <PresentationControls />
  </div>
</div>
```

### Navigation Architecture

**Primary Navigation:**

- **Dashboard:** Project overview and quick access
- **Create New:** Streamlined diagram creation workflow
- **Recent Projects:** Quick access to active work
- **Search:** Cross-project content discovery

**Contextual Navigation:**

- **Editor Mode:** Tool palette, element properties, canvas controls
- **Presentation Mode:** Minimal controls for live demonstrations
- **Export Mode:** Format selection and generation options

---

## 8. INTERACTIVE PATTERNS & ACCESSIBILITY

### Micro-Interactions

**Diagram Editor Interactions:**

```css
/* Element selection feedback */
.diagram-element {
  @apply transition-all duration-200 ease-in-out;
  @apply hover:shadow-md hover:scale-105;
}

.diagram-element.selected {
  @apply ring-2 ring-primary ring-offset-2;
  @apply shadow-lg;
}

/* Connection hover states */
.diagram-connection {
  @apply transition-colors duration-150;
  @apply hover:stroke-primary hover:stroke-2;
}
```

**Button and Interface Animations:**

```css
/* Primary action emphasis */
.btn-primary {
  @apply transition-all duration-200;
  @apply hover:shadow-md hover:-translate-y-0.5;
  @apply active:translate-y-0 active:shadow-sm;
}

/* Loading states for AI processing */
.processing-indicator {
  @apply animate-pulse;
}
```

### Keyboard Navigation

**Editor Keyboard Shortcuts:**

```typescript
// Essential keyboard shortcuts for power users
const keyboardShortcuts = {
  // Editing
  'Ctrl+S': 'Save diagram',
  'Ctrl+Z': 'Undo last action',
  'Ctrl+Y': 'Redo action',
  Delete: 'Delete selected element',

  // Navigation
  E: 'Enter edit mode',
  P: 'Enter presentation mode',
  Escape: 'Exit current mode',

  // Canvas
  Space: 'Pan canvas (hold and drag)',
  '+': 'Zoom in',
  '-': 'Zoom out',
  '0': 'Reset zoom',
}
```

**Presentation Mode Controls:**

```typescript
// Presentation-optimized keyboard navigation
const presentationControls = {
  Space: 'Play/pause animation',
  ArrowRight: 'Next animation step',
  ArrowLeft: 'Previous animation step',
  R: 'Restart animation',
  Escape: 'Exit presentation mode',
}
```

### Accessibility Implementation

**Screen Reader Support:**

```tsx
// Semantic HTML structure for diagram elements
<div
  role="img"
  aria-label={`Diagram: ${diagramTitle}`}
  aria-describedby="diagram-description"
>
  <div id="diagram-description" className="sr-only">
    {generateDiagramDescription(elements, connections)}
  </div>

  {/* Canvas content with proper ARIA labels */}
  {elements.map(element => (
    <div
      key={element.id}
      role="button"
      tabIndex={0}
      aria-label={`${element.type}: ${element.highLevelDescription}`}
      aria-describedby={`element-${element.id}-details`}
    >
      {/* Element visual */}
      <div id={`element-${element.id}-details`} className="sr-only">
        {element.technicalDescription}
      </div>
    </div>
  ))}
</div>
```

**Color Accessibility:**

```css
/* Ensure sufficient contrast ratios */
:root {
  /* Using existing variables with verified contrast ratios */
  --text-on-primary: var(--primary-foreground); /* White on blue: 4.5:1+ */
  --text-on-background: var(--foreground); /* Dark gray on white: 12.6:1+ */
}

/* Focus indicators for keyboard navigation */
.focus-visible {
  @apply ring-2 ring-primary ring-offset-2 outline-none;
}
```

**Motion Preferences:**

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  .diagram-element,
  .btn-primary,
  .processing-indicator {
    @apply transition-none animate-none;
  }

  /* Provide alternative indication for animations */
  .animation-alternative {
    @apply border-2 border-dashed border-primary;
  }
}
```

---

## 9. PERFORMANCE & OPTIMIZATION

### Loading Strategies

**Next.js Optimization:**

```typescript
// Page-level optimizations
export default function EditorPage({ params }: { params: { id: string } }) {
  // Dynamic imports for heavy editor components
  const DiagramEditor = dynamic(() => import('@/components/DiagramEditor'), {
    loading: () => <EditorSkeleton />,
    ssr: false, // Canvas requires client-side rendering
  });

  return <DiagramEditor diagramId={params.id} />;
}

// Static generation for dashboard
export const generateStaticParams = async () => {
  // Pre-generate common routes
};
```

**Component Code Splitting:**

```typescript
// Lazy load presentation mode
const PresentationMode = lazy(() => import('@/components/PresentationMode'))

// Canvas rendering optimization
const DiagramCanvas = lazy(() => import('@/components/DiagramCanvas'))
```

### Canvas Performance

**Diagram Rendering Optimization:**

```typescript
interface CanvasOptimization {
  // Viewport culling for large diagrams
  visibleElements: DiagramElement[];

  // Layer management
  backgroundLayer: CanvasRenderingContext2D;
  elementLayer: CanvasRenderingContext2D;
  interactionLayer: CanvasRenderingContext2D;

  // Debounced updates
  updateCanvas: debounce((elements: DiagramElement[]) => {
    // Batch canvas updates
  }, 16); // 60fps target
}

// Memory management for canvas
export function useCanvasCleanup(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    return () => {
      // Clean up canvas contexts and event listeners
    };
  }, []);
}
```

### Export Generation Performance

**Background Processing:**

```typescript
// Web Workers for export generation
export class ExportWorker {
  private worker: Worker

  generateGIF(diagramData: DiagramData): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.worker = new Worker('/workers/gif-generator.js')

      this.worker.postMessage({
        type: 'GENERATE_GIF',
        data: diagramData,
      })

      this.worker.onmessage = event => {
        if (event.data.type === 'GIF_COMPLETE') {
          resolve(event.data.blob)
        }
      }
    })
  }
}
```

### SWR Caching Strategy

**Optimized Data Fetching:**

```typescript
// Global SWR configuration
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes for project list
  dedupingInterval: 2000,
  errorRetryCount: 3,

  // Custom cache key function
  fetcher: async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network error')
    return response.json()
  },
}

// Preload critical data
export function preloadDiagramData(diagramId: string) {
  mutate(`diagram-${diagramId}`)
}
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Core Foundation (Week 1-2)

**Technical Setup:**

- Next.js 14+ project initialization with App Router
- Supabase database schema implementation
- Basic authentication setup with RLS policies
- Core shadcn/ui component integration with existing CSS variables

**Essential Features:**

- User registration/login functionality
- Basic dashboard with empty state
- Transcript input form with validation
- Database connection and user data persistence

### Phase 2: AI Integration (Week 3-4)

**AI Processing:**

- OpenAI API integration for transcript analysis
- Structured output generation for diagram data
- Basic error handling and retry logic
- Processing status indicators and progress tracking

**Data Management:**

- Complete Supabase schema with all relationships
- SWR integration for data fetching
- Basic CRUD operations for diagrams and elements

### Phase 3: Diagram Editor (Week 5-7)

**Canvas Implementation:**

- HTML5 Canvas-based diagram rendering
- Element creation, selection, and modification
- Connection drawing and management
- Zustand state management for editor interactions

**Visual Design:**

- Brand-consistent element styling
- Professional color scheme implementation
- Typography and spacing system application
- Responsive layout for laptop screens

### Phase 4: Presentation & Export (Week 8-9)

**Presentation Mode:**

- Full-screen presentation interface
- Smooth animation sequences
- Keyboard navigation and controls
- Screen sharing optimization

**Export Functionality:**

- Canvas-to-image conversion for PNG exports
- GIF generation with animation sequences
- Supabase file storage integration
- Download and sharing capabilities

### Phase 5: Polish & Optimization (Week 10-11)

**Performance Optimization:**

- Canvas rendering performance tuning
- Memory management and cleanup
- Export generation optimization
- Loading state improvements

**User Experience:**

- Error boundary implementation
- Accessibility improvements
- Keyboard shortcuts
- Progressive enhancement

### Phase 6: Testing & Deployment (Week 12)

**Quality Assurance:**

- Component testing with React Testing Library
- End-to-end workflow testing
- Performance benchmarking
- Security audit

**Production Deployment:**

- Vercel deployment configuration
- Environment variable setup
- Database migration scripts
- Monitoring and error tracking setup

---

## Development Guidelines for AI Code Editors

### Critical Implementation Notes

**Authentication First:** Implement Supabase auth and RLS policies before any data operations to ensure security from the start.

**Canvas Performance:** Use RAF (requestAnimationFrame) for all canvas updates and implement viewport culling for diagrams approaching the 25-element limit.

**AI Error Handling:** Implement robust fallbacks for AI processing failures, including manual diagram creation options.

**Export Reliability:** Use Web Workers for export generation to prevent UI blocking during file creation.

**Presentation Optimization:** Test full-screen mode across different browsers and provide fallback options for compatibility issues.

### Code Quality Standards

**TypeScript Usage:** Maintain strict type safety throughout the application, especially for diagram data structures and API interfaces.

**Component Patterns:** Use composition over inheritance for diagram elements and maintain clear separation between presentation and business logic.

**State Management:** Keep Zustand stores focused on specific domains (editor state, canvas view, etc.) and use SWR for all server data.

**Performance Monitoring:** Implement performance benchmarks for canvas rendering and export generation to ensure smooth operation during client presentations.

**Error Boundaries:** Wrap critical components (DiagramEditor, PresentationMode) with error boundaries to prevent application crashes during live demonstrations.

This technical specification provides comprehensive guidance for building Diagramr as a production-ready application that transforms technical conversations into professional, animated diagrams suitable for client presentations. The implementation prioritizes reliability, performance, and professional visual quality to support Brilliant Noise's sales team in effectively communicating technical concepts to diverse audiences.
