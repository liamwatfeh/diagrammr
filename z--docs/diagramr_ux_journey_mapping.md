# Diagramr - User Experience & Journey Mapping

## Document Purpose & Critical Importance

This document provides step-by-step documentation of every possible user interaction within Diagramr, Brilliant Noise's internal tool for transforming technical conversation transcripts into branded, animated flowcharts for client presentations. It serves as the complete blueprint for how sales team members navigate, interact with, and accomplish tasks in the application.

### Why This Document is Critical

- AI code editors need explicit step-by-step guidance to implement user flows correctly for live client presentation scenarios
- Every click, page transition, and system response must be defined to prevent gaps during critical sales conversations
- This document ensures consistent user experience across all features supporting the core workflow: transcript → diagram → presentation → export
- It defines the complete interaction model that connects technical conversation analysis to client-ready visual assets

---

## 1. PRIMARY USER JOURNEYS

### Journey 1: Create New Diagram from Transcript

**JOURNEY:** Create New Diagram from Transcript  
**STARTING POINT:** User is on main dashboard  
**SUCCESS OUTCOME:** User has a branded, animated diagram ready for client presentation

**Step 1: Initiate New Project**

- User does: Clicks "Create New Diagram" button on main dashboard
- System responds: Displays project setup modal with client name field and transcript input area
- User sees: Modal with "Client/Project Name" text field, large text area labeled "Paste Transcript Here", and "Generate Diagram" button (disabled)
- Next possible actions: Enter client name, paste transcript content, click "Cancel" to return to dashboard
- If error: If user is not authenticated, redirect to login; if system unavailable, show "Service temporarily unavailable" message

**Step 2: Enter Project Details**

- User does: Types client/project name in text field (e.g., "ABC Corp E-commerce Flow")
- System responds: Enables transcript text area, shows character count indicator
- User sees: Text field populated with project name, active cursor in transcript area, "0 characters" count
- Next possible actions: Paste transcript content, edit project name, click "Cancel"
- If error: If name exceeds 255 characters, show inline error "Project name too long (255 characters max)"

**Step 3: Input Transcript Content**

- User does: Pastes technical conversation transcript into text area
- System responds: Updates character count, enables "Generate Diagram" button when content detected
- User sees: Text area filled with transcript, character count updates in real-time, enabled "Generate Diagram" button
- Next possible actions: Edit transcript content, click "Generate Diagram", click "Cancel"
- If error: If no content detected after 5 seconds, show hint "Paste your technical conversation transcript here"

**UX Enhancement Opportunity:** AI could analyze pasted content and suggest a more descriptive project title based on technical systems mentioned in the transcript.

**Step 4: Generate Initial Diagram**

- User does: Clicks "Generate Diagram" button
- System responds: Closes modal, shows processing screen with progress indicator and estimated time
- User sees: Full-screen loading animation with "Analyzing transcript..." message, progress bar, "Processing typically takes 30-60 seconds"
- Next possible actions: Wait for completion (no cancel option during processing to prevent data loss)
- If error: If processing fails, show error screen with "Try Again" button and option to "Edit Transcript"

**Step 5: Review Generated Diagram**

- User does: Automatically redirected when processing completes
- System responds: Displays diagram editor with AI-generated flowchart, branded styling applied
- User sees: Canvas with diagram elements (nodes and connections), right panel showing element details, top toolbar with editing tools, "Present Mode" and "Export" buttons
- Next possible actions: Edit elements, adjust layout, enter presentation mode, export diagram, save and return to dashboard
- If error: If diagram has issues, show "Generation completed with warnings" banner with option to "Regenerate" or "Edit Manually"

### Journey 2: Present Diagram to Client

**JOURNEY:** Present Diagram to Client  
**STARTING POINT:** User has completed diagram open in editor  
**SUCCESS OUTCOME:** User successfully shares animated diagram during live client call

**Step 1: Enter Presentation Mode**

- User does: Clicks "Present Mode" button in top toolbar
- System responds: Switches to full-screen presentation view, hides all editing interfaces
- User sees: Diagram fills entire screen with Brilliant Noise branding, animated sequence ready to start, subtle "Start Animation" button in bottom corner
- Next possible actions: Start animation sequence, press Escape to exit presentation mode
- If error: If browser blocks full-screen, show instructions to allow full-screen access

**Step 2: Start Animated Presentation**

- User does: Clicks "Start Animation" or presses spacebar
- System responds: Begins smooth animation sequence showing elements appearing in logical order
- User sees: Elements animate into view with connections forming, each step highlighted briefly, smooth transitions between stages
- Next possible actions: Pause animation (spacebar), restart from beginning (R key), exit presentation (Escape)
- If error: If animation stutters, automatically pause and show "Click to continue" overlay

**Step 3: Navigate During Presentation**

- User does: Uses keyboard controls during live client presentation
- System responds: Responds to spacebar (pause/resume), arrow keys (step forward/back), R key (restart)
- User sees: Current animation state with subtle progress indicator, responsive controls without interface clutter
- Next possible actions: Continue animation, pause for discussion, restart sequence, exit presentation
- If error: If controls become unresponsive, show discrete "Press Escape to exit" message

**UX Enhancement Opportunity:** Add a "Practice Mode" that lets users rehearse the presentation timing and flow before live client calls.

