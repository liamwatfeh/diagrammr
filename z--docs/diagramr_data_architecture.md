# Diagramr - Data Architecture & Content Strategy

## Document Purpose

This document defines the data architecture and content strategy for Diagramr, an internal tool that transforms technical conversation transcripts into branded, animated flowcharts for Brilliant Noise's sales presentations. This document provides AI code editors with the essential structure needed to build databases, user interfaces, and content management systems that work seamlessly together.

---

## 1. CORE DATA ENTITIES

### Overview

Diagramr tracks five primary entities that support the core workflow: transcript input → AI generation → manual editing → presentation → export.

### Primary Entities

**1. Transcripts**

- **Description:** Technical conversation text that serves as input for AI diagram generation
- **Purpose:** Raw material for creating client-specific technical diagrams
- **Examples:**
  - "ABC Corp e-commerce architecture discussion transcript"
  - "XYZ Client API integration planning call"
  - "Payment processing system requirements conversation"

**2. Diagrams**

- **Description:** Branded, animated flowcharts generated from transcripts and refined through manual editing
- **Purpose:** Primary presentation assets for client conversations
- **Examples:**
  - "ABC Corp Payment Processing Flow" (18 nodes, 25 connections)
  - "XYZ API Integration Architecture" (12 nodes, 15 connections)
  - "Client Portal User Journey" (20 nodes, 30 connections)

**3. Diagram Elements**

- **Description:** Individual nodes/components within diagrams (maximum 25 per diagram)
- **Purpose:** Represent specific processes, systems, or decision points in technical workflows
- **Examples:**
  - "User Authentication" (process type, high-level: "User logs in", technical: "OAuth 2.0 authentication with JWT tokens")
  - "Payment Gateway" (system type, high-level: "Processes payments", technical: "Stripe API integration with webhook callbacks")
  - "Database Query" (data type, high-level: "Retrieves information", technical: "PostgreSQL SELECT with JOIN operations")

**4. Connections**

- **Description:** Directional relationships and data flows between diagram elements
- **Purpose:** Show how information, processes, or control flows through the system
- **Examples:**
  - User Login → Authentication Check (labeled: "submits credentials")
  - Payment Gateway → Database Update (labeled: "confirms transaction")
  - API Call → Response Handler (labeled: "returns JSON data")

**5. Exports**

- **Description:** Generated presentation files in multiple formats
- **Purpose:** Ready-to-use assets for screen sharing and client presentations
- **Examples:**
  - "abc_corp_flow.gif" (animated version for live presentations)
  - "abc_corp_flow.png" (static version for proposals)
  - "api_integration_v2.gif" (updated version with client feedback)

---

## 2. DATA RELATIONSHIPS

### Relationship Structure

**Transcript → Diagram (One-to-One)**

- Each transcript generates one primary diagram
- Multiple diagrams can reference the same transcript (for versioning)
- Dependency: Diagrams require a source transcript

**Diagram → Elements (One-to-Many)**

- Each diagram contains 1-25 elements (business constraint)
- Elements cannot exist without a parent diagram
- Cascade delete: Removing diagram deletes all elements

**Element ↔ Element via Connections (Many-to-Many)**

- Elements connect to multiple other elements
- Connections always link exactly two elements (source and target)
- Elements can have multiple incoming and outgoing connections

**Diagram → Exports (One-to-Many)**

- Each diagram can generate multiple export formats (GIF, PNG)
- Exports can be regenerated without affecting source diagram
- Exports maintain link to parent diagram for organization

**Diagram → Diagram (Self-Referencing for Versions)**

- Diagrams can have previous versions
- Version history maintains parent-child relationship
- Linear versioning (no branching required for MVP)

### Key Relationship Rules

- **Cascade Deletions:** Deleting a diagram removes all related elements, connections, and exports
- **Orphan Prevention:** Elements and connections cannot exist without a parent diagram
- **Version Integrity:** Previous versions remain accessible until manually deleted
- **Export Independence:** Exports can be deleted without affecting source diagrams

---

## 3. DATA PROPERTIES & REQUIREMENTS

### Transcripts

**Required Fields:**

- `content` (TEXT) - Original transcript text, no length limit
- `processed_at` (TIMESTAMP) - When AI processing completed
- `created_at` (TIMESTAMP) - When transcript was uploaded

**Optional Fields:**

- `title` (VARCHAR 255) - User-defined transcript name
- `notes` (TEXT) - Additional context or meeting details
- `client_name` (VARCHAR 100) - Associated client/project name

