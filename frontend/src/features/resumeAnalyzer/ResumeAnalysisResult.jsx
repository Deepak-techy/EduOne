// import {
//   Award,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Sparkles,
//   FileText,
//   Download,
//   Tag,
// } from 'lucide-react';
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { resumeService } from '../../services/resumeService';
// import MarkdownRenderer from '../../components/common/MarkdownRenderer';

// const POLL_COLORS = [
//   { bg: '#FFF4E6', border: '#FFB84D', font: '#8B5A00' },
//   { bg: '#E3F2FD', border: '#64B5F6', font: '#1565C0' },
//   { bg: '#E8F5E9', border: '#81C784', font: '#2E7D32' },
//   { bg: '#F3E5F5', border: '#BA68C8', font: '#6A1B9A' },
//   { bg: '#FCE4EC', border: '#F48FB1', font: '#AD1457' },
// ];

// const mainGradient = 'linear-gradient(180deg, #e8f0fe, #c5e3f6, #a2d5ed)';

// const ResumeAnalysisResult = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [reportData, setReportData] = useState(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isBackHovered, setIsBackHovered] = useState(false);

//   // Dropdown toggle states, default closed for Strengths and Improvements
//   const [showStrengths, setShowStrengths] = useState(false);
//   const [showImprovements, setShowImprovements] = useState(false);
//   const [showMissingKeywords, setShowMissingKeywords] = useState(true);

//   useEffect(() => {
//     const loadResumeData = async () => {
//       if (location.state?.reportData) {
//         const data = location.state.reportData;
//         const mappedData = {
//           _id: data._id || Date.now().toString(),
//           fullName: data.fullName || 'Unknown',
//           jobRole: data.jobRole || 'Not specified',
//           experienceLevel: data.experienceLevel || 'Not specified',
//           score: data.score || data.overallScore || 0,
//           improvements: data.improvements || data.suggestions || [],
//           strengths: data.strengths || [],
//           categoryScores: data.categoryScores || {},
//           missingKeywords: data.missingKeywords || [],
//           fileName: data.fileName || 'Resume.pdf',
//           fileType: 'application/pdf',
//           fileUrl: data.fileUrl,
//           createdAt: data.createdAt || new Date().toISOString(),
//         };
//         setReportData(mappedData);
//         setLoading(false);
//       } else {
//         const pathParts = window.location.pathname.split('/');
//         const resumeId = pathParts[pathParts.length - 1];
//         if (resumeId && resumeId !== 'result' && resumeId !== 'new') {
//           try {
//             const response = await resumeService.getResumeById(resumeId);
//             let data = response;
//             if (response.data) data = response.data;
//             if (response.data && response.data.data) data = response.data.data;
//             const score =
//               data.score ||
//               data.overallScore ||
//               (data.analysisResult && data.analysisResult.score) ||
//               (data.analysisResult && data.analysisResult.overallScore) ||
//               0;
//             const mappedData = {
//               _id: data._id || resumeId,
//               fullName: data.fullName || data.candidateName || 'Unknown',
//               jobRole: data.jobRole || 'Not specified',
//               experienceLevel: data.experienceLevel || data.experience || 'Not specified',
//               score: score,
//               improvements:
//                 data.improvements ||
//                 data.suggestions ||
//                 (data.analysisResult && data.analysisResult.suggestions) ||
//                 (data.analysisResult && data.analysisResult.improvements) ||
//                 [],
//               strengths:
//                 data.strengths || (data.analysisResult && data.analysisResult.strengths) || [],
//               categoryScores:
//                 data.categoryScores ||
//                 (data.analysisResult && data.analysisResult.categoryScores) ||
//                 {},
//               missingKeywords:
//                 data.missingKeywords ||
//                 (data.analysisResult && data.analysisResult.missingKeywords) ||
//                 [],
//               fileName: data.resumeFilename || data.fileName || 'Resume.pdf',
//               fileType: 'application/pdf',
//               fileUrl: data.resumeUrl || data.fileUrl || null,
//               createdAt: data.createdAt || new Date().toISOString(),
//             };
//             setReportData(mappedData);
//             setLoading(false);
//           } catch (error) {
//             setError('Failed to load resume data');
//             setLoading(false);
//             setTimeout(() => {
//               toast.error('Failed to load resume data. Redirecting to analyzer...');
//               navigate('/resume-analyzer/analyzer');
//             }, 1000);
//           }
//         } else {
//           toast.error('No report data found. Please analyze a resume first.');
//           navigate('/resume-analyzer/analyzer');
//         }
//       }
//     };
//     loadResumeData();
//   }, [location, navigate]);

//   const getScoreColor = (score) => {
//     if (score >= 80) return [16, 185, 129];
//     if (score >= 65) return [6, 182, 212];
//     return [239, 68, 68];
//   };

//   const hexToRgb = (hex) => [
//     parseInt(hex.substr(1, 2), 16),
//     parseInt(hex.substr(3, 2), 16),
//     parseInt(hex.substr(5, 2), 16),
//   ];

//   const markdownArrToLines = (arr) =>
//     arr.flatMap((text) =>
//       text
//         .split(/\n/g)
//         .map((line) =>
//           line
//             .replace(/^\s*[\-\*\d\.]+\s*/, '')
//             .replace(/\*\*(.*?)\*\*/g, '$1')
//             .replace(/\*(.*?)\*/g, '$1')
//         )
//     );

//   const handleDownloadPDF = async () => {
//     setIsDownloading(true);
//     try {
//       const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const margin = 18;
//       const contentWidth = pageWidth - margin * 2;
//       let y = margin;

//       pdf.setFillColor(6, 182, 212);
//       pdf.rect(0, 0, pageWidth, 22, 'F');
//       pdf.setTextColor(255, 255, 255);
//       pdf.setFontSize(20);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Resume Analysis Report', margin, 13);
//       pdf.setFontSize(10);
//       pdf.text('AI-Powered Resume Evaluation', margin, 18);
//       y = 28;