**Step 4: Exit Presentation Mode**

- User does: Presses Escape key or presentation completes naturally
- System responds: Returns to diagram editor view with all editing tools restored
- User sees: Original editor interface with diagram in current state, all tools and panels visible
- Next possible actions: Make edits, export diagram, start new presentation, save project
- If error: If exit fails, provide browser-specific instructions to exit full-screen mode

### Journey 3: Edit Existing Diagram

**JOURNEY:** Edit Existing Diagram  
**STARTING POINT:** User has accessed existing diagram from project list  
**SUCCESS OUTCOME:** User has refined diagram with manual edits and saved changes

**Step 1: Access Diagram for Editing**

- User does: Clicks "Edit" button on diagram from project dashboard
- System responds: Opens diagram editor interface with current diagram loaded
- User sees: Canvas with existing diagram, element properties panel, editing toolbar, version indicator showing "v1.2"
- Next possible actions: Select elements to edit, add new elements, modify connections, change styling
- If error: If diagram fails to load, show "Diagram unavailable" with "Try Again" and "Contact Support" options

**Step 2: Select and Modify Element**

- User does: Clicks on existing diagram element (e.g., "Payment Gateway" node)
- System responds: Highlights selected element, shows properties in right panel
- User sees: Selected element with blue outline, right panel showing "High-level description" and "Technical description" fields, styling options
- Next possible actions: Edit descriptions, change element type/styling, delete element, add connections
- If error: If element is corrupted, show "Element cannot be edited" with option to "Replace Element"

**Step 3: Edit Element Descriptions**

- User does: Modifies text in "High-level description" field (e.g., changes "Processes payments" to "Handles secure transactions")
- System responds: Updates text in real-time, shows unsaved changes indicator
- User sees: Updated text in field, asterisk (\*) next to diagram title indicating unsaved changes, element on canvas reflects change
- Next possible actions: Edit technical description, save changes, revert changes, continue editing other elements
- If error: If character limit exceeded (255 for high-level), show inline error with character count

**Step 4: Add New Element**

- User does: Clicks "Add Element" button in toolbar
- System responds: Shows element type selection menu (Process, Decision, Data, System, User Action)
- User sees: Dropdown menu with element types, icons for each type, cursor changes to crosshair for placement
- Next possible actions: Select element type, click canvas to place, cancel addition
- If error: If diagram already has 25 elements, show "Maximum elements reached" error and disable add option

**UX Enhancement Opportunity:** Keyboard shortcuts (E for edit, A for add element, D for delete) could speed up common editing tasks during client preparation.

**Step 5: Save Changes**

- User does: Clicks "Save" button or uses Ctrl+S
- System responds: Saves changes, creates new version, updates version indicator
- User sees: "Changes saved" confirmation message, version updates to "v1.3", unsaved changes indicator disappears
- Next possible actions: Continue editing, export updated diagram, enter presentation mode, return to dashboard
- If error: If save fails due to network issues, show "Save failed - retry?" with automatic retry option

### Journey 4: Export Diagram for Sharing

**JOURNEY:** Export Diagram for Sharing  
**STARTING POINT:** User has completed diagram ready for export  
**SUCCESS OUTCOME:** User has downloadable GIF and PNG files for client follow-up

**Step 1: Access Export Options**

- User does: Clicks "Export" button in main toolbar
- System responds: Opens export modal with format options and settings
- User sees: Modal with "Animated GIF" and "Static PNG" checkboxes (both selected by default), quality settings, estimated file sizes
- Next possible actions: Select/deselect formats, adjust quality settings, click "Generate Exports", cancel
- If error: If previous export is still processing, show "Previous export in progress" with option to cancel previous

**Step 2: Configure Export Settings**

- User does: Adjusts quality slider for GIF export (High/Medium/Standard)
- System responds: Updates estimated file size and processing time in real-time
- User sees: Quality slider position, updated estimates ("High Quality: ~2.3MB, 45 seconds"), preview thumbnails
- Next possible actions: Adjust PNG settings, start export generation, cancel export
- If error: If file size would exceed limits (10MB), show warning "File size too large for email - reduce quality?"

**UX Enhancement Opportunity:** Show preview thumbnails of what the exports will look like before generating to ensure quality meets expectations.

**Step 3: Generate Export Files**

- User does: Clicks "Generate Exports" button
- System responds: Starts export processing, shows progress for each format
- User sees: Progress modal with separate progress bars for "Generating GIF..." and "Generating PNG...", estimated time remaining
- Next possible actions: Wait for completion (cannot cancel to prevent corrupted files)
- If error: If generation fails, show specific error for each format with "Retry" options

**Step 4: Download Generated Files**

- User does: Clicks download buttons for completed exports
- System responds: Initiates browser downloads for each file
- User sees: "Export Complete" modal with download buttons, file names ("abc_corp_flow.gif", "abc_corp_flow.png"), file sizes
- Next possible actions: Download files, generate new exports with different settings, close modal
- If error: If download fails, show "Download failed" with option to "Copy Download Link"

### Journey 5: Find and Access Existing Diagrams

**JOURNEY:** Find and Access Existing Diagrams  
**STARTING POINT:** User needs to locate specific diagram for client meeting  
**SUCCESS OUTCOME:** User quickly finds and opens relevant diagram

