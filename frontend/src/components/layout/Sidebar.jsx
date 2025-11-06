// src/components/layout/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home, PhoneCall, Info, Briefcase,
  FileQuestion, StickyNote, Calendar,
  FileCheck, Users, ShieldCheck,
  Menu, Plus, Minus
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: Briefcase, label: "Services", id: "services", path: "/" },
  { icon: PhoneCall, label: "Contact", id: "contact", path: "/" },
  { icon: Info, label: "About", id: "about", path: "/" },
];

const featuresItems = [
  {
    icon: FileQuestion,
    label: "PDF Q&A",
    path: "/pdf-qa",
    subFeatures: [
      { label: "Subject Q&A", path: "/pdf-qa/subject" },
      { label: "Upload PDF", path: "/pdf-qa/upload" }
    ]
  },
  {
    icon: StickyNote,
    label: "Notes Organizer",
    path: "/notes-organizer",
    subFeatures: [
      { label: "My Library", path: "/notes-organizer/library" },
      { label: "Create Note", path: "/notes-organizer/create" }
    ]
  },
  {
    icon: Calendar,
    label: "Academic Planner",
    path: "/academic-planner",
    subFeatures: []
  },
  {
    icon: FileCheck,
    label: "Resume Analyzer",
    path: "/resume-analyzer",
    subFeatures: []
  },
  {
    icon: Users,
    label: "Interview AI",
    path: "/interview-ai",
    subFeatures: []
  },
  {
    icon: Users,
    label: "Community",
    path: "/community",
    subFeatures: []
  },
  {
    icon: ShieldCheck,
    label: "Admin Panel",
    path: "/admin",
    subFeatures: []
  }
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    if (stored && setOpen) setOpen(true);
  }, []);

  const sidebarWidth = open ? 250 : 70;
  const isOnFeaturePage = location.pathname !== '/';

  const handleFeatureClick = (feature) => {
    navigate(feature.path);
  };

  const toggleExpand = (label, e) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavClick = (item) => {
    if (location.pathname === '/') {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const menuNavigation = user ? navItems : navItems.slice(0, 2);
  const menuFeatures = user ? featuresItems : [];

  return (
    <div
      className="fixed top-[80px] left-0 h-[calc(100vh-80px)] shadow-lg z-40"
      style={{
        width: sidebarWidth,
        // ✅ FIX: Solid background - no curves
        background: "linear-gradient(132deg, #e3fafd, #dcf2ff 84%)",
        border: "none",
        transition: "width 0.35s cubic-bezier(.72,-0.2,.25,1)",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex flex-col h-full">
        
        {/* Menu Toggle Button */}
        <div 
          className="flex-shrink-0 p-4 flex"
          style={{
            justifyContent: open ? 'flex-end' : 'center'
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
            const isActive = location.pathname === '/' && false;
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center ${
                  open ? "" : "justify-center"
                } mb-2 px-3 py-2.5 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
                  isOnFeaturePage 
                    ? "text-slate-900"
                    : `${isActive ? "bg-blue-100 text-blue-800 shadow font-semibold" : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"}`
                }`}
                style={{ height: "44px" }}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
                {open && <span className="ml-2">{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {user && <div className="mx-4 my-3 border-b border-slate-400 flex-shrink-0"></div>}

        {user && open && (
          <div className="px-6 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex-shrink-0">
            Features
          </div>
        )}

        {/* Features */}
        {user && (
          <nav className="px-3 pb-4 flex-grow">
            {menuFeatures.map((feature) => {
              const Icon = feature.icon;
              const isExpanded = expanded[feature.label];
              const isActive = location.pathname === feature.path || 
                               location.pathname.startsWith(feature.path + '/');

              return (
                <div key={feature.label} className="mb-1">
                  <div
                    className={`flex items-center ${
                      open ? "" : "justify-center"
                    } cursor-pointer select-none rounded-xl px-3 py-2.5 font-medium text-[15px] ${
                      isActive
                        ? "bg-blue-100 text-blue-800 shadow font-semibold"
                        : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    style={{ height: "44px" }}
                    title={feature.label}
                  >
                    {/* Icon + Label - Clickable to navigate */}
                    <div 
                      className="flex items-center flex-grow"
                      onClick={() => handleFeatureClick(feature)}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? "text-blue-700" : "text-slate-800"}`} />
                      {open && <span className="ml-2">{feature.label}</span>}
                    </div>
                    
                    {/* Plus/Minus Icon - Only toggle, don't navigate */}
                    {open && feature.subFeatures && feature.subFeatures.length > 0 && (
                      <div 
                        onClick={(e) => toggleExpand(feature.label, e)}
                        className="p-1 hover:bg-blue-200 rounded transition-colors"
                      >
                        {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                  
                  {/* Sub-features */}
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














// // src/components/layout/Sidebar.jsx

// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   Home, PhoneCall, Info, Briefcase,
//   FileQuestion, StickyNote, Calendar,
//   FileCheck, Users, ShieldCheck,
//   Menu, Plus, Minus
// } from "lucide-react";

// const navItems = [
//   { icon: Home, label: "Home", id: "home", path: "/" },
//   { icon: Briefcase, label: "Services", id: "services", path: "/" },
//   { icon: PhoneCall, label: "Contact", id: "contact", path: "/" },
//   { icon: Info, label: "About", id: "about", path: "/" },
// ];

// const featuresItems = [
//   {
//     icon: FileQuestion,
//     label: "PDF Q&A",
//     path: "/pdf-qa",
//     subFeatures: [
//       { label: "Subject Q&A", path: "/pdf-qa/subject" },
//       { label: "Upload PDF", path: "/pdf-qa/upload" }
//     ]
//   },
//   {
//     icon: StickyNote,
//     label: "Notes Organizer",
//     path: "/notes-organizer",
//     subFeatures: [
//       { label: "My Library", path: "/notes-organizer/library" },
//       { label: "Create Note", path: "/notes-organizer/create" }
//     ]
//   },
//   {
//     icon: Calendar,
//     label: "Academic Planner",
//     path: "/academic-planner",
//     subFeatures: []
//   },
//   {
//     icon: FileCheck,
//     label: "Resume Analyzer",
//     path: "/resume-analyzer",
//     subFeatures: []
//   },
//   {
//     icon: Users,
//     label: "Interview AI",
//     path: "/interview-ai",
//     subFeatures: []
//   },
//   {
//     icon: Users,
//     label: "Community",
//     path: "/community",
//     subFeatures: []
//   },
//   {
//     icon: ShieldCheck,
//     label: "Admin Panel",
//     path: "/admin",
//     subFeatures: []
//   }
// ];

// const Sidebar = ({ open, setOpen }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [expanded, setExpanded] = useState({});

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     setUser(stored ? JSON.parse(stored) : null);
//     if (stored && setOpen) setOpen(true);
//   }, []);

//   const sidebarWidth = open ? 250 : 70;
//   const isOnFeaturePage = location.pathname !== '/';

//   const handleFeatureClick = (feature) => {
//     navigate(feature.path);
//   };

//   const toggleExpand = (label, e) => {
//     e.stopPropagation();
//     setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
//   };

//   const handleNavClick = (item) => {
//     if (location.pathname === '/') {
//       const element = document.getElementById(item.id);
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//       }
//     } else {
//       navigate('/');
//       setTimeout(() => {
//         const element = document.getElementById(item.id);
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }
//       }, 100);
//     }
//   };

//   const menuNavigation = user ? navItems : navItems.slice(0, 2);
//   const menuFeatures = user ? featuresItems : [];

//   return (
//     <div
//       className="fixed left-4 z-40"
//       style={{
//         top: '100px',
//         width: sidebarWidth,
//         height: 'calc(100vh - 120px)',
//         background: `
//           linear-gradient(
//             135deg,
//             rgba(33, 150, 243, 0.15) 0%,
//             rgba(0, 188, 212, 0.15) 25%,
//             rgba(100, 181, 246, 0.15) 50%,
//             rgba(0, 188, 212, 0.15) 75%,
//             rgba(33, 150, 243, 0.15) 100%
//           )
//         `,
//         backdropFilter: "blur(20px)",
//         WebkitBackdropFilter: "blur(20px)",
//         borderRadius: open ? "32px" : "40px",
//         border: "2px solid rgba(33, 150, 243, 0.35)",
//         boxShadow: `
//           0 8px 32px rgba(33, 150, 243, 0.25),
//           0 16px 64px rgba(0, 188, 212, 0.15),
//           0 0 0 1px rgba(255, 255, 255, 0.6) inset
//         `,
//         transition: "all 0.35s cubic-bezier(.72,-0.2,.25,1)",
//         overflowY: "auto",
//         scrollbarWidth: "none",
//         msOverflowStyle: "none",
//       }}
//     >
//       <style>{`
//         div::-webkit-scrollbar { display: none; }
//       `}</style>

//       <div className="flex flex-col h-full">
//         <div 
//           className="flex-shrink-0 flex"
//           style={{
//             padding: open ? '12px 16px' : '12px 0',
//             justifyContent: open ? 'flex-end' : 'center'
//           }}
//         >
//           <Menu
//             className="w-6 h-6 text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
//             onClick={() => setOpen((o) => !o)}
//             title={open ? "Collapse menu" : "Expand menu"}
//           />
//         </div>

//         <nav className="px-3 flex-shrink-0">
//           {menuNavigation.map((item, index) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === '/' && false;
//             return (
//               <div
//                 key={item.id}
//                 onClick={() => handleNavClick(item)}
//                 className={`flex items-center ${
//                   open ? "" : "justify-center"
//                 } px-3 py-2 rounded-xl font-medium text-[15px] transition-all cursor-pointer ${
//                   isOnFeaturePage 
//                     ? "text-slate-900"
//                     : `${isActive ? "bg-blue-100 text-blue-800 shadow font-semibold" : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"}`
//                 }`}
//                 style={{ 
//                   height: "40px",
//                   marginBottom: index === menuNavigation.length - 1 ? '0' : '4px'
//                 }}
//                 title={item.label}
//               >
//                 <Icon className="w-5 h-5" />
//                 {open && <span className="ml-2">{item.label}</span>}
//               </div>
//             );
//           })}
//         </nav>

//         {user && <div className="mx-4 my-3 border-b border-slate-400 flex-shrink-0"></div>}

//         {user && open && (
//           <div className="px-6 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wider flex-shrink-0">
//             Features
//           </div>
//         )}

//         {user && (
//           <nav className="px-3 flex-grow" style={{ paddingBottom: '16px' }}>
//             {menuFeatures.map((feature, index) => {
//               const Icon = feature.icon;
//               const isExpanded = expanded[feature.label];
//               const isActive = location.pathname === feature.path || 
//                                location.pathname.startsWith(feature.path + '/');

//               return (
//                 <div key={feature.label} style={{ marginBottom: index === menuFeatures.length - 1 ? '0' : '4px' }}>
//                   <div
//                     className={`flex items-center ${
//                       open ? "" : "justify-center"
//                     } cursor-pointer select-none rounded-xl px-3 py-2 font-medium text-[15px] ${
//                       isActive
//                         ? "bg-blue-100 text-blue-800 shadow font-semibold"
//                         : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
//                     }`}
//                     style={{ height: "40px" }}
//                     title={feature.label}
//                   >
//                     <div 
//                       className="flex items-center flex-grow"
//                       onClick={() => handleFeatureClick(feature)}
//                     >
//                       <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-slate-800"}`} />
//                       {open && <span className="ml-2">{feature.label}</span>}
//                     </div>
                    
//                     {open && feature.subFeatures && feature.subFeatures.length > 0 && (
//                       <div 
//                         onClick={(e) => toggleExpand(feature.label, e)}
//                         className="p-1 hover:bg-blue-200 rounded transition-colors"
//                       >
//                         {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                       </div>
//                     )}
//                   </div>
                  
//                   {isExpanded && feature.subFeatures && feature.subFeatures.length > 0 && open && (
//                     <div className="ml-10 mt-1 flex flex-col space-y-1">
//                       {feature.subFeatures.map((sub) => {
//                         const isSubActive = location.pathname === sub.path;
//                         return (
//                           <Link
//                             key={sub.path}
//                             to={sub.path}
//                             className={`text-[14px] font-normal rounded-lg px-3 py-1.5 ${
//                               isSubActive
//                                 ? "bg-blue-200 text-blue-900 font-semibold"
//                                 : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
//                             }`}
//                           >
//                             {sub.label}
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </nav>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
