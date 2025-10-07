src/
│
├── assets/
│   ├── images/
│   │   └── logo.png                   # App logo image
│   ├── fonts/                        # Custom fonts (if any)
│   └── icons/
│       └── menu.svg                  # Icon files (SVG format)
│
├── components/
│   ├── common/                       # Reusable basic UI elements (used everywhere)
│   │   ├── Button.jsx                # Custom button component with props for styling/types
│   │   ├── Input.jsx                 # Text input component with validation handlers
│   │   ├── Modal.jsx                 # Modal dialog UI component with open/close state
│   │   ├── Loader.jsx                # Loading spinner component
│   │   └── Alert.jsx                 # Alert/Notification component for success/error messages
│   │
│   ├── layout/                      # Layout components for app structure
│   │   ├── Navbar.jsx               # Top navigation bar with links and user menu
│   │   ├── Sidebar.jsx              # Sidebar for navigation and filtering options
│   │   ├── Footer.jsx               # Footer UI component with copyright
│   │   └── LayoutWrapper.jsx       # Wrapper component to include Navbar + Sidebar around pages
Features/
│   ├── PDFQA/                       # Components for PDF Q&A feature
│   │   ├── DocumentUploader.jsx    # Upload PDF document, handle Cloudinary upload logic
│   │   ├── PDFViewer.jsx            # Display PDF with scroll and text selection support
│   │   ├── QuestionInput.jsx        # Input box for user question related to PDF content
│   │   └── AnswerDisplay.jsx        # Show AI-generated answers with citation info
│   │
│   ├── NoteOrganizer/               # Components for note creation & editing
│   │   ├── NoteEditor.jsx           # Main note editor UI: subject/tag inputs and content textbox
│   │   ├── TagInput.jsx             # AI tag generator and manual tag input component
│   │   ├── VoiceToTextButton.jsx    # Optional voice-to-text button to dictate notes
│   │   └── NotesList.jsx            # Displays list of user notes with basic info and search bar
│   │
│   ├── AcademicPlanner/             # Planner feature components
│   │   ├── Dashboard.jsx            # Overview dashboard with tasks progress & summaries
│   │   ├── TaskCalendar.jsx         # Monthly calendar view of tasks with clickable dates
│   │   ├── TaskCard.jsx             # Single task card showing task info and priority
│   │   └── CreateTaskForm.jsx       # Form to create/edit new tasks with validation
│   │
│   ├── ResumeAnalyzer/              # Resume upload and analysis UI
│   │   ├── ResumeUploader.jsx       # File input and upload handling
│   │   └── AnalysisReport.jsx       # Displays AI feedback and improvement suggestions
│   │
│   ├── CommunityPost/               # Collaborative feed components
│   │   ├── PostCard.jsx             # Individual post display with votes, comments
│   │   ├── PostFilterTabs.jsx       # Filter tabs to toggle between All, Students, Teachers
│   │   ├── CreatePostButton.jsx     # Button to open modal/form to create post or announcement
│   │   └── BookmarkedPostsSidebar.jsx # Sidebar with bookmarked posts quick access
│   │
│   ├── InterviewWithAI/             # Interview creation and feedback components
│   │   ├── InterviewForm.jsx        # Form to create new interviews (job role, description, type)
│   │   ├── InterviewList.jsx        # List view of created interviews with status
│   │   └── FeedbackReport.jsx       # AI-generated interview feedback display
│   │
│   └── AdminTools/                  # Admin panel feature components
│       ├── UserManagement.jsx       # Manage users, roles, suspension
│       ├── ContentModeration.jsx    # Review flagged posts, approve/remove content
│       ├── AnalyticsDashboard.jsx   # Usage statistics and active user charts
│       └── SystemAnnouncements.jsx  # Create and broadcast admin announcements
│
├── pages/                          # Route-level page components - used in routing configuration
│   ├── Home/                      # Landing/home page
│   │   └── Home.jsx                # Uses common layout, welcome UI, feature highlights
│   │
│   ├── Login/                     # Authentication page
│   │   └── Login.jsx               # Login form and social login buttons
│   │
│   ├── Dashboard/                 # After-login user dashboard page
│   │   └── Dashboard.jsx           # Displays user's overview with links to features
│   │
│   ├── PDFQAPage/                 # PDF Q&A system page
│   │   └── PDFQAPage.jsx           # Combines DocumentUploader, PDFViewer, Q&A input/display
│   │
│   ├── NoteOrganizerPage/         # Page for note organizer feature
│   │   └── NoteOrganizerPage.jsx   # Wraps NoteEditor and NotesList side by side
│   │
│   ├── PlannerPage/               # Academic planner full page
│   │   └── ResumeAnalyzerPage.jsx         # Wraps Dashboard, TaskCalendar, CreateTaskForm components
│   │
│   ├── ResumeAnalyzerPage/        # Resume analysis feature page
│   │   └── ResumeAnalyzerPage.jsx  # Wraps ResumeUploader and AnalysisReport
│   │
│   ├── CommunityPage/             # Community posts and announcements page
│   │   └── CommunityPage.jsx       # Integrates PostFilterTabs, PostCard feed, bookmarks
│   │
│   ├── InterviewPage/             # Interview with AI feature page
│   │   └── InterviewPage.jsx       # Wraps InterviewForm, InterviewList, and FeedbackReport
│   │
│   ├── AdminPanel/                # Admin dashboard and tools page
│   │   └── AdminPanel.jsx          # Wraps UserManagement, ContentModeration, AnalyticsDashboard
│   │
│   └── NotFound/                 # 404 error page for unmatched routes
│       └── NotFound.jsx
│
├── hooks/                        # Custom React hooks encapsulating specific logic
│   ├── useAuth.js                 # Authentication state and handlers
│   ├── useFetch.js                # Generic data fetching hook with loading/error states
│   ├── useNotes.js                # Note creation and update logic hook
│   ├── useTasks.js                # Task management hook (create, update, delete)
│   └── useCommunity.js            # Handles community post interactions, voting, bookmarking
│
├── contexts/                     # React contexts providing global state
│   ├── AuthContext.jsx            # Auth provider for user login status and info
│   ├── NotesContext.jsx           # Provides note data and actions app-wide
│   ├── TasksContext.jsx           # Task state/context for planner feature
│   ├── CommunityContext.jsx       # Community posts and bookmark state context
│   └── AdminContext.jsx           # Admin user and content moderation context
│
├── services/                    # Backend API interaction logic
│   ├── apiClient.js               # Axios or fetch instance with base URL and interceptors
│   ├── authService.js             # Auth-related backend API calls (login, signup)
│   ├── notesService.js            # CRUD API calls for notes
│   ├── tasksService.js            # API calls for task management
│   ├── communityService.js        # Posts creation, voting, commenting APIs
│   ├── resumeService.js           # Resume upload and AI feedback API
│   └── interviewService.js        # Interview creation, status, and feedback APIs
│
├── utils/                      # Helper functions and constants
│   ├── formatDate.js              # Format dates consistently across UI
│   ├── generateTags.js            # AI tag generation helper logic
│   ├── validateInput.js           # Input validation utilities and regex patterns
│   └── constants.js               # Static values like API endpoints, roles, priorities
│
├── styles/                    # Global CSS and Tailwind configuration
│   ├── index.css                  # Global styles including Tailwind imports
│   └── tailwind.config.js         # Tailwind CSS theme and customizations
│
├── App.jsx                    # Main React app component, holds Router setup with routes & layouts
├── main.jsx                   # Entry point, renders App into DOM with ReactDOM
└── vite-env.d.ts              # Vite environment type declarations (if using TypeScript)
