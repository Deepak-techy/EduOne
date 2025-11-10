import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResumeAnalyzer from '../features/resumeAnalyzer/ResumeAnalyzer';
import ResumeAnalyzerHome from '../features/resumeAnalyzer/ResumeAnalyzerHome';
import ResumeHistory from '../features/resumeAnalyzer/ResumeHistory';

// Import your components - adjust path as needed

const ResumeAnalyzerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ResumeAnalyzerHome />} />
      <Route path="/analyzer" element={<ResumeAnalyzer />} />
      <Route path="/report/:reportId" element={<ResumeAnalyzer />} />
      <Route path="/history" element={<ResumeHistory />} />


    </Routes>
  );
}

export default ResumeAnalyzerRoutes;
