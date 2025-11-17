import { Award, CheckCircle, AlertCircle, ArrowLeft, Sparkles, FileText, Download } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeAnalysisResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reportData, setReportData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    // Check if data was passed from navigation
    if (location.state?.reportData) {
      setReportData(location.state.reportData);
      setLoading(false);
    } else {
      // Fallback: No data passed, show error or redirect
      console.error('No report data found');
      alert('No report data found. Please analyze a resume first.');
      navigate('/resume-analyzer/analyzer');
    }
  }, [location, navigate]);

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Resume_Analysis_${reportData.candidateName}_${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading || !reportData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={64} style={{ color: '#0ea5e9', marginBottom: '20px', animation: 'spin 2s linear infinite' }} />
          <h2 style={{ color: '#0284c7', fontSize: '1.5rem', fontWeight: 800 }}>Loading Report...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
        padding: '40px 20px',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => navigate('/resume-analyzer')} style={{
              display: 'flex', alignItems: 'center', gap: '10px', background: 'white',
              border: 'none', borderRadius: '12px', padding: '12px 24px',
              fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
            }}>
            <ArrowLeft size={20} />
          </button>

          <button onClick={() => navigate('/resume-analyzer/history')} style={{
              display: 'flex', alignItems: 'center', gap: '10px', background: 'white',
              border: 'none', borderRadius: '12px', padding: '12px 24px',
              fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer',
              transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
            }}>
            <FileText size={20} /> Past Reports
          </button>
        </div>

        {/* Main Content - Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: '32px' }}>
          
          {/* LEFT SIDE - Analysis Panel */}
          <div ref={reportRef}>
            <div style={{
                background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
                borderRadius: '24px', boxShadow: '0 8px 32px rgba(14, 165, 233, 0.12)',
                border: '2px solid #e0f2fe', overflow: 'hidden', position: 'sticky', top: '20px',
              }}
            >
              {/* Header */}
              <div style={{
                  background: 'linear-gradient(to right, #0ea5e9, #06b6d4)',
                  padding: '32px 28px', position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h1 style={{ fontWeight: 900, color: 'white', fontSize: '1.8rem', margin: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={28} strokeWidth={2.5} /> Resume Score
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0 }}>
                    Scored {reportData.score}/100
                  </p>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '28px' }}>
                {/* Score Display */}
                <div style={{
                    background: `linear-gradient(135deg, ${getScoreColor(reportData.score)}20, ${getScoreColor(reportData.score)}10)`,
                    border: `3px solid ${getScoreColor(reportData.score)}`,
                    borderRadius: '20px', padding: '32px 24px', marginBottom: '24px',
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2rem', opacity: 0.15 }}>✨</div>
                  
                  <div style={{
                    width: '140px', height: '140px', margin: '0 auto 20px', borderRadius: '50%',
                    border: `10px solid ${getScoreColor(reportData.score)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', fontWeight: 900, color: getScoreColor(reportData.score), lineHeight: 1 }}>
                        {reportData.score}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: getScoreColor(reportData.score), fontWeight: 600 }}>
                        /100
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.1rem', color: getScoreColor(reportData.score), fontWeight: 700 }}>
                    {reportData.score >= 90 ? '🏆 Excellent!' : reportData.score >= 75 ? '👍 Good Job!' : '💪 Keep Going!'}
                  </div>
                </div>

                {/* Strengths */}
                {reportData.fullReport && (
                  <div style={{
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    padding: '20px', borderRadius: '16px', border: '2px solid #10b981', marginBottom: '16px',
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem', fontWeight: 800, color: '#166534', marginBottom: '12px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <CheckCircle size={20} strokeWidth={2.5} /> Strengths
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 500 }}>
                      {reportData.fullReport.strengths.map((strength, idx) => (
                        <li key={idx}>✅ {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  padding: '20px', borderRadius: '16px', border: '2px solid #f59e0b', marginBottom: '24px',
                }}>
                  <h4 style={{
                    fontSize: '1.1rem', fontWeight: 800, color: '#92400e', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <AlertCircle size={20} strokeWidth={2.5} /> Improvements
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#b45309', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 500 }}>
                    {reportData.improvements.slice(0, 3).map((improvement, idx) => (
                      <li key={idx}>⚠️ {improvement}</li>
                    ))}
                  </ul>
                </div>

                {/* Download Button */}
                <button onClick={handleDownloadPDF} disabled={isDownloading} style={{
                    width: '100%', padding: '14px 0',
                    background: isDownloading ? '#94a3b8' : 'linear-gradient(to right, #0ea5e9, #06b6d4)',
                    color: 'white', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700,
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    boxShadow: isDownloading ? 'none' : '0 4px 16px rgba(14, 165, 233, 0.3)',
                    transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                  {isDownloading ? (
                    <>
                      <Sparkles size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={18} /> Download Report 📥
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PDF Viewer */}
          <div>
            <div style={{
                background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
                borderRadius: '24px', padding: '40px',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.12)',
                border: '2px solid #e0f2fe', minHeight: '100vh',
              }}
            >
              <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  borderRadius: '20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)',
                }}>
                  <FileText size={40} style={{ color: '#0ea5e9' }} strokeWidth={2.5} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7', margin: 0, marginBottom: '12px' }}>
                  Uploaded Resume
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
                  📄 {reportData.fileName}
                </p>
              </div>

              <div style={{
                  background: '#f8fafc', border: '3px solid #bfdbfe', borderRadius: '24px',
                  padding: '24px', minHeight: '800px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                {reportData.fileType === 'application/pdf' && reportData.fileDataUrl ? (
                  <iframe
                    src={reportData.fileDataUrl}
                    style={{
                      width: '100%', height: '900px', border: 'none',
                      borderRadius: '16px', background: 'white',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                    title="Resume Preview"
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '120px', height: '120px', margin: '0 auto 24px',
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={60} style={{ color: '#0ea5e9' }} strokeWidth={2} />
                    </div>
                    <h3 style={{ color: '#0284c7', fontSize: '1.5rem', marginBottom: '12px' }}>
                      {reportData.fileName}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                      Preview available for PDF files only
                    </p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '32px', padding: '24px', background: '#f8fafc', borderRadius: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, marginBottom: '6px', fontWeight: 600 }}>Experience Level</p>
                  <p style={{ fontSize: '1.1rem', color: '#0284c7', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{reportData.experience}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, marginBottom: '6px', fontWeight: 600 }}>Analyzed On</p>
                  <p style={{ fontSize: '1.1rem', color: '#0284c7', fontWeight: 700, margin: 0 }}>
                    {new Date(reportData.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalysisResult;
