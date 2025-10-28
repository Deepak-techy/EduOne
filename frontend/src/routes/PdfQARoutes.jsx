// src/routes/PdfQARoutes.jsx
import { Routes, Route } from "react-router-dom";
import PdfQAHome from "../features/pdfQA/PdfQAHome";
import SubjectQA from "../features/pdfQA/SubjectQA";
import UploadPDF from "../features/pdfQA/UploadPDF";

const PdfQARoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PdfQAHome />} />
      <Route path="/subject" element={<SubjectQA />} />
      <Route path="/upload" element={<UploadPDF />} />
    </Routes>
  );
};

export default PdfQARoutes;
