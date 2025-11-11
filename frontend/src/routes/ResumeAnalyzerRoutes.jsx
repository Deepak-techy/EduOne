import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import ResumeAnalyzerHome from '../features/resumeAnalyzer/ResumeAnalyzerHome';
import ResumeHistory from '../features/resumeAnalyzer/ResumeHistory';
import ResumeAnalysisResult from '../features/resumeAnalyzer/ResumeAnalysisResult';
import ResumeAnalyzerForm from '../features/resumeAnalyzer/ResumeAnalyzerForm';

// Import your components - adjust path as needed

const ResumeAnalyzerRoutes = () => {
  return (
        <Routes>
        <Route path="/" element={<ResumeAnalyzerHome />} />
        <Route path="/analyzer" element={<ResumeAnalyzerForm />} />
        <Route path="/result/:reportId" element={<ResumeAnalysisResult />} />
        <Route path="/history" element={<ResumeHistory />} />
      </Routes>
  );
}

export default ResumeAnalyzerRoutes;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ResumeAnalyzerHome from './features/resumeAnalyzer/ResumeAnalyzerHome';
// import ResumeAnalyzerForm from './features/resumeAnalyzer/ResumeAnalyzerForm';
// import ResumeAnalysisResult from './features/resumeAnalyzer/ResumeAnalysisResult';
// import ResumeHistory from './features/resumeAnalyzer/ResumeHistory';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Other routes */}
//         <Route path="/resume-analyzer" element={<ResumeAnalyzerHome />} />
//         <Route path="/resume-analyzer/analyzer" element={<ResumeAnalyzerForm />} />
//         <Route path="/resume-analyzer/result/:reportId" element={<ResumeAnalysisResult />} />
//         <Route path="/resume-analyzer/history" element={<ResumeHistory />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