**Step 1: Access Project Dashboard**

- User does: Navigates to main dashboard or clicks "My Projects" in navigation
- System responds: Displays organized list of client projects with recent activity
- User sees: Projects grouped by client name, recent diagrams highlighted, search bar at top, filter options (This Week, This Month, All Time)
- Next possible actions: Browse projects, use search, apply filters, create new project
- If error: If projects fail to load, show "Unable to load projects" with "Refresh" button

**Step 2: Search for Specific Diagram**

- User does: Types client name or diagram topic in search bar (e.g., "ABC Corp")
- System responds: Filters projects in real-time, highlights matching terms
- User sees: Filtered project list showing only ABC Corp projects, matching terms highlighted in yellow
- Next possible actions: Click on project to view details, refine search, clear search to see all projects
- If error: If no results found, show "No projects found" with suggestion to "Check spelling or try different terms"

**Step 3: Browse Client Project Details**

- User does: Clicks on client project from list (e.g., "ABC Corp E-commerce Flow")
- System responds: Expands project to show all diagrams and exports for that client
- User sees: Project expanded with diagram thumbnails, version numbers, last modified dates, export files listed
- Next possible actions: Open diagram for editing, enter presentation mode directly, download existing exports, create new diagram for client
- If error: If project details fail to load, show "Project details unavailable" with "Retry" option

**UX Enhancement Opportunity:** Add "Recently Accessed" section on dashboard showing the last 5 diagrams used, enabling one-click access for repeat presentations.

---

## 2. TASK-SPECIFIC JOURNEYS

### Task 1: Transcript Input Processing

**TASK:** Process Technical Conversation Transcript  
**FUNCTIONAL REQUIREMENT:** Accept and analyze transcript input  
**SUCCESS OUTCOME:** System successfully parses transcript content

**Step 1: Validate Transcript Format**

- User does: Pastes conversation transcript into input area
- System responds: Analyzes content for technical conversation patterns
- User sees: Content appears in text area, system shows "Analyzing content..." message briefly
- Next possible actions: Edit content, proceed to generation, clear input
- If error: If content appears non-technical, show warning "This doesn't appear to be a technical conversation. Continue anyway?"

**Step 2: Extract Key Information**

- User does: Transcript analysis completes automatically
- System responds: Identifies technical systems, processes, and relationships mentioned
- User sees: Brief "Content analysis complete" confirmation, character count updates
- Next possible actions: Proceed to diagram generation, edit transcript, cancel
- If error: If analysis finds insufficient technical content, suggest "Add more technical details for better diagram generation"

### Task 2: AI Diagram Generation

**TASK:** Generate Branded Animated Diagram  
**FUNCTIONAL REQUIREMENT:** Create diagrams from transcript analysis  
**SUCCESS OUTCOME:** Automated diagram with dual-level descriptions

**Step 1: Process Technical Content**

- User does: Clicks "Generate Diagram" button
- System responds: Begins AI analysis of technical conversation
- User sees: Processing screen with "Analyzing technical systems..." progress indicator
- Next possible actions: Wait for completion (no interruption allowed)
- If error: If processing fails, offer "Retry Generation" or "Edit Transcript First"

**Step 2: Generate Diagram Structure**

- User does: System automatically proceeds after analysis
- System responds: Creates nodes for identified systems and processes
- User sees: Progress updates to "Creating diagram elements..." with element count
- Next possible actions: Continue waiting for completion
- If error: If too many elements identified (>25), show "Simplifying diagram for clarity..."

**Step 3: Apply Branding and Animation**

- User does: System completes final processing automatically
- System responds: Applies Brilliant Noise styling and animation sequences
- User sees: "Finalizing diagram..." message with brand colors appearing
- Next possible actions: Review generated diagram when complete
- If error: If branding fails to apply, use default styling and show "Using standard styling" notice

### Task 3: Manual Editing - Add New Elements

**TASK:** Add Elements Beyond AI Generation  
**FUNCTIONAL REQUIREMENT:** Manual addition of diagram elements  
**SUCCESS OUTCOME:** New element successfully integrated into diagram

**Step 1: Initiate Element Addition**

- User does: Clicks "Add Element" button in editing toolbar
- System responds: Activates element placement mode
- User sees: Element type selector menu, cursor changes to crosshair, canvas ready for placement
- Next possible actions: Select element type, place on canvas, cancel addition
- If error: If at 25-element limit, show "Cannot add more elements (25 maximum)" and disable option

**Step 2: Select Element Type**

- User does: Chooses element type from dropdown (Process, Decision, Data, System, User Action)
- System responds: Updates cursor with element preview
- User sees: Cursor shows ghost preview of selected element type, canvas ready for placement
- Next possible actions: Click to place element, change element type, cancel
- If error: If element type unavailable, show "Element type temporarily unavailable"

**Step 3: Place and Configure Element**

- User does: Clicks on canvas where element should be positioned
- System responds: Places element at click location, opens properties panel
- User sees: New element on canvas at clicked position, properties panel with empty description fields
- Next possible actions: Fill in descriptions, adjust position, connect to other elements, delete if incorrect
- If error: If placement conflicts with existing elements, suggest "Move element to avoid overlap"

### Task 4: Manual Editing - Change Existing Elements

