src/
│
├── assets/                     # All static files: images, icons, fonts
│   ├── images/                 # PNG, JPG, JPEG images
│   │   └── logo.png            # App logo
│   ├── icons/                  # SVG or icon files
│   │   └── menu.svg            # Menu icon example
│   └── fonts/                  # Custom fonts (optional)
│
├── components/                 # Reusable components used across multiple features
│   ├── common/                 # Truly generic UI components
│   │   ├── Button.jsx          # Button with props for type, color, onClick
│   │   ├── Input.jsx           # Text input with validation
│   │   ├── Modal.jsx           # Modal wrapper component
│   │   ├── Loader.jsx          # Loading spinner component
│   │   └── Alert.jsx           # Alerts / Notifications (success/error)
│   │
│   ├── layout/                 # Layout components for app structure
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Sidebar menu / filters
│   │   ├── Footer.jsx          # Footer for all pages
│   │   └── LayoutWrapper.jsx   # Wraps Navbar + Sidebar around pages
│   │
│   └── feature-specific/       # Optional reusable components inside a specific feature
│       └── PDFQA/
│           ├── QuestionInput.jsx
│           └── AnswerDisplay.jsx
│
├── features/                   # Feature-specific components (core logic/UI)
│   ├── PDFQA/
│   │   ├── DocumentUploader.jsx    # Upload PDFs
│   │   ├── PDFViewer.jsx           # View PDF content
│   │   └── index.js                # Export all PDFQA components
│   │
│   ├── NoteOrganizer/
│   │   ├── NoteEditor.jsx          # Create/edit notes
│   │   ├── TagInput.jsx            # Generate/select tags
│   │   ├── VoiceToTextButton.jsx   # Optional dictation button
│   │   └── NotesList.jsx           # Display all notes
│   │
│   ├── AcademicPlanner/
│   │   ├── Dashboard.jsx           # Task summary / overview
│   │   ├── TaskCalendar.jsx        # Monthly calendar view
│   │   ├── TaskCard.jsx            # Single task card
│   │   └── CreateTaskForm.jsx      # Form to create/edit tasks
│   │
│   ├── ResumeAnalyzer/
│   │   ├── ResumeUploader.jsx      # Upload resume file
│   │   └── AnalysisReport.jsx      # Show AI feedback
│   │
│   ├── CommunityPost/
│   │   ├── PostCard.jsx            # Single post UI
│   │   ├── PostFilterTabs.jsx      # Filter tabs (All/Students/Teachers)
│   │   ├── CreatePostButton.jsx    # Create post modal/button
│   │   └── BookmarkedPostsSidebar.jsx
│   │
│   ├── InterviewWithAI/
│   │   ├── InterviewForm.jsx       # Create new interviews
│   │   ├── InterviewList.jsx       # List of interviews
│   │   └── FeedbackReport.jsx      # AI-generated feedback
│   │
│   └── AdminTools/
│       ├── UserManagement.jsx      # Manage users
│       ├── ContentModeration.jsx   # Review flagged content
│       ├── AnalyticsDashboard.jsx  # Usage stats charts
│       └── SystemAnnouncements.jsx # Broadcast announcements
│
├── pages/                      # Route-level components (directly used in routing)
│   ├── home/
│   │   └── Home.jsx              # Landing page
│   │
│   ├── login/
│   │   └── Login.jsx             # Login/authentication page
│   │
│   ├── dashboard/
│   │   └── Dashboard.jsx         # User dashboard overview
│   │
│   ├── pdfqa/
│   │   └── PDFQAPage.jsx         # Wraps PDFQA components
│   │
│   ├── notes/
│   │   └── NoteOrganizerPage.jsx # Wraps NoteOrganizer feature
│   │
│   ├── planner/
│   │   └── PlannerPage.jsx       # Wraps AcademicPlanner feature
│   │
│   ├── resume-analyzer/
│   │   └── ResumeAnalyzerPage.jsx # Wraps ResumeAnalyzer feature
│   │
│   ├── community/
│   │   └── CommunityPage.jsx     # Wraps CommunityPost feature
│   │
│   ├── interview/
│   │   └── InterviewPage.jsx     # Wraps InterviewWithAI feature
│   │
│   ├── admin/
│   │   └── AdminPanel.jsx        # Wraps AdminTools feature
│   │
│   └── not-found/
│       └── NotFound.jsx          # 404 page
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.js               # Auth state & handlers
│   ├── useFetch.js              # Generic data fetching hook
│   ├── useNotes.js              # Note-related logic
│   ├── useTasks.js              # Task management logic
│   └── useCommunity.js          # Community interactions
│
├── contexts/                   # Global state providers
│   ├── AuthContext.jsx
│   ├── NotesContext.jsx
│   ├── TasksContext.jsx
│   ├── CommunityContext.jsx
│   └── AdminContext.jsx
│
├── services/                   # Backend API interaction
│   ├── apiClient.js             # Axios/fetch instance
│   ├── authService.js           # Auth API calls
│   ├── notesService.js          # Notes API calls
│   ├── tasksService.js          # Tasks API calls
│   ├── communityService.js      # Community API calls
│   ├── resumeService.js         # Resume analysis API calls
│   └── interviewService.js      # Interview API calls
│
├── utils/                      # Helper functions and constants
│   ├── formatDate.js            # Date formatting
│   ├── generateTags.js          # AI tag generation helper
│   ├── validateInput.js         # Input validation
│   └── constants.js             # Static constants like roles, priorities
│
├── styles/                     # Global CSS / Tailwind
│   ├── index.css                # Global styles + Tailwind import
│   └── tailwind.config.js       # Tailwind config
│
├── App.jsx                     # Main app component with routing
├── main.jsx                    # Entry point for React
└── vite-env.d.ts               # Vite environment types (if using TS)