//       pdf.setFillColor(207, 250, 254);
//       pdf.roundedRect(margin, y, contentWidth, 26, 6, 6, 'F');
//       pdf.setDrawColor(165, 243, 252);
//       pdf.setLineWidth(0.8);
//       pdf.roundedRect(margin, y, contentWidth, 26, 6, 6);
//       pdf.setTextColor(8, 145, 178);
//       pdf.setFont('helvetica', 'bold');
//       pdf.setFontSize(12);
//       pdf.text(`Candidate: ${reportData.fullName}`, margin + 4, y + 7);
//       pdf.text(`Role: ${reportData.jobRole || 'N/A'}`, margin + 4, y + 14);
//       pdf.text(`Experience: ${reportData.experienceLevel || 'N/A'}`, margin + 4, y + 21);
//       y += 32;

//       pdf.setFontSize(30);
//       pdf.setFont('helvetica', 'bold');
//       const scoreColor = getScoreColor(reportData.score);
//       pdf.setDrawColor(...scoreColor);
//       pdf.setFillColor(...scoreColor);
//       pdf.circle(pageWidth / 2, y + 23, 20, 'FD');
//       pdf.setTextColor(255, 255, 255);
//       pdf.text(`${reportData.score}`, pageWidth / 2, y + 27, { align: 'center' });
//       pdf.setFontSize(12);
//       pdf.text('/100', pageWidth / 2, y + 34, { align: 'center' });
//       y += 50;

//       if (reportData.categoryScores && Object.keys(reportData.categoryScores).length > 0) {
//         const color = POLL_COLORS[1];
//         pdf.setFillColor(...hexToRgb(color.bg));
//         pdf.setDrawColor(...hexToRgb(color.border));
//         pdf.setFont('georgia', 'bold');
//         pdf.setFontSize(13);
//         pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
//         pdf.setTextColor(...hexToRgb(color.font));
//         pdf.text('Category Scores', margin + 3, y + 6);
//         y += 11;
//         pdf.setFont('georgia', 'normal');
//         pdf.setFontSize(10);
//         Object.entries(reportData.categoryScores).forEach(([k, v]) => {
//           pdf.text(`${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}%`, margin + 7, y);
//           y += 6;
//         });
//         y += 3;
//       }

//       if (reportData.strengths?.length) {
//         const color = POLL_COLORS[2];
//         pdf.setFillColor(...hexToRgb(color.bg));
//         pdf.setDrawColor(...hexToRgb(color.border));
//         pdf.setFont('georgia', 'bold');
//         pdf.setFontSize(13);
//         pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
//         pdf.setTextColor(...hexToRgb(color.font));
//         pdf.text('Strengths', margin + 3, y + 6);
//         y += 11;
//         pdf.setFont('georgia', 'normal');
//         pdf.setFontSize(10);
//         pdf.setTextColor(...hexToRgb(color.font));
//         for (const line of markdownArrToLines(reportData.strengths)) {
//           pdf.text(line, margin + 7, y);
//           y += 6;
//           if (y > pageHeight - 25) {
//             pdf.addPage();
//             y = margin;
//           }
//         }
//         y += 3;
//       }

//       if (reportData.improvements?.length) {
//         const color = POLL_COLORS[0];
//         pdf.setFillColor(...hexToRgb(color.bg));
//         pdf.setDrawColor(...hexToRgb(color.border));
//         pdf.setFont('georgia', 'bold');
//         pdf.setFontSize(13);
//         pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
//         pdf.setTextColor(...hexToRgb(color.font));
//         pdf.text('Improvements', margin + 3, y + 6);
//         y += 11;
//         pdf.setFont('georgia', 'normal');
//         pdf.setFontSize(10);
//         pdf.setTextColor(...hexToRgb(color.font));
//         for (const line of markdownArrToLines(reportData.improvements)) {
//           pdf.text(line, margin + 7, y);
//           y += 6;
//           if (y > pageHeight - 25) {
//             pdf.addPage();
//             y = margin;
//           }
//         }
//         y += 3;
//       }

//       if (reportData.missingKeywords?.length) {
//         const color = POLL_COLORS[3];
//         pdf.setFillColor(...hexToRgb(color.bg));
//         pdf.setDrawColor(...hexToRgb(color.border));
//         pdf.setFont('georgia', 'bold');
//         pdf.setFontSize(13);
//         pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
//         pdf.setTextColor(...hexToRgb(color.font));
//         pdf.text('Missing Keywords', margin + 3, y + 6);
//         y += 11;
//         pdf.setFont('georgia', 'normal');
//         pdf.setFontSize(10);
//         pdf.setTextColor(...hexToRgb(color.font));
//         for (const word of reportData.missingKeywords) {
//           pdf.text(`• ${word}`, margin + 7, y);
//           y += 6;
//           if (y > pageHeight - 25) {
//             pdf.addPage();
//             y = margin;
//           }
//         }
//         y += 3;
//       }

//       pdf.setFontSize(9);
//       pdf.setFont('helvetica', 'italic');
//       pdf.setTextColor(100, 116, 139);
//       pdf.text('Generated by EduOne Resume Analyzer', pageWidth / 2, pageHeight - 10, { align: 'center' });
//       pdf.save(`Resume_Analysis_${reportData.fullName?.replace(/\s+/g, '_') || 'Unknown'}_${Date.now()}.pdf`);
//     } catch (err) {
//       toast.error('Failed to generate PDF. Please try again.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const getScoreMessage = (score) => {
//     if (score < 50) return 'Needs Improvement';
//     if (score < 85) return 'Good';
//     return 'Excellent';
//   };