**TASK:** Modify AI-Generated Elements  
**FUNCTIONAL REQUIREMENT:** Change elements that AI generated incorrectly  
**SUCCESS OUTCOME:** Element accurately reflects user's requirements

**Step 1: Select Element for Editing**

- User does: Clicks on existing diagram element
- System responds: Highlights selected element, loads properties in panel
- User sees: Element outlined in blue, properties panel showing current descriptions and settings
- Next possible actions: Edit descriptions, change element type, modify styling, delete element
- If error: If element is locked or corrupted, show "Element cannot be modified" with "Replace" option

**Step 2: Modify Element Properties**

- User does: Edits high-level or technical description fields
- System responds: Updates element in real-time, marks diagram as modified
- User sees: Text changes reflected on element label, unsaved changes indicator appears
- Next possible actions: Continue editing, save changes, revert to original, edit other properties
- If error: If description exceeds limits, show character count warning at 90% of limit

**Step 3: Update Element Connections**

- User does: Modifies connections by dragging from element handles
- System responds: Shows connection preview line, highlights valid connection targets
- User sees: Dragging connection line, potential targets highlighted in green, invalid targets grayed out
- Next possible actions: Complete connection to valid target, cancel connection drag, modify existing connections
- If error: If connection would create logical loop, show "Connection would create circular flow" warning

### Task 5: Full-Screen Presentation Mode

**TASK:** Display Animated Diagrams for Live Presentations  
**FUNCTIONAL REQUIREMENT:** Presentation mode for client calls  
**SUCCESS OUTCOME:** Smooth full-screen presentation suitable for screen sharing

**Step 1: Activate Presentation Mode**

- User does: Clicks "Present Mode" button or presses F11
- System responds: Requests full-screen permission, switches to presentation view
- User sees: Browser full-screen prompt, then diagram fills entire screen with presentation controls
- Next possible actions: Grant full-screen permission, start presentation, exit mode
- If error: If full-screen blocked, show instructions for enabling full-screen in browser settings

**Step 2: Control Presentation Flow**

- User does: Uses keyboard controls (spacebar, arrow keys) during presentation
- System responds: Animates elements according to user input, maintains smooth performance
- User sees: Elements animate in sequence, clear visual feedback for controls, no distracting interface elements
- Next possible actions: Pause/resume animation, step through manually, restart sequence, exit
- If error: If animation performance degrades, automatically switch to simplified animation mode

### Task 6: Export as Animated GIF

**TASK:** Generate Animated GIF Files  
**FUNCTIONAL REQUIREMENT:** Create GIF exports for screen sharing  
**SUCCESS OUTCOME:** High-quality animated GIF suitable for email and presentations

**Step 1: Configure GIF Settings**

- User does: Selects GIF format in export modal, adjusts quality settings
- System responds: Updates file size estimate and processing time prediction
- User sees: GIF quality slider, estimated file size, preview frame showing first animation state
- Next possible actions: Adjust quality, start generation, cancel export
- If error: If settings would create oversized file, suggest "Reduce quality for email compatibility?"

**Step 2: Generate Animated Export**

- User does: Confirms GIF generation settings
- System responds: Begins frame-by-frame animation capture and GIF encoding
- User sees: Progress bar with "Capturing animation frames..." status, estimated completion time
- Next possible actions: Wait for completion (cannot cancel to prevent corruption)
- If error: If generation fails, offer "Retry with lower quality" or "Try PNG instead"

### Task 7: Export as Static PNG

**TASK:** Generate Static PNG Files  
**FUNCTIONAL REQUIREMENT:** Create PNG exports for proposals  
**SUCCESS OUTCOME:** High-resolution static image of complete diagram

**Step 1: Configure PNG Settings**

- User does: Selects PNG format, chooses resolution (Standard/High/Print Quality)
- System responds: Shows resolution details and file size estimate
- User sees: Resolution options with pixel dimensions, file size estimates, quality preview
- Next possible actions: Select resolution, start generation, adjust other export settings
- If error: If high resolution would be too large, suggest "Standard resolution recommended for most uses"

**Step 2: Generate Static Export**

- User does: Confirms PNG generation
- System responds: Captures current diagram state as high-resolution image
- User sees: Quick processing indicator "Generating high-resolution image..."
- Next possible actions: Wait for completion (typically under 5 seconds)
- If error: If generation fails, offer "Retry" or "Try different resolution"

---

## 3. ERROR RECOVERY JOURNEYS

### Error Recovery 1: AI Processing Failure

**ERROR SCENARIO:** Transcript Processing Fails  
**TRIGGER:** AI cannot generate usable diagram from transcript  
**RECOVERY GOAL:** User gets workable diagram through alternative approach

**Step 1: Recognize Processing Failure**

- User sees: "Diagram generation failed" error screen with explanation
- System response: Stops processing, preserves original transcript, offers recovery options
- Available actions: Try different approach, edit transcript, contact support, return to dashboard
- Error details: "The transcript didn't contain enough technical detail for diagram generation"

**Step 2: Choose Recovery Path**

- User does: Selects "Edit Transcript" from recovery options
- System responds: Returns to transcript input with original content preserved
- User sees: Original transcript in editable form, suggestions for improvement, "Try Again" button enabled
- Next possible actions: Add more technical detail, try manual diagram creation, get help
- If still fails: Offer "Start with Blank Diagram" option to create manually

