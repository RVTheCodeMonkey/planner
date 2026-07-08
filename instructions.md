Act as an expert full-stack developer experienced in building construction tech and field-operations software. 
I want to build a lightweight, mobile-first Web Application (PWA) to track tasks and notes on a large construction site.

### Core Requirements to Implement:
1. "Calendar-like" Timeline Interface:
   - A horizontal timeline view (grouped by 'Zones' or 'Subcontractors' as rows) rather than a standard monthly grid.
   - It must support "Multi-line input": multiple task blocks/cards must be stackable within the same time period/row without breaking the layout.
   - Fully responsive: smooth horizontal scrolling on desktop/tablet, collapsing into a clean vertical list view on mobile.

2. Task & Notes Architecture:
   - Tasks must track: ID, Title, Row/Zone, Start Date, End Date, Status (Todo, In Progress, Blocked, Done).
   - Notes must be a separate sub-entity linked to a task, capturing: Timestamp, User, Text, and an array for Image URLs.
   - Allow users to add quick notes and status updates directly from the timeline view via a modal or side-panel.

3. Offline-First & Performance:
   - Implement local data persistence (using IndexedDB, LocalStorage, or RxDB) so the app remains fully functional inside concrete structures without cellular service.
   - Implement a simple background sync queue that synchronizes local changes with a mock API/server state once online.
   - Use virtual scrolling or efficient rendering to ensure smooth performance when handling hundreds of tasks.

### Tech Stack Guidelines:
- UI Components: Use clean, minimalist Tailwind components. Optimize for touch targets (minimum 48x48px) for workers wearing gloves or on the move.

### Your Task:
1. Outline the proposed database schema and folder structure.
2. Generate the core layout and timeline component.
3. Implement the local storage/offline state management layer.
4. Provide the code for the task creation and note-taking functionality.

Start by creating the basic file structure and the configuration files, then proceed
