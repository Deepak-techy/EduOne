// src/routes/NotesRoutes.jsx - ADD DASHBOARD
import { Routes, Route } from "react-router-dom";
import NotesHome from "../features/notes/NotesHome";        // ← NEW
import NotesLibrary from "../features/notes/NotesLibrary";
import CreateNote from "../features/notes/CreateNote";

const NotesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NotesHome />} />            {/* ← Dashboard */}
      <Route path="/library" element={<NotesLibrary />} />  {/* ← Changed route */}
      <Route path="/create" element={<CreateNote />} />
      <Route path="/edit/:noteId" element={<CreateNote />} />
    </Routes>
  );
};

export default NotesRoutes;