**Step 3: Implement Workaround**

- User does: Adds more technical details to transcript based on suggestions
- System responds: Highlights improved sections, enables "Try Again" button
- User sees: Enhanced transcript with improvement indicators, confidence meter showing better chances
- Recovery outcome: Second attempt succeeds or user proceeds with manual creation
- If error persists: Escalate to "Create Manually" workflow with transcript as reference

### Error Recovery 2: Export Generation Failure

**ERROR SCENARIO:** GIF or PNG Export Fails  
**TRIGGER:** Technical issues prevent file generation  
**RECOVERY GOAL:** User gets required export files through alternative method

**Step 1: Detect Export Failure**

- User sees: "Export failed" notification with specific error details
- System response: Stops generation, preserves export settings, offers retry options
- Available actions: Retry with same settings, try different quality, use alternative format
- Error details: "GIF generation failed due to high complexity - try lower quality"

**Step 2: Attempt Alternative Settings**

- User does: Selects "Retry with Lower Quality" option
- System responds: Automatically reduces quality settings, restarts export process
- User sees: Modified quality settings, new file size estimate, processing restart
- Next possible actions: Wait for completion, try different format, cancel export
- If still fails: Offer PNG-only export as backup option

**Step 3: Provide Backup Solution**

- User does: Accepts PNG export when GIF continues to fail
- System responds: Generates static PNG successfully
- User sees: "PNG export successful" message, download button, explanation about GIF limitation
- Recovery outcome: User has usable export file, understands limitation, can present with static image
- Backup plan: Offer "Browser Screenshot" guide for capturing animation manually

### Error Recovery 3: Element Limit Exceeded Error

**ERROR SCENARIO:** User Tries to Add More Than 25 Elements  
**TRIGGER:** User attempts to add 26th element to diagram  
**RECOVERY GOAL:** User understands limit and optimizes diagram accordingly

**Step 1: Prevent Invalid Action**

- User sees: "Maximum elements reached (25)" error message with explanation
- System response: Blocks element addition, highlights element count, explains business constraint
- Available actions: Delete unused elements, combine similar elements, use connections instead
- Error context: "25-element limit ensures diagrams remain clear for client presentations"

**Step 2: Offer Optimization Suggestions**

- User does: Clicks "Help me optimize" from error message
- System responds: Analyzes current diagram, suggests elements that could be combined or removed
- User sees: Highlighted elements with optimization suggestions, "Similar elements that could be combined"
- Next possible actions: Follow suggestions, manually remove elements, keep current diagram
- Alternative: Offer "Create Second Diagram" for complex flows that need splitting

**Step 3: Implement Optimization**

- User does: Follows suggestion to combine two similar process elements
- System responds: Merges elements, combines descriptions, maintains all connections
- User sees: Simplified diagram with 24 elements, ability to add one more, improved clarity
- Recovery outcome: More focused diagram suitable for presentation, understanding of best practices
- Learning: User now knows to design for clarity rather than completeness

### Error Recovery 4: Network Interruption During Work

**ERROR SCENARIO:** Connection Lost During Editing or Processing  
**TRIGGER:** Network issues interrupt active work session  
**RECOVERY GOAL:** User recovers work without significant loss

**Step 1: Detect Connection Loss**

- User sees: "Connection lost" banner at top of interface, offline mode indicator
- System response: Switches to offline mode, preserves current state in browser storage
- Available actions: Continue editing offline, check connection, save locally, retry connection
- Status indicator: "Working offline - changes saved locally"

**Step 2: Continue in Offline Mode**

- User does: Continues editing diagram while offline
- System responds: Saves all changes to browser local storage, queues actions for sync
- User sees: All editing functions work normally, "Offline" indicator, pending sync counter
- Next possible actions: Keep working, check connection status, export offline version
- Limitation: Cannot generate new diagrams or exports while offline

**Step 3: Restore Connection and Sync**

- User does: Connection returns automatically or user clicks "Retry Connection"
- System responds: Syncs locally stored changes to server, updates version numbers
- User sees: "Connection restored" message, sync progress indicator, all changes preserved
- Recovery outcome: No work lost, seamless transition back to online functionality
- If sync conflicts: Show "Resolve Changes" dialog with options to keep local or server version

### Error Recovery 5: Presentation Mode Failure During Client Call

**ERROR SCENARIO:** Full-Screen Presentation Fails During Live Client Call  
**TRIGGER:** Browser issues prevent presentation mode from working properly  
**RECOVERY GOAL:** User can continue presentation with minimal disruption

**Step 1: Immediate Fallback**

- User sees: Presentation mode fails to activate or crashes during presentation
- System response: Automatically returns to editor view, shows emergency presentation options
- Available actions: Use windowed presentation, share screen of editor, use browser zoom, export view
- Emergency message: "Presentation mode unavailable - using backup options"

**Step 2: Quick Alternative Setup**

- User does: Selects "Windowed Presentation" for immediate continuation
- System responds: Maximizes diagram view within browser window, removes editing tools
- User sees: Large diagram view without editing interface, basic navigation controls, clean presentation
- Next possible actions: Continue presentation in windowed mode, try full-screen again, use zoom
- Client impact: Minimal disruption, professional appearance maintained

