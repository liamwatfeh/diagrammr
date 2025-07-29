# Diagramr - Project Context & Requirements Document

## 1. Project Overview

**Project Name:** Diagramr

**Description:** Diagramr transforms technical conversations into branded, animated flowcharts that explain complex systems to both technical and non-technical audiences.

**Problem Being Solved:** Brilliant Noise's sales team currently spends hours manually creating diagrams in Canva or settles for low-quality AI-generated Mermaid diagrams that aren't client-ready. When presenting technical solutions to non-technical clients, they need polished visual assets that can clearly communicate complex system architectures during live presentations.

## 2. Target Users

**Primary Users:** Sales team members at Brilliant Noise who understand AI and technical systems well but need effective visual presentation tools for client-facing conversations.

**Usage Context:**

- Live client calls and presentations via laptop screen sharing
- Real-time demonstrations during sales conversations
- Follow-up materials for client communications
- Internal collaboration between sales and technical teams

**Technical Comfort Level:** Progressive disclosure interface - users want "click a few buttons and it works" initially, but need the ability to dive into detailed editing with decent granularity and complexity when required.

**Device Preferences:** Laptops only - optimized for full-screen presentation mode and screen sharing capabilities.

**Collaborative Environment:** Small company setting where technical team members may help create initial diagrams and sales team members refine them for client presentations.

## 3. Core Purpose & Value Proposition

**Before Diagramr:** Sales team spends hours in Canva manually creating technical diagrams or settles for low-quality AI-generated Mermaid diagrams that look unprofessional and aren't suitable for client presentations.

**After Diagramr:** Drop in a technical conversation transcript and receive a polished, client-ready animated diagram in minutes that effectively communicates complex systems to non-technical audiences.

**Unique Advantage:** Diagramr specifically understands technical conversations about web applications and tools, automatically generating presentation-quality branded diagrams rather than generic flowcharts.

**Core Benefit:** Dual improvement in both speed (reducing hours of manual work to minutes of automated generation) and quality (producing client-ready assets that showcase Brilliant Noise's technical expertise professionally).

## 4. Functional Requirements

### MUST HAVE Features (MVP Scope Only)

1. **Transcript Input Processing**
   - The app must accept technical conversation transcripts as input
   - The app must process natural language descriptions of systems and workflows

2. **AI Diagram Generation**
   - The app must automatically generate branded, animated diagrams from transcript input
   - The app must create diagrams that fit the specific product/system being described
   - The app must include dual-level descriptions for each stage (high-level and slightly more technical)

3. **Manual Editing Capabilities**
   - The app must allow users to add new elements to generated diagrams
   - The app must allow users to change elements that AI generated incorrectly
   - The app must provide manual editing tools (no AI-assisted editing required)

4. **Full-Screen Presentation Mode**
   - The app must provide a presentation mode that takes up the entire screen
   - The app must display animated diagrams optimized for live client presentations
   - The app must be suitable for screen sharing during video calls

5. **Export Options**
   - The app must export diagrams as animated GIFs
   - The app must export diagrams as static PNG images

### Features Explicitly NOT Included in MVP

- Multiple diagram layout algorithms
- Animation timing controls
- Interactive web exports
- AI-assisted editing
- Advanced collaboration features
- Template systems
- Version control

## 5. Constraints & Limitations

**Scope Boundaries:**

- Diagramr is specifically an asset generator for showcasing Brilliant Noise's webapps and tools to clients
- This is NOT a general-purpose diagramming tool for any company or use case
- Focus is on creating marketing/sales assets that demonstrate technical capabilities
- Limited to technical system diagrams, not business processes or organizational charts

**Technical Constraints:**

- Web-based application only (no desktop application required)
- Maximum of 25 nodes per diagram to maintain clarity for client presentations
- Optimized for laptop screens and presentation environments
- Must maintain performance suitable for live screen sharing

**Platform Restrictions:**

- Laptop-only optimization (no mobile or tablet support required)
- Designed for screen sharing during live client calls
- Must work reliably in video conferencing environments

**Integration Requirements:**

- Must align with Brilliant Noise branding guidelines
- Should complement existing sales and marketing materials
- Outputs must be suitable for embedding in client presentations

## 6. Priority Matrix

**Critical Priority:**

- Core AI transcript processing and diagram generation functionality
- Reliable full-screen presentation mode performance
- Professional visual quality that reflects Brilliant Noise's brand standards

**High Priority:**

- Manual editing capabilities for refining AI-generated diagrams
- Export functionality (GIF and PNG formats)
- User-friendly interface that sales team can adopt quickly

**Medium Priority:**

- Advanced editing features beyond basic add/change functionality
- Performance optimization for complex diagrams
- Enhanced animation controls and customization options

## Success Criteria

**User Adoption Metrics:**

- Sales team actively uses Diagramr for client presentations
- Reduction in time spent creating technical diagrams from hours to minutes
- Positive feedback from both sales team and client audiences

**Quality Metrics:**

- Generated diagrams accurately represent technical architectures described in transcripts
- Visual output meets professional standards suitable for client presentations
- Animations effectively communicate system workflows and data flows

**Business Impact:**

- Enhanced ability to communicate technical complexity to non-technical clients
- Improved consistency in how Brilliant Noise presents technical solutions
- Increased sales team confidence when presenting technical concepts
- Creation of reusable assets that showcase company capabilities

## Technical Context for Development

**Recommended Technology Stack:**

- React + TypeScript for component framework with type safety
- ReactFlow for diagram foundation and layout engine
- Framer Motion for smooth animation transitions
- Tailwind CSS for styling system (should align with Brilliant Noise branding)
- Web-based deployment suitable for laptop browser access

**Key Technical Requirements:**

- AI must generate structured data defining nodes, connections, and animations
- Diagram editor must handle up to 25 nodes without performance degradation
- Animation system must be smooth and suitable for live presentation
- Export functionality must generate high-quality GIFs and PNGs quickly
- Interface must be responsive and reliable for screen sharing scenarios

**Integration Considerations:**

- Should align with existing Brilliant Noise brand assets and color schemes
- Export formats must be compatible with common presentation tools
- Generated assets should be suitable for use in client proposals and case studies

This document provides the foundation for building Diagramr as an MVP that solves Brilliant Noise's specific need for creating professional, animated technical diagrams from conversation transcripts.