**Validation Rules:**

- Content cannot be empty
- Title defaults to "Transcript + creation date" if not provided

### Diagrams

**Required Fields:**

- `title` (VARCHAR 255) - Diagram name for organization
- `status` (ENUM) - 'draft', 'ready', 'archived'
- `created_at` (TIMESTAMP) - Creation timestamp
- `transcript_id` (FK) - Source transcript reference

**Optional Fields:**

- `description` (TEXT) - Project context or client notes
- `presentation_settings` (JSON) - Full-screen preferences, animation timing
- `version_number` (INTEGER) - Auto-incrementing version identifier
- `parent_diagram_id` (FK) - For version history tracking

**Validation Rules:**

- Title is required and must be unique within project
- Status defaults to 'draft'
- Version number auto-increments from parent

### Elements

**Required Fields:**

- `diagram_id` (FK) - Parent diagram reference
- `position_x` (INTEGER) - Canvas X coordinate
- `position_y` (INTEGER) - Canvas Y coordinate
- `element_type` (ENUM) - 'process', 'decision', 'data', 'system', 'user_action'
- `high_level_description` (VARCHAR 255) - Non-technical explanation
- `technical_description` (TEXT) - Detailed technical explanation

**Optional Fields:**

- `custom_styling` (JSON) - Override default brand styling
- `animation_order` (INTEGER) - Sequence in presentation flow

**Validation Rules:**

- Maximum 25 elements per diagram (enforced at application level)
- Position coordinates must be positive integers
- Descriptions cannot be empty
- High-level description limited to 255 characters for UI consistency

### Connections

**Required Fields:**

- `source_element_id` (FK) - Starting element
- `target_element_id` (FK) - Ending element
- `connection_type` (ENUM) - 'data_flow', 'process_flow', 'dependency', 'trigger'

**Optional Fields:**

- `label` (VARCHAR 100) - Connection description ("sends data", "triggers")
- `styling` (JSON) - Line style, color, animation settings

**Validation Rules:**

- Source and target must be different elements
- Cannot create duplicate connections between same elements
- Both source and target must belong to same diagram

### Exports

**Required Fields:**

- `diagram_id` (FK) - Source diagram reference
- `file_type` (ENUM) - 'gif', 'png'
- `file_path` (VARCHAR 500) - Storage location
- `generated_at` (TIMESTAMP) - Export creation time
- `status` (ENUM) - 'generating', 'ready', 'failed'

**Optional Fields:**

- `file_size` (INTEGER) - File size in bytes
- `export_settings` (JSON) - Quality, dimensions, animation speed

**Validation Rules:**

- File path must be unique
- File size tracking for storage management
- Failed exports retained for 24 hours then auto-deleted

---

## 4. CONTENT TYPES & PURPOSES

### Static Content

**Purpose:** Consistent interface elements and brand guidelines

**Help & Tutorial Content:**

- Tooltip text for diagram editor tools
- Onboarding guidance for new users
- Best practices for transcript formatting

**Brand Assets:**

- Brilliant Noise color schemes and fonts
- Logo variations and positioning rules
- Animation style guidelines

**System Messages:**

- Error messages and troubleshooting guides
- Processing status updates
- Success confirmations

### AI-Generated Content

**Purpose:** Automated content creation from transcript analysis

**Diagram Descriptions:**

- High-level descriptions for non-technical audiences
- Technical descriptions with appropriate detail level
- Suggested diagram titles based on content analysis

**System Feedback:**

- Processing progress indicators
- Quality assessment of transcript input
- Suggested improvements for diagram clarity

### User-Created Content

**Purpose:** Customization and refinement by sales team

**Input Content:**

- Original transcript text uploads
- Custom diagram titles and project names
- Manual edits to AI-generated descriptions

**Presentation Content:**

- Project notes and client context
- Custom styling overrides
- Presentation sequence modifications

### Media Content

**Purpose:** Visual assets for client presentations

**Diagram Visuals:**

- SVG-based diagram elements with Brilliant Noise branding
- Smooth animation sequences for process flows
- Responsive layouts for different screen sizes

**Export Files:**

- High-quality animated GIFs for screen sharing
- Static PNG files for proposal documents
- Optimized file sizes for email distribution

---

## 5. CONTENT ORGANIZATION & STRUCTURE

### Primary Navigation Structure

**Main Interface Organization:**

1. **Create New** - Transcript input and AI generation workflow
2. **My Projects** - Client/project-based diagram organization
3. **Recent Exports** - Quick access to presentation files
4. **Search** - Cross-project diagram and content search