**Step 3: Prevent Future Issues**

- User does: Completes presentation in fallback mode
- System responds: Logs issue for investigation, provides browser setup guide
- User sees: "Presentation completed" confirmation, troubleshooting guide for next time
- Recovery outcome: Successful client presentation despite technical issue
- Prevention: System provides browser setup checklist for reliable presentation mode

### Error Recovery 6: Unsaved Changes Loss

**ERROR SCENARIO:** User Loses Unsaved Edit Work  
**TRIGGER:** Browser crash, accidental navigation, or system issues  
**RECOVERY GOAL:** Restore as much work as possible and prevent future loss

**Step 1: Detect Work Loss**

- User sees: Returns to find diagram in earlier state, unsaved changes missing
- System response: Checks for auto-saved drafts, recovery data in browser storage
- Available actions: Restore from auto-save, start over, recover partial changes
- Recovery message: "Found auto-saved changes from 3 minutes ago - restore?"

**Step 2: Restore Available Work**

- User does: Clicks "Restore Auto-Save" option
- System responds: Loads most recent auto-saved state, shows what was recovered
- User sees: Diagram restored to near-current state, summary of recovered vs. lost changes
- Next possible actions: Continue editing, save immediately, review recovered changes
- Status: "Restored 8 of 10 recent changes - 2 changes may need to be redone"

**Step 3: Prevent Future Loss**

- User does: Reviews changes and saves immediately
- System responds: Implements more frequent auto-saving, shows save status indicator
- User sees: "Changes saved" confirmation, auto-save frequency increased to every 30 seconds
- Recovery outcome: Minimal work loss, improved safety for future editing
- Learning: User understands importance of frequent saving, system provides better protection

---

## 4. CONTEXT VARIATIONS

### Context Variation 1: User Experience Levels

**CONTEXT:** First-Time vs. Experienced Users  
**VARIATION SCOPE:** Interface complexity and guidance levels

**First-Time User Experience:**

- **Interface State:** Simplified toolbar with essential tools only, helpful tooltips enabled
- **Guidance Level:** Step-by-step onboarding hints, explanation of each action, confirmation dialogs
- **Available Actions:** Basic editing only, advanced features hidden behind "More Options" menu
- **Help Integration:** Contextual tips appear automatically, "Need Help?" always visible
- **Error Handling:** More detailed explanations, suggestions for correction, links to help resources

**Example Journey Difference - Creating First Diagram:**

- **Step 1 (First-time):** User sees welcome message, brief explanation of workflow, highlighted "Create New" button
- **Step 1 (Experienced):** User sees clean interface, direct access to all features, no explanatory text

**Experienced User Experience:**

- **Interface State:** Full toolbar visible, keyboard shortcuts enabled, advanced options readily available
- **Guidance Level:** Minimal guidance, assumes familiarity with workflow, quick confirmations only
- **Available Actions:** All features accessible immediately, batch operations available, customization options
- **Help Integration:** Help available but not prominent, expert tips for advanced techniques
- **Error Handling:** Concise error messages, assumes user understands context, quick recovery options

### Context Variation 2: Diagram Complexity Levels

**CONTEXT:** Simple (5-10 elements) vs. Complex (20-25 elements) Diagrams  
**VARIATION SCOPE:** Interface behavior and performance optimization

**Simple Diagram Context:**

- **Canvas Behavior:** Larger elements, more spacing, simplified connections, easier selection
- **Performance:** Instant updates, smooth animations, no performance warnings
- **Editing Tools:** Basic tools prominent, advanced layout options hidden
- **Presentation Mode:** Quick transitions, simple animation sequences, faster loading
- **Export Options:** All quality levels available, fast generation times

**Example Journey Difference - Editing Elements:**

- **Simple Context:** Click element → immediate property panel → real-time updates
- **Complex Context:** Click element → loading indicator → property panel → batched updates

**Complex Diagram Context:**

- **Canvas Behavior:** Smaller elements, tighter spacing, connection management tools, zoom controls essential
- **Performance:** Batched updates, simplified animations during editing, performance monitoring
- **Editing Tools:** Advanced layout tools visible, bulk selection options, performance optimization hints
- **Presentation Mode:** Longer loading times, optimized animation sequences, performance warnings if needed
- **Export Options:** Quality recommendations, longer processing times, file size warnings

### Context Variation 3: Data States

**CONTEXT:** Empty vs. Loading vs. Full Data States  
**VARIATION SCOPE:** Interface content and user guidance

**Empty State Context:**

- **Project Dashboard:** Welcome message, "Create your first diagram" call-to-action, tutorial links
- **Search Results:** "No projects found" with suggestions, "Create New" button prominent
- **Recent Activity:** "No recent activity" with getting started guide
- **Export History:** "No exports yet" with explanation of export workflow

**Example Journey Difference - Accessing Dashboard:**

- **Empty State:** Large "Get Started" section, tutorial videos, sample project option
- **Full State:** Project grid, search tools, quick access to recent work

**Loading State Context:**

- **AI Processing:** Progress indicators, estimated times, "What's happening" explanations
- **Project Loading:** Skeleton screens, progressive loading of content, cancel options where appropriate
- **Export Generation:** Detailed progress, time estimates, background processing notifications
- **Search Operations:** Instant feedback, loading indicators, partial results display

