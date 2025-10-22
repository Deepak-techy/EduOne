import { Link, useLocation } from "react-router-dom";
import {
  Home, MessageSquare, FileQuestion, StickyNote, Calendar,
  FileCheck, Users, ShieldCheck, Menu
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: MessageSquare, label: "Contact", path: "/contact" },
  { icon: FileQuestion, label: "PDF Q&A", path: "/pdf-qa" },
  { icon: StickyNote, label: "Notes Organizer", path: "/notes-organizer" },
  { icon: Calendar, label: "Academic Planner", path: "/academic-planner" },
  { icon: FileCheck, label: "Resume Analyzer", path: "/resume-analyzer" },
  { icon: Users, label: "Interview AI", path: "/interview-ai" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: ShieldCheck, label: "Admin Panel", path: "/admin" }
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const isCollapsed = !open;
  const sidebarWidth = isCollapsed ? 62 : 225;

  return (
    <div
      className="shadow-lg"
      style={{
        width: sidebarWidth,
        minHeight: '410px',
        background: 'linear-gradient(132deg, #e3fafd, #dcf2ff 84%)',
        borderRadius: '21px',
        border: '1.5px solid #c2e4fa',
        transition: 'width 0.35s cubic-bezier(.72,-0.2,.25,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        marginRight: '2.8rem'
      }}
    >
      <div style={{
        padding: isCollapsed ? '15px 0 15px 0' : '16px 12px 12px 17px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        <Menu className={`w-6 h-6 text-slate-900 cursor-pointer`} onClick={() => setOpen(o => !o)} />
        {!isCollapsed && (
          <span className="font-bold text-lg text-[#1263c7] ml-2">EDUONE</span>
        )}
      </div>
      <nav style={{ marginTop: isCollapsed ? 20 : 14 }}>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center ${isCollapsed ? 'justify-center' : ''} mb-2 px-3 py-2.5 rounded-xl
                font-medium text-[15px] transition-all
                ${isActive
                  ? "bg-blue-100 text-blue-800 shadow font-semibold"
                  : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
              style={{
                height: '44px',
                transition: 'all 0.25s',
                paddingLeft: isCollapsed ? 0 : 15,
                paddingRight: isCollapsed ? 0 : 10
              }}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-blue-700" : "text-slate-800"}`} />
              {!isCollapsed && idx > 1 && <span className="ml-2">{item.label}</span>}
              {!isCollapsed && idx <= 1 && <span className="ml-2">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
