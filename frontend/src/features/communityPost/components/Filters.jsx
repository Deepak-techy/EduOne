import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

const Filters = ({ filter, setFilter, role, refreshPosts }) => {
  const tabs = ["all", "student", "teacher"];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">

      {/* Filter Tabs */}
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              filter === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Create Post Button */}
      <div>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {role === "teacher" ? "Create Announcement" : "Create Post"}
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