### Project-Based Organization

**Hierarchy Structure:**

**Level 1: Projects/Clients**

- Alphabetical listing of client names
- Recent activity indicators
- Project status (active, completed, archived)

**Level 2: Client Project Details**

- Primary diagram (main presentation asset)
- Additional diagrams (variations and detailed views)
- All exports organized by source diagram
- Project notes and context

**Level 3: Diagram Management**

- Current version (featured prominently)
- Version history with timestamps
- Export options and recent files
- Edit and presentation modes

### Content Findability

**Search Functionality:**

- Full-text search across diagram titles and descriptions
- Client/project name filtering
- Date range filtering (this week, this month, custom range)
- Content type filtering (diagrams, exports, transcripts)

**Quick Access Features:**

- Recently accessed diagrams
- Frequently used client projects
- Pending/draft diagrams requiring attention
- Failed exports needing regeneration

### Content Hierarchy Rules

**Priority System:**

- **Primary diagrams** featured prominently in project views
- **Recent versions** displayed before historical versions
- **Ready status** diagrams prioritized over drafts
- **Recent exports** easily accessible for immediate use

---

## 6. CONTENT MANAGEMENT & WORKFLOWS

### Content Creation Workflow

**Standard Process Flow:**

1. **Transcript Input** → Sales team uploads or pastes conversation text
2. **AI Processing** → System generates initial diagram with dual-level descriptions
3. **Manual Editing** → Sales team refines elements, connections, and descriptions
4. **Status Update** → Diagram marked as 'ready' when suitable for presentations
5. **Export Generation** → Create GIF and PNG files for client presentations

**No Approval Gates:** Sales team can create and present immediately without review processes

### Content Updates & Versioning

**Version Control System:**

- **Regeneration:** Processing same transcript creates new version, preserves original
- **Manual Edits:** Changes tracked but applied immediately without approval
- **Version History:** Linear versioning with clear timestamps and change indicators
- **Rollback Capability:** Previous versions remain accessible for restoration

**Update Triggers:**

- Reprocessing transcript with improved AI
- Manual edits to diagram elements or connections
- Styling updates or brand guideline changes
- Client feedback incorporation

### Content Lifecycle Management

**Creation Phase:**

- Immediate availability upon AI generation
- Draft status until manually marked ready
- Version 1.0 assigned to initial creation

**Active Phase:**

- Ready status enables export generation
- Multiple export formats maintained simultaneously
- Version increments with significant changes

**Maintenance Phase:**

- **Manual Deletion Only** - No automatic cleanup processes
- **Project-Based Retention** - Content organized by client maintains history
- **Export Management** - Old exports can be deleted independently of source diagrams

**Archive/Deletion:**

- User-initiated deletion only
- Cascade deletion removes all related elements, connections, and exports
- Soft deletion option for recovery (30-day retention before permanent removal)

### Workflow Permissions

**Content Creation:** All sales team members can create diagrams and exports
**Content Editing:** Full editing rights for all users (no role restrictions)
**Content Deletion:** All users can delete their own content, shared deletion for project materials
**Export Access:** All team members can generate and download any exports

### Quality Control

**Automated Checks:**

- Maximum 25 elements per diagram (hard limit)
- Required field validation before marking ready
- Export file size limits for email compatibility
- Animation performance optimization

**Manual Review:**

- Self-review by sales team members
- Peer feedback through informal collaboration
- Client feedback incorporation through edit cycles
- No formal approval or sign-off requirements

---

## Implementation Notes for AI Code Editors

### Database Considerations

- Use foreign key constraints to maintain relationship integrity
- Implement cascade delete for diagram → elements → connections
- Index frequently searched fields (client_name, created_at, status)
- JSON fields for flexible configuration storage (styling, settings)

### User Interface Priorities

- Project/client organization as primary navigation
- Quick access to recent and frequently used diagrams
- Streamlined editing interface matching progressive disclosure principle
- Full-screen presentation mode optimized for screen sharing

### Performance Requirements

- Support up to 25 elements per diagram without lag
- Smooth animations suitable for live presentations
- Fast export generation (under 30 seconds for complex diagrams)
- Responsive interface for laptop screen sharing scenarios

### Integration Requirements

- Maintain Brilliant Noise brand consistency across all visual elements
- Export compatibility with common presentation and email tools
- Storage optimization for generated media files
- Version control that doesn't impact performance with large histories
