import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import ResumeAnalyzerHome from '../features/resumeAnalyzer/ResumeAnalyzerHome';
import ResumeHistory from '../features/resumeAnalyzer/ResumeHistory';
import ResumeAnalysisResult from '../features/resumeAnalyzer/ResumeAnalysisResult';
import ResumeAnalyzerForm from '../features/resumeAnalyzer/ResumeAnalyzerForm';

// Import your components - adjust path as needed

const ResumeAnalyzerRoutes = () => {
  return (
        <><Routes>
        <Route path="/" element={<ResumeAnalyzerHome />} />
        <Route path="/analyzer" element={<ResumeAnalyzerForm />} />
        <Route path="/result/:reportId" element={<ResumeAnalysisResult />} />
        <Route path="/history" element={<ResumeHistory />} />
      </Routes>
      </>
  );
}

export default ResumeAnalyzerRoutes;

