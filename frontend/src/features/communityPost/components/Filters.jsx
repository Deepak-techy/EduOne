import CreatePostModal from "./CreatePostModal";
import { useState } from "react";
import { Plus, Megaphone } from "lucide-react";

const Filters = ({ filter, setFilter, role, refreshPosts }) => {
  const tabs = [
    { key: "all", label: "All Posts" },
    { key: "student", label: "Students" },
    { key: "announcement", label: "Announcements", icon: Megaphone },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

      {/* Filter Tabs - Glassmorphism */}
      <div className="flex bg-white/40 dark:bg-gray-800/60 backdrop-blur-md p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
              filter === tab.key 
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Post Button */}
      <div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
        >
          <Plus size={18} />
          {role === "Admin" ? "Create Announcement" : "Create Post"}
        </button>
      </div>

      <CreatePostModal
        open={open}
        setOpen={setOpen}
        role={role}
        refreshPosts={refreshPosts}
      />

    </div>
  );
};

export default Filters;