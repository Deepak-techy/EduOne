import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,  
  PhoneCall,   // Contact
  Info,        // About
  Briefcase,   // Services
  FileQuestion,
  StickyNote,
  Calendar,
  FileCheck,
  Users,
  ShieldCheck,
  Menu,
  Plus,
  Minus
} from "lucide-react";


// Navigation items - using section IDs for smooth scroll
const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Briefcase, label: "Services", id: "services" },
  { icon: PhoneCall, label: "Contact", id: "contact" },
  { icon: Info, label: "About", id: "about" },
];


// Add subfeatures for demo—expand for all features!
const featuresItems = [
  {
    icon: FileQuestion,
    label: "PDF Q&A",
    path: "/pdf-qa",
    subFeatures: [
      { label: "Upload PDF", path: "/pdf-qa/upload" },
      { label: "View Questions", path: "/pdf-qa/questions" }
    ]
  },
  {
    icon: StickyNote,
    label: "Notes Organizer",
    path: "/notes-organizer",
    subFeatures: [
      { label: "Create Note", path: "/notes-organizer/create" },
      { label: "View Notes", path: "/notes-organizer/list" }
    ]
  },
  {
    icon: Calendar,
    label: "Academic Planner",
    path: "/academic-planner",
    subFeatures: [
      { label: "Add Schedule", path: "/academic-planner/add" },
      { label: "View Calendar", path: "/academic-planner/calendar" }
    ]
  },
  {
    icon: FileCheck,
    label: "Resume Analyzer",
    path: "/resume-analyzer",
    subFeatures: [
      { label: "Upload Resume", path: "/resume-analyzer/upload" }
    ]
  },
  {
    icon: Users,
    label: "Interview AI",
    path: "/interview-ai",
    subFeatures: [
      { label: "Practice Interviews", path: "/interview-ai/practice" }
    ]
  },
  {
    icon: Users,
    label: "Community",
    path: "/community",
    subFeatures: [
      { label: "Join Group", path: "/community/groups" },
      { label: "Forum", path: "/community/forum" }
    ]
  },
  {
    icon: ShieldCheck,
    label: "Admin Panel",
    path: "/admin",
    subFeatures: [
      { label: "User Manager", path: "/admin/users" },
      { label: "Reports", path: "/admin/reports" }
    ]
  }
];


// Minimal sidebar menu for logged out users
const publicMenuItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: PhoneCall, label: "Contact", id: "contact" }
];


const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [activeSection, setActiveSection] = useState("home");


  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);


    // Open sidebar by default after login
    if (stored && setOpen) setOpen(true);
  }, []);


  // All icons always show, even when collapsed (labels can hide)
  const sidebarWidth = open ? 250 : 70;


  // Expand/collapse features
  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };


  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };


  // Menus
  const menuNavigation = user ? navItems : publicMenuItems;
  const menuFeatures = user ? featuresItems : [];


  return (
    <div
      className="fixed top-[80px] left-0 h-[calc(100vh-80px)] shadow-lg z-40"
      style={{
        width: sidebarWidth,
        background: "linear-gradient(132deg, #e3fafd, #dcf2ff 84%)",
        borderRadius: "0 21px 21px 0",
        border: "1.5px solid #c2e4fa",
        transition: "width 0.35s cubic-bezier(.72,-0.2,.25,1)",
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      {/* Hide scrollbar for Chrome/Safari/Opera */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>


      <div className="flex flex-col h-full">
        {/* Menu Toggle Button - Fixed Position */}
        <div 
          className="flex-shrink-0"
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-end" : "center"
          }}
        >
          <Menu
            className="w-6 h-6 text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setOpen((o) => !o)}
            title={open ? "Collapse menu" : "Expand menu"}
          />
        </div>


        {/* Navigation */}
        <nav className="px-3 flex-shrink-0">
          {menuNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <div
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center ${open ? "" : "justify-center"} mb-2 px-3 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-100 text-blue-800 shadow font-semibold"
                    : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                }`}
                style={{
                  height: "44px",
                  transition: "all 0.25s"
                }}
                title={item.label}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-blue-700" : "text-slate-800"}`} />
                {open && <span className="ml-2">{item.label}</span>}
              </div>
            );
          })}
        </nav>


        {/* Line separator */}
        {user && <div className="mx-4 my-3 border-b border-slate-400 flex-shrink-0"></div>}


        {/* Features Label */}
        {user && open && (
          <div className="px-6 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex-shrink-0">
            Features
          </div>
        )}


        {/* Features - Scrollable Area */}
        {user && (
          <nav className="px-3 pb-4 flex-grow">
            {menuFeatures.map((feature) => {
              const Icon = feature.icon;
              const isExpanded = expanded[feature.label];
              const isActive = location.pathname === feature.path;


              return (
                <div key={feature.label} className="mb-1">
                  <div
                    className={`flex items-center ${open ? "" : "justify-center"} cursor-pointer select-none rounded-xl px-3 py-2.5 font-medium text-[15px] ${
                      isActive
                        ? "bg-blue-100 text-blue-800 shadow font-semibold"
                        : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    style={{ height: "44px" }}
                    onClick={() =>
                      feature.subFeatures && feature.subFeatures.length > 0
                        ? toggleExpand(feature.label)
                        : null
                    }
                    title={feature.label}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? "text-blue-700" : "text-slate-800"}`} />
                    {open && <span className="ml-2 flex-grow">{feature.label}</span>}
                    {feature.subFeatures && feature.subFeatures.length > 0 && (
                      open ? (
                        isExpanded ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )
                      ) : null
                    )}
                  </div>
                  {isExpanded && feature.subFeatures && feature.subFeatures.length > 0 && open && (
                    <div className="ml-10 mt-1 flex flex-col space-y-1">
                      {feature.subFeatures.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`text-[14px] font-normal rounded-lg px-3 py-2 ${
                              isSubActive
                                ? "bg-blue-200 text-blue-900 font-semibold"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};


export default Sidebar;