**Full Data State Context:**

- **Project Dashboard:** Dense project grid, advanced filtering, bulk operations, archive management
- **Search Results:** Comprehensive filtering, sorting options, batch actions
- **Recent Activity:** Timeline view, activity filtering, collaboration indicators
- **Export History:** Version tracking, bulk downloads, storage management tools

### Context Variation 4: Client Presentation Contexts

**CONTEXT:** Different Client Types Requiring Different Presentation Styles  
**VARIATION SCOPE:** Diagram styling and animation approaches

**Technical Client Context:**

- **Diagram Style:** More detailed technical descriptions visible, additional technical elements shown
- **Animation Speed:** Faster pacing, less explanatory pauses, technical terminology in labels
- **Presentation Flow:** Direct progression, minimal high-level explanations, focus on technical accuracy
- **Export Preferences:** Higher detail level, technical annotations, comprehensive documentation

**Non-Technical Client Context:**

- **Diagram Style:** High-level descriptions prominent, simplified visual elements, business-focused labeling
- **Animation Speed:** Slower pacing, explanatory pauses built in, step-by-step revelation
- **Presentation Flow:** Guided progression, contextual explanations, business benefit focus
- **Export Preferences:** Simplified visuals, executive summary focus, less technical detail

**Mixed Audience Context:**

- **Diagram Style:** Dual-level descriptions both visible, expandable detail sections, flexible labeling
- **Animation Speed:** Moderate pacing with pause points, explanation options available
- **Presentation Flow:** Adaptive flow allowing deep dives when needed, summary views available
- **Export Preferences:** Multiple versions for different audience levels, customizable detail levels

### Context Variation 5: Project Timeline Contexts

**CONTEXT:** Urgent vs. Standard vs. Archived Project Timelines  
**VARIATION SCOPE:** Interface priorities and workflow optimization

**Urgent Project Context (Client Call Today):**

- **Interface Priority:** "Present Mode" button prominent, export options immediately visible, quick-edit tools featured
- **Workflow Optimization:** One-click improvements, auto-save more frequent, skip confirmations for speed
- **Available Actions:** Streamlined editing, rapid export generation, presentation rehearsal mode
- **Error Handling:** Faster recovery options, backup plans prominently displayed, emergency alternatives

**Standard Project Context:**

- **Interface Priority:** Balanced layout, all features equally accessible, standard workflow progression
- **Workflow Optimization:** Normal confirmation dialogs, standard auto-save intervals, full feature access
- **Available Actions:** Complete editing suite, normal export options, full testing capabilities
- **Error Handling:** Standard recovery flows, complete troubleshooting options, thorough validation

**Archived Project Context (Reference Only):**

- **Interface Priority:** View-only mode prominent, export focus, historical version access
- **Workflow Optimization:** Read-only optimizations, version comparison tools, reference material generation
- **Available Actions:** Limited to viewing, exporting, and version management, no active editing
- **Error Handling:** Focus on access recovery, export alternatives, historical data preservation

---

## 5. NAVIGATION & DISCOVERY JOURNEYS

### Navigation Journey 1: Browse Client Projects

**JOURNEY:** Browse Projects by Client Organization  
**STARTING POINT:** User needs to find diagrams for specific client  
**SUCCESS OUTCOME:** User locates and accesses relevant client project

**Step 1: Access Client Project Browser**

- User does: Clicks "My Projects" in main navigation or selects "Browse by Client" filter
- System responds: Displays projects organized by client name in alphabetical order
- User sees: Client names as section headers, projects grouped under each client, recent activity indicators
- Next possible actions: Scroll through clients, use client search, expand specific client section
- If error: If client data fails to load, show "Client projects unavailable" with refresh option

**Step 2: Navigate Client Sections**

- User does: Clicks on client name section header (e.g., "ABC Corp")
- System responds: Expands section to show all projects for that client, collapses others for focus
- User sees: All ABC Corp projects with thumbnails, last modified dates, status indicators, export counts
- Next possible actions: Select specific project, view project details, create new project for client
- If error: If client section is empty, show "No projects for this client yet" with "Create First Project" option

**Step 3: Select Project for Action**

- User does: Clicks on specific project thumbnail or title
- System responds: Opens project details view with diagram preview and action options
- User sees: Large diagram preview, project metadata, available actions (Edit, Present, Export, Duplicate)
- Next possible actions: Edit diagram, start presentation, download exports, return to client browse
- If error: If project won't open, show "Project unavailable" with options to "Try Again" or "Contact Support"

**UX Enhancement Opportunity:** Add client relationship indicators showing frequency of use, recent presentation dates, and "due for follow-up" flags based on project age.

### Navigation Journey 2: Search Functionality

**JOURNEY:** Find Specific Diagrams Across All Projects  
**STARTING POINT:** User remembers partial information about needed diagram  
**SUCCESS OUTCOME:** User locates specific diagram through search

**Step 1: Initiate Search**

- User does: Clicks in global search bar and types partial query (e.g., "payment")
- System responds: Shows real-time search suggestions and filters as user types
- User sees: Search suggestions dropdown, filter options (Projects, Clients, Content), recent searches
- Next possible actions: Select suggestion, add filters, press enter to search, clear search
- If error: If search service unavailable, show "Search temporarily unavailable" with browse alternatives