//   if (loading || !reportData) {
//     return (
//       <div
//         style={{
//           minHeight: '100vh',
//           background: mainGradient,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <ToastContainer position="top-right" autoClose={2500} />
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         background: '#e8f0fe',
//         padding: '20px 10px',
//         fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
//       }}
//     >
//       <div
//         style={{
//           maxWidth: '1600px',
//           margin: '0 auto',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         {/* Header Buttons */}
//         <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', justifyContent: 'space-between' }}>
//           <button
//             onClick={() => navigate('/resume-analyzer')}
//             onMouseEnter={() => setIsBackHovered(true)}
//             onMouseLeave={() => setIsBackHovered(false)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px',
//               background: 'none',
//               border: 'none',
//               borderRadius: '6px',
//               padding: '2px 6px',
//               fontSize: '0.9rem',
//               fontWeight: 700,
//               color: isBackHovered ? '#0369a1' : '#0891b2',
//               cursor: 'pointer',
//               marginBottom: '6px',
//               transition: 'color 0.2s',
//             }}
//           >
//             <ArrowLeft size={30} color={isBackHovered ? '#0369a1' : '#0891b2'} />
//           </button>

//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button
//               onClick={() => navigate('/resume-analyzer/history')}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 background: 'white',
//                 color: '#0891b2',
//                 border: '2px solid #7dd3fc',
//                 borderRadius: '12px',
//                 padding: '6px 14px',
//                 fontSize: '0.95rem',
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 boxShadow: '0 2px 8px rgba(125,211,252,0.15)',
//               }}
//             >
//               <FileText size={16} /> Reports
//             </button>

//             <button
//               onClick={handleDownloadPDF}
//               disabled={isDownloading}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 background: isDownloading ? '#94a3b8' : '#0ea5e9',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '12px',
//                 padding: '6px 14px',
//                 fontSize: '0.95rem',
//                 fontWeight: 700,
//                 cursor: isDownloading ? 'not-allowed' : 'pointer',
//                 boxShadow: '0 4px 12px rgba(14,165,233,0.4)',
//                 transition: 'background-color 0.2s',
//               }}
//               onMouseEnter={e => !isDownloading && (e.currentTarget.style.backgroundColor = '#0284c7')}
//               onMouseLeave={e => !isDownloading && (e.currentTarget.style.backgroundColor = '#0ea5e9')}
//             >
//               {isDownloading ? (
//                 <>
//                   <Sparkles size={16} style={{ animation: 'spin 1.2s linear infinite' }} /> Generating...
//                 </>
//               ) : (
//                 <>
//                   <Download size={16} /> Download
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Main content grid */}
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: '1fr 1fr',
//             gap: '40px',
//             alignItems: 'stretch',
//             flex: '1 1 auto',
//             minHeight: 0,
//           }}
//         >
//           {/* LEFT PANEL */}
//           <div
//             style={{
//               background: 'white',
//               borderRadius: '26px',
//               boxShadow: '0 16px 40px 0 rgba(125,211,252,0.18)',
//               border: '2px solid #bae6fd',
//               overflowY: 'auto',
//               minHeight: '1050px',
//               maxHeight: '1050px',
//               display: 'flex',
//               flexDirection: 'column',
//             }}
//           >
//             <div
//               style={{
//                 flex: 1,
//                 minHeight: 0,
//                 display: 'flex',
//                 flexDirection: 'column',
//               }}
//             >
//               <div
//                 style={{
//                   background: 'white',
//                   borderRadius: '26px',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   padding: '32px',
//                   flex: 1,
//                   minHeight: 0,
//                   overflowY: 'auto',
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: '24px 26px 18px 26px',
//                     background: 'linear-gradient(180deg, #0ea5e9, #38bdf8)',
//                     borderTopLeftRadius: '26px',
//                     borderTopRightRadius: '26px',
//                   }}
//                 >
//                   <h1
//                     style={{
//                       color: '#fff',
//                       fontWeight: 900,
//                       fontSize: '1.85rem',
//                       marginBottom: '4px',
//                       letterSpacing: 1,
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '10px',
//                     }}
//                   >
//                     <Sparkles size={28} /> Resume Analysis
//                   </h1>
//                   <span
//                     style={{
//                       fontWeight: 700,
//                       fontSize: '1rem',
//                       color: 'rgba(255,255,255,0.93)',
//                     }}
//                   >
//                     {reportData.fullName} <span style={{ fontWeight: 500 }}>({reportData.jobRole})</span>
//                   </span>
//                 </div>
//                 <div style={{ padding: '28px 32px 26px 32px' }}>
//                   <div
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       marginBottom: '30px',
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: '110px',
//                         height: '110px',
//                         borderRadius: '50%',
//                         background: `linear-gradient(120deg, ${
//                           getScoreColor(reportData.score)[0] === 16
//                             ? '#e0fcef'
//                             : getScoreColor(reportData.score)[0] === 6
//                             ? '#e0f2fe'
//                             : '#fde3e4'
//                         }, #f1f5f9 60%)`,
//                         border: `6px solid rgb(${getScoreColor(reportData.score).join(',')})`,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         boxShadow: '0 2px 32px rgba(125,211,252,0.3)',
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: '2.2rem',
//                           color: `rgb(${getScoreColor(reportData.score).join(',')})`,
//                           fontWeight: 900,
//                           letterSpacing: 2,
//                         }}
//                       >
//                         {reportData.score}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: '0.95rem',
//                           color: '#94a3b8',
//                           fontWeight: 600,
//                           marginLeft: '6px',
//                         }}
//                       >
//                         /100
//                       </span>
//                     </div>
//                     <span
//                       style={{
//                         marginLeft: '18px',
//                         fontWeight: 600,
//                         fontSize: '1.1rem',
//                         color: `rgb(${getScoreColor(reportData.score).join(',')})`,
//                       }}
//                     >
//                       {getScoreMessage(reportData.score)}
//                     </span>
//                   </div>

