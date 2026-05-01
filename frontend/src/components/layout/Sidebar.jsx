// src/components/layout/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Home,
  PhoneCall,
  Info,
  Briefcase,
  FileQuestion,
  StickyNote,
  Calendar,
  FileCheck,
  Users,
  ShieldCheck,
  Menu,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: Briefcase, label: "Services", id: "services", path: "/" },
  { icon: Info, label: "About", id: "about", path: "/" },
  { icon: PhoneCall, label: "Contact", id: "contact", path: "/" },
];

const featuresItems = [
  {
    icon: FileQuestion,
    label: "PDF Q&A",
    path: "/pdf-qa",
    subFeatures: [
      { label: "Subject Q&A", path: "/pdf-qa/subject" },
      { label: "Upload PDF", path: "/pdf-qa/upload" },
    ],
  },
  {
    icon: StickyNote,
    label: "Notes Organizer",
    path: "/notes-organizer",
    subFeatures: [
      { label: "My Library", path: "/notes-organizer/library" },
      { label: "Create Note", path: "/notes-organizer/create" },
    ],
  },
  {
    icon: Calendar,
    label: "Academic Planner",
    path: "/academic-planner/dashboard",
    subFeatures: [
      { label: "View Tasks", path: "/academic-planner/view-tasks" },
      { label: "Create Tasks", path: "/academic-planner/create-task" },
      { label: "Priority Tasks", path: "/academic-planner/priority-tasks" },
    ],
  },
  {
    icon: FileCheck,
    label: "Resume Analyzer",
    path: "/resume-analyzer",
    subFeatures: [
      { label: "Analyze Resume", path: "/resume-analyzer/analyzer" },
      { label: "View Past Reports", path: "/resume-analyzer/history" },
    ],
  },
  {
    icon: Users,
    label: "Interview AI",
    path: "/interview-ai",
    subFeatures: [],
  },
  { 
    icon: Users, 
    label: "Community", 
    path: "/community", 
    subFeatures: [
      { label: "Community Feed", path: "/community/feed" },
      { label: "My Profile", path: "/community/profile" },
    ] 
  },
  { icon: ShieldCheck, label: "Admin Panel", path: "/admin", subFeatures: [] },
];

const FEATURE_ROOTS = [
  "/pdf-qa",
  "/notes-organizer",
  "/academic-planner/dashboard",
  "/resume-analyzer",
  "/interview-ai",
  "/community",
  "/admin",
];

const isFeatureRoot = (pathname) =>
  FEATURE_ROOTS.some((root) => pathname === root);

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState({});
  const sidebarRef = useRef(null);

  // ✅ Track if initial open has happened
  const initialOpenDone = useRef(false);

  if (!user) {
    return null;
  }

  // ✅ SIMPLIFIED: Open sidebar on first mount only
  useEffect(() => {
    if (!setOpen || !user) return;

    // Open sidebar ONCE when component first mounts
    if (!initialOpenDone.current) {
      initialOpenDone.current = true;
      setOpen(true);
    }
  }, [user, setOpen]);

  // Handle route-based sidebar behavior (runs AFTER initial open)
  useEffect(() => {
    if (!setOpen || !user) return;

    // Skip if this is the very first render
    if (!initialOpenDone.current) return;

    // Feature dashboard roots → open
    if (isFeatureRoot(location.pathname)) {
      setOpen(true);
      return;
    }

    // All other pages → close
    setOpen(false);
  }, [location.pathname, user, setOpen]);

  // Click outside closes sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[data-sidebar-toggle="true"]')
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen]);

  const sidebarWidth = open ? 250 : 70;
  const isOnFeaturePage = location.pathname !== "/";

  const handleFeatureClick = (feature) => {
    if (location.pathname === feature.path && !open) {
      setOpen(true);
    } else {
      navigate(feature.path);
    }
  };

  const toggleExpand = (label, e) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavClick = (item) => {
    if (location.pathname === "/") {
      const element = document.getElementById(item.id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed top-[80px] left-0 h-[calc(100vh-80px)] shadow-lg z-40"
      style={{
        width: sidebarWidth,
        background: "linear-gradient(132deg, #e3fafd, #dcf2ff 84%)",
        border: "none",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      <div className="flex flex-col h-full">
        <div
          className="flex-shrink-0 p-4 flex"
          style={{ justifyContent: open ? "flex-end" : "center" }}
        >
          <Menu
            className="w-6 h-6 text-slate-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            onClick={() => setOpen((o) => !o)}
            data-sidebar-toggle="true"
            title="Toggle menu"
          />
        </div>

        <nav className="px-3 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === "/" && false;
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center ${
                  open ? "" : "justify-center"
                } mb-2 px-3 py-2.5 rounded-xl font-medium text-[15px] transition-all duration-200 cursor-pointer ${
                  isOnFeaturePage
                    ? "text-slate-900"
                    : `${
                        isActive
                          ? "bg-blue-100 text-blue-800 shadow font-semibold"
                          : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                      }`
                }`}
                style={{ height: "44px" }}
                title={item.label}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {open && (
                  <span
                    className="ml-2 whitespace-nowrap overflow-hidden transition-opacity duration-200"
                    style={{ opacity: open ? 1 : 0 }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mx-4 my-3 border-b border-slate-400 flex-shrink-0" />

        {open && (
          <div
            className="px-6 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex-shrink-0 transition-opacity duration-200"
            style={{ opacity: open ? 1 : 0 }}
          >
            Features
          </div>
        )}

        <nav className="px-3 pb-4 flex-grow">
          {featuresItems.map((feature) => {
            const Icon = feature.icon;
            const isExpanded = expanded[feature.label];
            const isActive =
              location.pathname === feature.path ||
              location.pathname.startsWith(feature.path + "/");

            return (
              <div key={feature.label} className="mb-1">
                <div
                  className={`flex items-center ${
                    open ? "" : "justify-center"
                  } cursor-pointer select-none rounded-xl px-3 py-2.5 font-medium text-[15px] transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-800 shadow font-semibold"
                      : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  style={{ height: "44px" }}
                  title={feature.label}
                >
                  <div
                    className="flex items-center flex-grow"
                    onClick={() => handleFeatureClick(feature)}
                  >
                    <Icon
                      className={`w-6 h-6 flex-shrink-0 ${
                        isActive ? "text-blue-700" : "text-slate-800"
                      }`}
                    />
                    {open && (
                      <span
                        className="ml-2 whitespace-nowrap overflow-hidden transition-opacity duration-200"
                        style={{ opacity: open ? 1 : 0 }}
                      >
                        {feature.label}
                      </span>
                    )}
                  </div>

                  {open &&
                    feature.subFeatures &&
                    feature.subFeatures.length > 0 && (
                      <div
                        onClick={(e) => toggleExpand(feature.label, e)}
                        className="p-1 hover:bg-blue-200 rounded transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </div>
                    )}
                </div>

                {isExpanded &&
                  feature.subFeatures &&
                  feature.subFeatures.length > 0 &&
                  open && (
                    <div
                      className="ml-10 mt-1 flex flex-col space-y-1"
                      style={{ animation: "slideDown 0.2s ease-out" }}
                    >
                      {feature.subFeatures.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`text-[14px] font-normal rounded-lg px-3 py-2 transition-all duration-200 ${
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
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
