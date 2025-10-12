all coreect but folder structure wrong so detelete that from memory and save this one src/
│
├── assets/                                  # 📁 All static files (images, fonts, icons)
│   ├── images/                              # App banners, logos, and illustrations
│   │   └── logo.png                         # EDUONE logo
│   ├── fonts/                               # Custom fonts if you’re using any
│   └── icons/                               # SVG or PNG icons for UI
│       └── menu.svg
│
├── components/                              # 📁 Reusable UI and layout components (used in multiple pages)
│   ├── common/                              # Basic reusable UI components
│   │   ├── Button.jsx                       # Reusable button (props: text, type, onClick)
│   │   ├── Input.jsx                        # Custom input with validation or label
│   │   ├── Modal.jsx                        # Popup/modal window (used for create/edit tasks, etc.)
│   │   ├── Loader.jsx                       # Loading spinner for API calls
│   │   └── Alert.jsx                        # Alert box (success, error, warning)
│   │
│   ├── layout/                              # Layout components for structuring pages
│   │   ├── Navbar.jsx                       # Top navigation bar (logo, links, theme toggle, user menu)
│   │   ├── Sidebar.jsx                      # Left sidebar for navigation between features
│   │   ├── Footer.jsx                       # Bottom footer with credits
│   │   └── LayoutWrapper.jsx                # Wraps pages with Navbar + Sidebar (like a shell layout)
│   │
│   └── ui/                                  # Small generic UI components (optional)
│       └── ThemeToggle.jsx                  # Light/Dark mode switch button
│
├── features/                                # 📁 Each main app feature (independent module)
│   ├── PDFQA/                               # Feature 1: PDF Question-Answer System
│   │   ├── components/                      # UI parts specific to PDF Q&A
│   │   │   ├── DocumentUploader.jsx         # Handles PDF upload logic + Cloudinary integration
│   │   │   ├── PDFViewer.jsx                # Displays uploaded PDF for reading
│   │   │   ├── QuestionInput.jsx            # Textbox to ask questions about PDF content
│   │   │   └── AnswerDisplay.jsx            # Shows AI-generated answers
│   │   ├── hooks/                           # Hooks for data/state logic of this feature
│   │   │   └── usePDFQA.js
│   │   ├── services/                        # API calls related to PDF Q&A backend
│   │   │   └── pdfqaService.js
│   │   ├── store/                           # Zustand/Context store for this feature’s state
│   │   │   └── pdfqaStore.js
│   │   └── index.js                         # Exports all modules for easier imports
│   │
│   ├── NoteOrganizer/                       # Feature 2: Note Organizer
│   │   ├── components/                      # All note-related UI components
│   │   │   ├── NoteEditor.jsx               # Main note editor (title, content, tags)
│   │   │   ├── TagInput.jsx                 # Add/AI-generate tags for notes
│   │   │   ├── VoiceToTextButton.jsx        # Converts speech to text for quick note input
│   │   │   └── NotesList.jsx                # Displays list of created notes
│   │   ├── hooks/                           # Hooks for note logic
│   │   │   └── useNotes.js
│   │   ├── services/                        # API calls for CRUD operations on notes
│   │   │   └── notesService.js
│   │   ├── store/
│   │   │   └── notesStore.js
│   │   └── index.js
│   │
│   ├── AcademicPlanner/                     # Feature 3: Academic Planner
│   │   ├── components/
│   │   │   ├── Dashboard.jsx                # Overview dashboard (progress summary)
│   │   │   ├── TaskCalendar.jsx             # Monthly calendar UI with events/tasks
│   │   │   ├── TaskCard.jsx                 # Displays a single task with priority
│   │   │   └── CreateTaskForm.jsx           # Form to add/edit tasks
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── services/
│   │   │   └── tasksService.js
│   │   ├── store/
│   │   │   └── tasksStore.js
│   │   └── index.js
│   │
│   ├── ResumeAnalyzer/                      # Feature 4: Resume Analyzer
│   │   ├── components/
│   │   │   ├── ResumeUploader.jsx           # Upload resume file (PDF/DOC)
│   │   │   └── AnalysisReport.jsx           # AI feedback + suggestions display
│   │   ├── services/
│   │   │   └── resumeService.js
│   │   └── index.js
│   │
│   ├── CommunityPost/                       # Feature 5: Community Feed
│   │   ├── components/
│   │   │   ├── PostCard.jsx                 # Displays individual post
│   │   │   ├── PostFilterTabs.jsx           # Filters: All / Student / Teacher
│   │   │   ├── CreatePostButton.jsx         # Button to open “create post” modal
│   │   │   └── BookmarkedPostsSidebar.jsx   # Sidebar showing bookmarked posts
│   │   ├── services/
│   │   │   └── communityService.js
│   │   └── index.js
│   │
│   ├── InterviewWithAI/                     # Feature 6: AI Interviews
│   │   ├── components/
│   │   │   ├── InterviewForm.jsx            # Form to create interview
│   │   │   ├── InterviewList.jsx            # List of created interviews
│   │   │   └── FeedbackReport.jsx           # AI-generated interview feedback
│   │   └── index.js
│   │
│   └── AdminTools/                          # Feature 7: Admin Tools
│       ├── components/
│       │   ├── UserManagement.jsx           # Manage users/roles
│       │   ├── ContentModeration.jsx        # Review and moderate posts
│       │   ├── AnalyticsDashboard.jsx       # Charts, stats for admin
│       │   └── SystemAnnouncements.jsx      # Create announcements
│       └── index.js
│
├── pages/                                   # 📁 Each route-level page
│   ├── Home/                                # Landing page
│   │   └── Home.jsx
│   ├── Login/
│   │   └── Login.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── NotFound/
│   │   └── NotFound.jsx
│   └── ... (other pages matching features)
│
├── layouts/                                 # 📁 Layouts that define page structure
│   ├── MainLayout.jsx                       # Public layout (Navbar + Footer)
│   ├── DashboardLayout.jsx                  # Authenticated layout (Sidebar + Navbar)
│   └── AuthLayout.jsx                       # For login/register pages
│
├── hooks/                                   # 📁 Custom global hooks
│   ├── useAuth.js                           # Handles login/logout logic
│   ├── useTheme.js                          # Handles light/dark mode switching
│   └── useFetch.js                          # Generic fetch hook for API data
│
├── store/                                   # 📁 Global state (Zustand or Context)
│   ├── authStore.js                         # Global authentication state
│   ├── themeStore.js                        # Stores current theme (light/dark)
│   └── index.js
│
├── services/                                # 📁 Global API calls setup
│   ├── apiClient.js                         # Axios/fetch config with base URL
│   └── authService.js                       # Handles login/signup endpoints
│
├── utils/                                   # 📁 Helper functions
│   ├── formatDate.js                        # Converts timestamps to readable format
│   ├── validateInput.js                     # Input validation regex
│   └── constants.js                         # Static constants like roles, URLs
│
├── contexts/                                # 📁 Global React Contexts
│   ├── AuthContext.jsx                      # Provides auth state across app
│   └── ThemeContext.jsx                     # Provides light/dark mode globally
│
├── styles/                                  # 📁 Tailwind & CSS setup
│   ├── index.css                            # Main CSS file
│   └── tailwind.config.js                   # Tailwind customization (colors, fonts)
│
├── App.jsx                                  # App entry component (contains Router + Theme)
├── main.jsx                                 # ReactDOM render root
└── vite-env.d.ts                            # Type definitions for Vite