//                   {/* Category Scores */}
//                   {reportData.categoryScores && Object.keys(reportData.categoryScores).length > 0 && (
//                     <div
//                       style={{
//                         marginBottom: '24px',
//                         background: POLL_COLORS[1].bg,
//                         padding: '16px 20px',
//                         borderRadius: '14px',
//                         border: `2px solid ${POLL_COLORS[1].border}`,
//                         fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
//                         color: POLL_COLORS[1].font,
//                       }}
//                     >
//                       <h4
//                         style={{
//                           fontSize: '1.05rem',
//                           fontWeight: 800,
//                           marginBottom: '12px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                         }}
//                       >
//                         <Award size={19} /> Scoring Categories
//                       </h4>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                         {Object.entries(reportData.categoryScores).map(([category, score], idx) => {
//                           const pollPalette = ['#A7F3D0', '#BFDBFE', '#FDE68A', '#FCA5A5', '#DDD6FE', '#F9A8D4'];
//                           const barColor = pollPalette[idx % pollPalette.length];
//                           const pollPalette2 = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
//                           const barColor2 = pollPalette2[idx % pollPalette.length];
//                           return (
//                             <div key={category}>
//                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
//                                 <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#1f2937' }}>
//                                   {category.replace(/([A-Z])/g, ' $1').trim()}
//                                 </span>
//                                 <span style={{ fontWeight: 700, color: barColor2 }}>{score}%</span>
//                               </div>
//                               <div
//                                 style={{
//                                   position: 'relative',
//                                   height: '9px',
//                                   background: '#e5e7eb',
//                                   borderRadius: '8px',
//                                   overflow: 'hidden',
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     position: 'absolute',
//                                     top: 0,
//                                     left: 0,
//                                     height: '100%',
//                                     width: `${score}%`,
//                                     backgroundColor: barColor,
//                                     borderRadius: '8px',
//                                     transition: 'all 0.7s cubic-bezier(.44,1.52,.53,.96)',
//                                   }}
//                                 ></div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Strengths */}
//                   {reportData.strengths && reportData.strengths.length > 0 && (
//                     <div
//                       style={{
//                         marginBottom: '22px',
//                         background: POLL_COLORS[2].bg,
//                         padding: '14px 18px',
//                         borderRadius: '14px',
//                         border: `2px solid ${POLL_COLORS[2].border}`,
//                         fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
//                         color: POLL_COLORS[2].font,
//                       }}
//                     >
//                       <h4
//                         onClick={() => setShowStrengths(!showStrengths)}
//                         style={{
//                           cursor: 'pointer',
//                           fontWeight: 700,
//                           marginBottom: showStrengths ? '8px' : 0,
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           fontSize: '1rem',
//                           userSelect: 'none',
//                         }}
//                       >
//                         <CheckCircle size={19} />
//                         Strengths
//                         <span style={{ marginLeft: 'auto', transform: showStrengths ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
//                       </h4>
//                       {showStrengths && (
//                         <ul style={{ marginLeft: '18px', paddingLeft: '14px', listStyleType: 'disc' }}>
//                           {reportData.strengths.map((line, index) => (
//                             <li key={index} style={{ marginBottom: '6px' }}>{line.replace(/^\s*[\-\*\d\.]+\s*/, '')}</li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   )}

//                   {/* Improvements */}
//                   {reportData.improvements && reportData.improvements.length > 0 && (
//                     <div
//                       style={{
//                         marginBottom: '22px',
//                         background: POLL_COLORS[0].bg,
//                         padding: '14px 18px',
//                         borderRadius: '14px',
//                         border: `2px solid ${POLL_COLORS[0].border}`,
//                         fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
//                         color: POLL_COLORS[0].font,
//                       }}
//                     >
//                       <h4
//                         onClick={() => setShowImprovements(!showImprovements)}
//                         style={{
//                           cursor: 'pointer',
//                           fontWeight: 700,
//                           marginBottom: showImprovements ? '8px' : 0,
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           fontSize: '1rem',
//                           userSelect: 'none',
//                         }}
//                       >
//                         <AlertCircle size={19} />
//                         Improvements
//                         <span style={{ marginLeft: 'auto', transform: showImprovements ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
//                       </h4>
//                       {showImprovements && (
//                         <ul style={{ marginLeft: '18px', paddingLeft: '14px', listStyleType: 'disc' }}>
//                           {reportData.improvements.map((line, index) => (
//                             <li key={index} style={{ marginBottom: '6px' }}>{line.replace(/^\s*[\-\*\d\.]+\s*/, '')}</li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   )}

//                   {/* Missing Keywords */}
//                   {reportData.missingKeywords && reportData.missingKeywords.length > 0 && (
//                     <div
//                       style={{
//                         marginBottom: '26px',
//                         background: POLL_COLORS[3].bg,
//                         padding: '12px 14px 10px 16px',
//                         borderRadius: '14px',
//                         border: `2px solid ${POLL_COLORS[3].border}`,
//                         fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
//                         color: POLL_COLORS[3].font,
//                       }}
//                     >
//                       <h4
//                         onClick={() => setShowMissingKeywords(!showMissingKeywords)}
//                         style={{
//                           cursor: 'pointer',
//                           fontSize: '1.05rem',
//                           fontWeight: 800,
//                           marginBottom: showMissingKeywords ? '10px' : 0,
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '7px',
//                           userSelect: 'none',
//                         }}
//                       >
//                         <Tag size={19} />
//                         Missing Keywords
//                         <span style={{ marginLeft: 'auto', transform: showMissingKeywords ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
//                       </h4>
//                       {showMissingKeywords && (
//                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
//                           {reportData.missingKeywords.map((keyword, idx) => (
//                             <span
//                               key={idx}
//                               style={{
//                                 padding: '5px 14px',
//                                 background: '#fff',
//                                 border: `2px solid ${POLL_COLORS[3].border}`,
//                                 borderRadius: '16px',
//                                 fontWeight: 600,
//                                 fontSize: '0.92rem',
//                                 letterSpacing: 0.2,
//                               }}
//                             >
//                               {keyword}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT PANEL */}
//           <div
//             style={{
//               background: '#f0f9ff',
//               borderRadius: '26px',
//               boxShadow: '0 16px 40px 0 rgba(125,211,252,0.18)',
//               border: '2px solid #bae6fd',
//               display: 'flex',
//               flexDirection: 'column',
//               padding: '34px',
//               minHeight: '1050px',
//               maxHeight: '1050px',
//               overflowY: 'auto',
//             }}
//           >
//             <div
//               style={{
//                 padding: '24px 26px 18px 26px',
//                 background: 'linear-gradient(180deg, #0ea5e9, #38bdf8)',
//                 borderRadius: '18px',
//                 marginBottom: '24px',
//               }}
//             >
//               <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '8px' }}>Resume Preview</h2>
//               <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>
//                 View your uploaded document
//               </p>
//             </div>