**Step 2: Refine Search Results**

- User does: Applies additional filters like date range or client name
- System responds: Updates results in real-time, shows result count and filter tags
- User sees: Filtered results with matching terms highlighted, result counts per category, active filter tags
- Next possible actions: Remove filters, sort results, select result, modify search terms
- If error: If no results found, suggest "Try different terms" with related search suggestions

**Step 3: Access Found Content**

- User does: Clicks on search result showing desired diagram
- System responds: Opens diagram with search context preserved (highlighting relevant elements)
- User sees: Diagram with search terms highlighted in yellow, breadcrumb showing how they arrived
- Next possible actions: Edit diagram, return to search results, start new search, bookmark result
- If error: If result won't open, show "Content unavailable" with option to remove from search index

### Navigation Journey 3: Mode Switching Navigation

**JOURNEY:** Navigate Between Edit, Present, and Export Modes  
**STARTING POINT:** User has diagram open and needs to switch contexts  
**SUCCESS OUTCOME:** Seamless transition between different interaction modes

**Step 1: Identify Current Mode**

- User does: Looks at interface to confirm current mode (Edit/Present/Export)
- System responds: Shows clear mode indicator in top bar with available transitions
- User sees: Mode indicator badge, available mode buttons, context-appropriate toolbars
- Next possible actions: Switch to different mode, continue in current mode, save before switching
- If error: If mode is unclear, show prominent mode indicator with explanation

**Step 2: Switch Between Modes**

- User does: Clicks "Present Mode" button while in Edit mode
- System responds: Saves current changes automatically, transitions to presentation interface
- User sees: Brief "Switching to presentation mode..." indicator, then full-screen diagram view
- Next possible actions: Start presentation, return to edit mode, exit to dashboard
- If error: If mode switch fails, show "Unable to switch modes" with troubleshooting steps

**Step 3: Return to Previous Mode**

- User does: Exits presentation mode using Escape key
- System responds: Returns to previous mode (Edit) with all changes preserved
- User sees: Previous edit interface restored, all tools available, work preserved
- Next possible actions: Continue editing, switch to different mode, save and exit
- If error: If return fails, provide mode-specific recovery options and manual navigation

### Navigation Journey 4: Recent vs. Archived Content Access

**JOURNEY:** Navigate Between Current Work and Historical Projects  
**STARTING POINT:** User needs to access projects from different time periods  
**SUCCESS OUTCOME:** User efficiently locates content regardless of age

**Step 1: Navigate Time-Based Views**

- User does: Clicks "Recent" tab on dashboard to see current work
- System responds: Shows projects from last 30 days with activity indicators
- User sees: Recent projects with "Last used" timestamps, quick access buttons, activity summaries
- Next possible actions: Open recent project, switch to "All Projects" view, filter by date range
- If error: If recent data unavailable, show "Recent activity unavailable" with "View All Projects" option

**Step 2: Access Historical Content**

- User does: Clicks "All Projects" or uses date filter to find older content
- System responds: Switches to comprehensive view with all projects regardless of age
- User sees: Complete project list with dates, archive indicators for old projects, search capabilities
- Next possible actions: Search within historical content, filter by client or date, open archived project
- If error: If historical data is slow to load, show "Loading historical projects..." with progress

**Step 3: Restore Archived Project to Active Use**

- User does: Opens archived project and begins editing
- System responds: Automatically moves project back to "Recent" category, updates timestamps
- User sees: Project opens normally, "Restored to active projects" notification appears briefly
- Next possible actions: Continue editing, export updated version, create new version
- If error: If archived project won't activate, offer "Create Copy" option to work with duplicate

**UX Enhancement Opportunity:** Add "Smart Collections" that automatically group related diagrams across time periods (e.g., "ABC Corp - All Versions" showing evolution of client presentations).

---

## User Experience Enhancement Recommendations

Based on the comprehensive journey mapping, here are key opportunities to differentiate Diagramr and reduce user friction:

### Quick Wins for MVP

1. **Smart Title Suggestion:** AI suggests project names based on transcript content analysis
2. **Export Preview:** Show thumbnails of what exports will look like before generating
3. **Keyboard Shortcuts:** Essential shortcuts (Ctrl+S save, E edit, P present) for power users
4. **Auto-Recovery:** More frequent auto-saving with clear recovery messaging

### Future Enhancement Opportunities

1. **Presentation Rehearsal Mode:** Practice timing and flow before live client calls
2. **Client Style Memory:** Remember preferred styling and animation speeds per client
3. **Smart Collections:** Automatically group related diagrams and versions
4. **Performance Analytics:** Track which diagrams perform best in client presentations

### Accessibility and Reliability Improvements

1. **Offline Mode Capabilities:** Continue editing when connection is intermittent
2. **Browser Compatibility Checks:** Proactive warnings about presentation mode requirements
3. **Mobile Fallback Options:** Emergency viewing capabilities for unexpected mobile access
4. **Export Backup Plans:** Multiple export strategies when primary generation fails

This comprehensive journey mapping ensures that every user interaction is thoughtfully designed to support Brilliant Noise's sales team in creating compelling technical presentations that win client confidence.