//             {reportData.fileUrl ? (
//               <div
//                 style={{
//                   flex: 1,
//                   background: 'white',
//                   borderRadius: '14px',
//                   border: '2px solid #bae6fd',
//                   overflow: 'hidden',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   minHeight: '600px',
//                 }}
//               >
//                 <iframe
//                   src={reportData.fileUrl}
//                   title="Resume Preview"
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     minHeight: '600px',
//                     border: 'none',
//                     borderRadius: '12px',
//                   }}
//                 />
//               </div>
//             ) : (
//               <div
//                 style={{
//                   background: 'white',
//                   padding: '14px',
//                   borderRadius: '10px',
//                   textAlign: 'center',
//                   color: '#0369a1',
//                   fontSize: '0.95rem',
//                   fontWeight: 600,
//                 }}
//               >
//                 Preview not available
//               </div>
//             )}

//             {/* Experience Level */}
//             <div
//               style={{
//                 marginTop: '18px',
//                 padding: '16px 20px',
//                 background: POLL_COLORS[0].bg,
//                 borderRadius: '14px',
//                 border: `2px solid ${POLL_COLORS[0].border}`,
//               }}
//             >
//               <div style={{ fontWeight: 600, color: POLL_COLORS[0].font, marginBottom: '8px', fontSize: '0.95rem' }}>
//                 Experience Level
//               </div>
//               <div style={{ fontWeight: 800, color: POLL_COLORS[0].font, fontSize: '1.15rem' }}>{reportData.experienceLevel}</div>
//             </div>

//             {/* Analyzed On */}
//             <div
//               style={{
//                 marginTop: '12px',
//                 padding: '16px 20px',
//                 background: POLL_COLORS[2].bg,
//                 borderRadius: '14px',
//                 border: `2px solid ${POLL_COLORS[2].border}`,
//               }}
//             >
//               <div style={{ fontWeight: 600, color: POLL_COLORS[2].font, marginBottom: '8px', fontSize: '0.95rem' }}>
//                 Analyzed On
//               </div>
//               <div style={{ fontWeight: 800, color: POLL_COLORS[2].font, fontSize: '1.15rem' }}>
//                 {new Date(reportData.createdAt).toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric',
//                   year: 'numeric',
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={2500} />
//       <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default ResumeAnalysisResult;































{/* Without Fixing Left panel */}

import {
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  FileText,
  Download,
  Tag,
  FileCheck,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resumeService } from '../../services/resumeService';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';

const POLL_COLORS = [
  { bg: '#FFF4E6', border: '#FFB84D', font: '#8B5A00' },
  { bg: '#E3F2FD', border: '#64B5F6', font: '#1565C0' },
  { bg: '#E8F5E9', border: '#81C784', font: '#2E7D32' },
  { bg: '#F3E5F5', border: '#BA68C8', font: '#6A1B9A' },
  { bg: '#FCE4EC', border: '#F48FB1', font: '#AD1457' },
];

const mainGradient = 'linear-gradient(180deg, #ffffff 0%, #f5f8ff 25%, #e8f0fe 100%)';

const ResumeAnalysisResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportData, setReportData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBackHovered, setIsBackHovered] = useState(false);

  // Dropdown toggle states
  const [showStrengths, setShowStrengths] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [showMissingKeywords, setShowMissingKeywords] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const loadResumeData = async () => {
      if (location.state?.reportData) {
        const data = location.state.reportData;
        const mappedData = {
          _id: data._id || Date.now().toString(),
          fullName: data.fullName || 'Unknown',
          jobRole: data.jobRole || 'Not specified',
          experienceLevel: data.experienceLevel || 'Not specified',
          score: data.score || data.overallScore || 0,
          improvements: data.improvements || data.suggestions || [],
          strengths: data.strengths || [],
          categoryScores: data.categoryScores || {},
          missingKeywords: data.missingKeywords || [],
          summary: data.summary || '',
          fileName: data.fileName || 'Resume.pdf',
          fileType: 'application/pdf',
          fileUrl: data.fileUrl,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setReportData(mappedData);
        setLoading(false);
      } else {
        const pathParts = window.location.pathname.split('/');
        const resumeId = pathParts[pathParts.length - 1];
        
        // Handle refresh on /result/new
        if (resumeId === 'new') {
          toast.error('Session expired. Please analyze the resume again.');
          setTimeout(() => {
            navigate('/resume-analyzer/analyzer');
          }, 1500);
          return;
        }
        
        if (resumeId && resumeId !== 'result') {
          try {
            const response = await resumeService.getResumeById(resumeId);
            let data = response;
            if (response.data) data = response.data;
            if (response.data && response.data.data) data = response.data.data;
            
            const score =
              data.score ||
              data.overallScore ||
              (data.analysisResult && data.analysisResult.score) ||
              (data.analysisResult && data.analysisResult.overallScore) ||
              0;
              
            const mappedData = {
              _id: data._id || resumeId,
              fullName: data.fullName || data.candidateName || 'Unknown',
              jobRole: data.jobRole || 'Not specified',
              experienceLevel: data.experienceLevel || data.experience || 'Not specified',
              score: score,
              improvements:
                data.improvements ||
                data.suggestions ||
                (data.analysisResult && data.analysisResult.suggestions) ||
                (data.analysisResult && data.analysisResult.improvements) ||
                [],
              strengths:
                data.strengths || (data.analysisResult && data.analysisResult.strengths) || [],
              categoryScores:
                data.categoryScores ||
                (data.analysisResult && data.analysisResult.categoryScores) ||
                {},
              missingKeywords:
                data.missingKeywords ||
                (data.analysisResult && data.analysisResult.missingKeywords) ||
                [],
              summary:
                data.summary ||
                (data.analysisResult && data.analysisResult.summary) ||
                '',
              fileName: data.resumeFilename || data.fileName || 'Resume.pdf',
              fileType: 'application/pdf',
              fileUrl: data.resumeUrl || data.fileUrl || null,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setReportData(mappedData);
            setLoading(false);
          } catch (error) {
            setError('Failed to load resume data');
            setLoading(false);
            setTimeout(() => {
              toast.error('Failed to load resume data. Redirecting to analyzer...');
              navigate('/resume-analyzer/analyzer');
            }, 1000);
          }
        } else {
          toast.error('No report data found. Please analyze a resume first.');
          navigate('/resume-analyzer/analyzer');
        }
      }
    };
    loadResumeData();
  }, [location, navigate]);

  const getScoreColor = (score) => {
    if (score >= 80) return [16, 185, 129];
    if (score >= 65) return [6, 182, 212];
    return [239, 68, 68];
  };

  const hexToRgb = (hex) => [
    parseInt(hex.substr(1, 2), 16),
    parseInt(hex.substr(3, 2), 16),
    parseInt(hex.substr(5, 2), 16),
  ];

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Header
      pdf.setFillColor(6, 182, 212);
      pdf.rect(0, 0, pageWidth, 22, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resume Analysis Report', margin, 13);
      pdf.setFontSize(10);
      pdf.text('AI-Powered Resume Evaluation', margin, 18);
      y = 28;

      // Candidate Info Box
      pdf.setFillColor(207, 250, 254);
      pdf.roundedRect(margin, y, contentWidth, 26, 6, 6, 'F');
      pdf.setDrawColor(165, 243, 252);
      pdf.setLineWidth(0.8);
      pdf.roundedRect(margin, y, contentWidth, 26, 6, 6);
      pdf.setTextColor(8, 145, 178);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`Candidate: ${reportData.fullName}`, margin + 4, y + 7);
      pdf.text(`Role: ${reportData.jobRole || 'N/A'}`, margin + 4, y + 14);
      pdf.text(`Experience: ${reportData.experienceLevel || 'N/A'}`, margin + 4, y + 21);
      y += 32;

      // Score Circle
      pdf.setFontSize(30);
      pdf.setFont('helvetica', 'bold');
      const scoreColor = getScoreColor(reportData.score);
      pdf.setDrawColor(...scoreColor);
      pdf.setFillColor(...scoreColor);
      pdf.circle(pageWidth / 2, y + 23, 20, 'FD');
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${reportData.score}`, pageWidth / 2, y + 27, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('/100', pageWidth / 2, y + 34, { align: 'center' });
      y += 50;

      // Category Scores
      if (reportData.categoryScores && Object.keys(reportData.categoryScores).length > 0) {
        const color = POLL_COLORS[1];
        pdf.setFillColor(...hexToRgb(color.bg));
        pdf.setDrawColor(...hexToRgb(color.border));
        pdf.setFont('georgia', 'bold');
        pdf.setFontSize(13);
        pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
        pdf.setTextColor(...hexToRgb(color.font));
        pdf.text('Category Scores', margin + 3, y + 6);
        y += 11;
        pdf.setFont('georgia', 'normal');
        pdf.setFontSize(10);
        Object.entries(reportData.categoryScores).forEach(([k, v]) => {
          pdf.text(`${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}%`, margin + 7, y);
          y += 6;
        });
        y += 3;
      }

      // Helper function to add wrapped text
      const addWrappedSection = (title, items, color, isSingleText = false) => {
        if (!items || (Array.isArray(items) && items.length === 0) || (!Array.isArray(items) && !items)) return;

        if (y > pageHeight - 30) {
          pdf.addPage();
          y = margin;
        }

        pdf.setFillColor(...hexToRgb(color.bg));
        pdf.setDrawColor(...hexToRgb(color.border));
        pdf.setFont('georgia', 'bold');
        pdf.setFontSize(13);
        pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
        pdf.setTextColor(...hexToRgb(color.font));
        pdf.text(title, margin + 3, y + 6);
        y += 11;
        
        pdf.setFont('georgia', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...hexToRgb(color.font));

        if (isSingleText) {
          // For summary - single text block
          const wrappedLines = pdf.splitTextToSize(items, contentWidth - 14);
          wrappedLines.forEach((line) => {
            if (y > pageHeight - 15) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(line, margin + 7, y);
            y += 6;
          });
        } else {
          // For array items (strengths, improvements)
          items.forEach((item) => {
            const cleanText = item
              .replace(/^\s*[\-\*\d\.]+\s*/, '• ')
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\*(.*?)\*/g, '$1');

            const wrappedLines = pdf.splitTextToSize(cleanText, contentWidth - 14);
            wrappedLines.forEach((line) => {
              if (y > pageHeight - 15) {
                pdf.addPage();
                y = margin;
              }
              pdf.text(line, margin + 7, y);
              y += 6;
            });
          });
        }
        
        y += 3;
      };

      addWrappedSection('Strengths', reportData.strengths, POLL_COLORS[2]);
      addWrappedSection('Improvements', reportData.improvements, POLL_COLORS[0]);

      // Missing Keywords
      if (reportData.missingKeywords?.length) {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = margin;
        }

        const color = POLL_COLORS[3];
        pdf.setFillColor(...hexToRgb(color.bg));
        pdf.setDrawColor(...hexToRgb(color.border));
        pdf.setFont('georgia', 'bold');
        pdf.setFontSize(13);
        pdf.roundedRect(margin, y, contentWidth, 8, 3, 3, 'F');
        pdf.setTextColor(...hexToRgb(color.font));
        pdf.text('Missing Keywords', margin + 3, y + 6);
        y += 11;
        pdf.setFont('georgia', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...hexToRgb(color.font));
        
        for (const word of reportData.missingKeywords) {
          if (y > pageHeight - 15) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(`• ${word}`, margin + 7, y);
          y += 6;
        }
        y += 3;
      }

      // Summary
      if (reportData.summary) {
        addWrappedSection('Summary', reportData.summary, POLL_COLORS[4], true);
      }

      // Footer
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 116, 139);
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text('Generated by EduOne Resume Analyzer', pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      pdf.save(`Resume_Analysis_${reportData.fullName?.replace(/\s+/g, '_') || 'Unknown'}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getScoreMessage = (score) => {
    if (score < 50) return 'Needs Improvement';
    if (score < 85) return 'Good';
    return 'Excellent';
  };

  if (loading || !reportData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: mainGradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: mainGradient,
        padding: '20px 10px',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/resume-analyzer')}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: isBackHovered ? '#0369a1' : '#0891b2',
              cursor: 'pointer',
              marginBottom: '6px',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={30} color={isBackHovered ? '#0369a1' : '#0891b2'} />
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/resume-analyzer/history')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'white',
                color: '#0891b2',
                border: '2px solid #7dd3fc',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(125,211,252,0.15)',
              }}
            >
              <FileText size={16} /> Reports
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isDownloading ? '#94a3b8' : '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(14,165,233,0.4)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => !isDownloading && (e.currentTarget.style.backgroundColor = '#0284c7')}
              onMouseLeave={e => !isDownloading && (e.currentTarget.style.backgroundColor = '#0ea5e9')}
            >
              {isDownloading ? (
                <>
                  <Sparkles size={16} style={{ animation: 'spin 1.2s linear infinite' }} /> Generating...
                </>
              ) : (
                <>
                  <Download size={16} /> Download
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'stretch',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          {/* LEFT PANEL */}
          <div
            style={{
              background: 'white',
              borderRadius: '26px',
              boxShadow: '0 16px 40px 0 rgba(125,211,252,0.18)',
              border: '2px solid #bae6fd',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '32px',
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    padding: '24px 26px 18px 26px',
                    background: 'linear-gradient(180deg, #0ea5e9, #38bdf8)',
                    borderTopLeftRadius: '26px',
                    borderTopRightRadius: '26px',
                  }}
                >
                  <h1
                    style={{
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '1.85rem',
                      marginBottom: '4px',
                      letterSpacing: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Sparkles size={28} /> Resume Analysis
                  </h1>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.93)',
                    }}
                  >
                    {reportData.fullName} <span style={{ fontWeight: 500 }}>({reportData.jobRole})</span>
                  </span>
                </div>
                <div style={{ padding: '28px 32px 26px 32px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '30px',
                    }}
                  >
                    <div
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        background: `linear-gradient(120deg, ${
                          getScoreColor(reportData.score)[0] === 16
                            ? '#e0fcef'
                            : getScoreColor(reportData.score)[0] === 6
                            ? '#e0f2fe'
                            : '#fde3e4'
                        }, #f1f5f9 60%)`,
                        border: `6px solid rgb(${getScoreColor(reportData.score).join(',')})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 32px rgba(125,211,252,0.3)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '2.2rem',
                          color: `rgb(${getScoreColor(reportData.score).join(',')})`,
                          fontWeight: 900,
                          letterSpacing: 2,
                        }}
                      >
                        {reportData.score}
                      </span>
                      <span
                        style={{
                          fontSize: '0.95rem',
                          color: '#94a3b8',
                          fontWeight: 600,
                          marginLeft: '6px',
                        }}
                      >
                        /100
                      </span>
                    </div>
                    <span
                      style={{
                        marginLeft: '18px',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: `rgb(${getScoreColor(reportData.score).join(',')})`,
                      }}
                    >
                      {getScoreMessage(reportData.score)}
                    </span>
                  </div>

                  {/* Category Scores */}
                  {reportData.categoryScores && Object.keys(reportData.categoryScores).length > 0 && (
                    <div
                      style={{
                        marginBottom: '24px',
                        background: POLL_COLORS[1].bg,
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: `2px solid ${POLL_COLORS[1].border}`,
                        fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
                        color: POLL_COLORS[1].font,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Award size={19} /> Scoring Categories
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(reportData.categoryScores).map(([category, score], idx) => {
                          const pollPalette = ['#A7F3D0', '#BFDBFE', '#FDE68A', '#FCA5A5', '#DDD6FE', '#F9A8D4'];
                          const barColor = pollPalette[idx % pollPalette.length];
                          const pollPalette2 = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
                          const barColor2 = pollPalette2[idx % pollPalette.length];
                          return (
                            <div key={category}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#1f2937' }}>
                                  {category.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span style={{ fontWeight: 700, color: barColor2 }}>{score}%</span>
                              </div>
                              <div
                                style={{
                                  position: 'relative',
                                  height: '9px',
                                  background: '#e5e7eb',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: `${score}%`,
                                    backgroundColor: barColor,
                                    borderRadius: '8px',
                                    transition: 'all 0.7s cubic-bezier(.44,1.52,.53,.96)',
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {reportData.strengths && reportData.strengths.length > 0 && (
                    <div
                      style={{
                        marginBottom: '22px',
                        background: POLL_COLORS[2].bg,
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `2px solid ${POLL_COLORS[2].border}`,
                        fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
                        color: POLL_COLORS[2].font,
                      }}
                    >
                      <h4
                        onClick={() => setShowStrengths(!showStrengths)}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          marginBottom: showStrengths ? '8px' : 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '1rem',
                          userSelect: 'none',
                        }}
                      >
                        <CheckCircle size={19} />
                        Strengths
                        <span style={{ marginLeft: 'auto', transform: showStrengths ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                      </h4>
                      {showStrengths && (
                        <MarkdownRenderer content={reportData.strengths.join('\n\n')} />
                      )}
                    </div>
                  )}

                  {/* Improvements */}
                  {reportData.improvements && reportData.improvements.length > 0 && (
                    <div
                      style={{
                        marginBottom: '22px',
                        background: POLL_COLORS[0].bg,
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `2px solid ${POLL_COLORS[0].border}`,
                        fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
                        color: POLL_COLORS[0].font,
                      }}
                    >
                      <h4
                        onClick={() => setShowImprovements(!showImprovements)}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          marginBottom: showImprovements ? '8px' : 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '1rem',
                          userSelect: 'none',
                        }}
                      >
                        <AlertCircle size={19} />
                        Improvements
                        <span style={{ marginLeft: 'auto', transform: showImprovements ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                      </h4>
                      {showImprovements && (
                        <MarkdownRenderer content={reportData.improvements.join('\n\n')} />
                      )}
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {reportData.missingKeywords && reportData.missingKeywords.length > 0 && (
                    <div
                      style={{
                        marginBottom: '22px',
                        background: POLL_COLORS[3].bg,
                        padding: '12px 14px 10px 16px',
                        borderRadius: '14px',
                        border: `2px solid ${POLL_COLORS[3].border}`,
                        fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
                        color: POLL_COLORS[3].font,
                      }}
                    >
                      <h4
                        onClick={() => setShowMissingKeywords(!showMissingKeywords)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          marginBottom: showMissingKeywords ? '10px' : 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          userSelect: 'none',
                        }}
                      >
                        <Tag size={19} />
                        Missing Keywords
                        <span style={{ marginLeft: 'auto', transform: showMissingKeywords ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                      </h4>
                      {showMissingKeywords && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                          {reportData.missingKeywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '5px 14px',
                                background: '#fff',
                                border: `2px solid ${POLL_COLORS[3].border}`,
                                borderRadius: '16px',
                                fontWeight: 600,
                                fontSize: '0.92rem',
                                letterSpacing: 0.2,
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  {reportData.summary && (
                    <div
                      style={{
                        marginBottom: '26px',
                        background: POLL_COLORS[4].bg,
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `2px solid ${POLL_COLORS[4].border}`,
                        fontFamily: '"Georgia", "Roboto Slab", "Lato", serif',
                        color: POLL_COLORS[4].font,
                      }}
                    >
                      <h4
                        onClick={() => setShowSummary(!showSummary)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          marginBottom: showSummary ? '10px' : 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          userSelect: 'none',
                        }}
                      >
                        <FileCheck size={19} />
                        Summary
                        <span style={{ marginLeft: 'auto', transform: showSummary ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                      </h4>
                      {showSummary && (
                        <MarkdownRenderer content={reportData.summary} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              background: '#f0f9ff',
              borderRadius: '26px',
              boxShadow: '0 16px 40px 0 rgba(125,211,252,0.18)',
              border: '2px solid #bae6fd',
              display: 'flex',
              flexDirection: 'column',
              padding: '34px',
              minHeight: '1050px',
              maxHeight: '1050px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                padding: '24px 26px 18px 26px',
                background: 'linear-gradient(180deg, #0ea5e9, #38bdf8)',
                borderRadius: '18px',
                marginBottom: '24px',
              }}
            >
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '8px' }}>Resume Preview</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
                {reportData.fileName}
              </p>
            </div>

            {reportData.fileUrl ? (
              <div
                style={{
                  flex: 1,
                  background: 'white',
                  borderRadius: '14px',
                  border: '2px solid #bae6fd',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '600px',
                }}
              >
                <iframe
                  src={reportData.fileUrl}
                  title="Resume Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '600px',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  background: 'white',
                  padding: '14px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#0369a1',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                }}
              >
                Preview not available
              </div>
            )}

            {/* Experience Level */}
            <div
              style={{
                marginTop: '18px',
                padding: '16px 20px',
                background: POLL_COLORS[0].bg,
                borderRadius: '14px',
                border: `2px solid ${POLL_COLORS[0].border}`,
              }}
            >
              <div style={{ fontWeight: 600, color: POLL_COLORS[0].font, marginBottom: '8px', fontSize: '0.95rem' }}>
                Experience Level
              </div>
              <div style={{ fontWeight: 800, color: POLL_COLORS[0].font, fontSize: '1.15rem' }}>{reportData.experienceLevel}</div>
            </div>

            {/* Analyzed On */}
            <div
              style={{
                marginTop: '12px',
                padding: '16px 20px',
                background: POLL_COLORS[2].bg,
                borderRadius: '14px',
                border: `2px solid ${POLL_COLORS[2].border}`,
              }}
            >
              <div style={{ fontWeight: 600, color: POLL_COLORS[2].font, marginBottom: '8px', fontSize: '0.95rem' }}>
                Analyzed On
              </div>
              <div style={{ fontWeight: 800, color: POLL_COLORS[2].font, fontSize: '1.15rem' }}>
                {new Date(reportData.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResumeAnalysisResult;
