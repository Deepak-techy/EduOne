import { FileText, Loader2, Award, CheckCircle, AlertCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [formData, setFormData] = useState({
    candidateName: '',
    jobRole: '',
    experience: '',
    jobDescription: '',
    resume: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (reportId) {
      const history = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      const report = history.find(item => item.id === parseInt(reportId));
      if (report) {
        setFormData({
          candidateName: report.candidateName,
          jobRole: report.jobRole,
          experience: report.experience,
          jobDescription: report.jobDescription,
          resume: { name: report.fileName },
        });
        setAnalysisResult({
          score: report.score,
          improvements: report.improvements,
          fullReport: report.fullReport,
        });
        setIsViewMode(true);
      }
    }
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleAnalyze = async () => {
    if (!formData.candidateName || !formData.jobRole || !formData.experience || !formData.resume) {
      alert('Please fill all fields and upload a resume');
      return;
    }

    setIsAnalyzing(true);

    try {
      const aiResponse = await analyzeResumeWithAI(formData);
      setAnalysisResult(aiResponse);

      const historyEntry = {
        id: Date.now(),
        candidateName: formData.candidateName,
        jobRole: formData.jobRole,
        experience: formData.experience,
        jobDescription: formData.jobDescription,
        fileName: formData.resume.name,
        date: new Date().toISOString(),
        score: aiResponse.score,
        improvements: aiResponse.improvements,
        fullReport: aiResponse.fullReport,
      };

      const existingHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      existingHistory.unshift(historyEntry);
      localStorage.setItem('resumeHistory', JSON.stringify(existingHistory));

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResumeWithAI = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      score: Math.floor(Math.random() * 30) + 70,
      improvements: [
        'Add more quantifiable achievements and metrics',
        'Include relevant technical skills for ' + data.jobRole,
        'Improve formatting and structure',
        'Add certifications relevant to the role',
        'Expand project descriptions with outcomes',
      ],
      fullReport: {
        strengths: ['Clear job history', 'Good education background', 'Strong technical skills'],
        weaknesses: ['Limited project descriptions', 'Missing key skills', 'Could improve formatting'],
        suggestions: ['Add portfolio links', 'Include references', 'Highlight leadership experience'],
      }
    };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const CARD_HEIGHT = 720;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e0f7fa 0%, #f5f5f5 100%)',
        padding: '40px',
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1250px',
        }}
      >
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/resume-analyzer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1.5px solid #d3f4ff',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#145875',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2faff';
            e.currentTarget.style.borderColor = '#1dc9c2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#d3f4ff';
          }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            gap: '34px',
          }}
        >
          {/* Left Panel */}
          <div
            style={{
              minWidth: '610px',
              maxWidth: '620px',
              height: CARD_HEIGHT,
              background: '#fff',
              borderRadius: '1.25rem',
              padding: 0,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              overflow: 'hidden',
              opacity: isViewMode ? 0.7 : 1,
              pointerEvents: isViewMode ? 'none' : 'auto',
            }}
          >
            {/* Top Gradient Bar */}
            <div
              style={{
                background: 'linear-gradient(90deg, #11dec1 0%, #1da6dd 100%)',
                padding: '20px 26px 12px 26px',
                minHeight: '68px',
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '1.20rem',
                  margin: 0,
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <FileText size={21} />
                Your Resume
              </h3>
            </div>
            <div style={{ padding: '20px 18px 18px 18px', flex: 1, overflowY: 'auto' }}>
              {/* Upload Resume */}
            <div
              style={{
                border: formData.resume ? '1.5px solid #10b981' : '1.5px dashed #1dc9c2',
                borderRadius: '14px',
                padding: '28px 16px 24px 16px',
                textAlign: 'center',
                background: formData.resume ? '#f0fdf4' : '#fafdff',
                cursor: isViewMode ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                transition: 'all 0.3s',
              }}
              onClick={() => !isViewMode && document.getElementById('analyzerResumeInput').click()}
              onMouseEnter={(e) => {
                if (!isViewMode && !formData.resume) {
                  e.currentTarget.style.background = '#e2faff';
                }
              }}
              onMouseLeave={(e) => {
                if (!formData.resume) {
                  e.currentTarget.style.background = '#fafdff';
                }
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: '0 auto 10px auto',
                  background: formData.resume ? '#d1fae5' : '#c6f9f5',
                  borderRadius: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {formData.resume ? (
                  <CheckCircle size={28} style={{ color: '#10b981' }} />
                ) : (
                  <span
                    role="img"
                    aria-label="upload"
                    style={{ fontSize: '2.1rem', color: '#12bec4' }}
                  >
                    ⬆
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: '1.10rem',
                  color: formData.resume ? '#166534' : '#183b56',
                  fontWeight: 700,
                  marginBottom: 5,
                }}
              >
                {formData.resume ? 'Resume Uploaded Successfully!' : (isViewMode ? 'Resume Uploaded' : 'Click to upload')}
              </div>
              <div style={{ 
                fontSize: '0.95rem', 
                color: formData.resume ? '#15803d' : '#5bb6b9', 
                marginBottom: 2,
                fontWeight: formData.resume ? 600 : 400,
              }}>
                {formData.resume ? `📄 ${formData.resume.name}` : 'Upload your Resume here'}
              </div>
              {!isViewMode && (
                <input
                  id="analyzerResumeInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              )}
              {formData.resume && !isViewMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData(prev => ({ ...prev, resume: null }));
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '6px 16px',
                    background: '#fff',
                    border: '1.5px solid #10b981',
                    borderRadius: '6px',
                    color: '#059669',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dcfce7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  Change File
                </button>
              )}
            </div>
              {/* Candidate Name */}
              <label style={{ display: 'block', marginBottom: '7px', color: '#145875', fontWeight: 600, fontSize: '0.98rem' }}>
                Candidate Name
              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="Candidate name"
                disabled={isViewMode}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  marginBottom: '15px',
                  border: '1.4px solid #ddf4fe',
                  borderRadius: '8px',
                  fontSize: '0.99rem',
                  background: isViewMode ? '#f1f5f9' : '#f7fdff',
                  fontWeight: 500,
                  outline: 'none',
                }}
              />

              {/* Job Role and Experience row */}
              <div style={{ display: 'flex', gap: '13px', marginBottom: '15px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#145875', fontWeight: 600, fontSize: '0.98rem' }}>
                    Job Role
                  </label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    placeholder="eg: sales manager"
                    disabled={isViewMode}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.4px solid #ddf4fe',
                      borderRadius: '8px',
                      fontSize: '0.99rem',
                      background: isViewMode ? '#f1f5f9' : '#f7fdff',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#145875', fontWeight: 600, fontSize: '0.98rem' }}>
                    Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={isViewMode}
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      border: '1.4px solid #ddf4fe',
                      borderRadius: '8px',
                      fontSize: '0.99rem',
                      background: isViewMode ? '#f1f5f9' : '#f7fdff',
                      fontWeight: 500,
                      outline: 'none',
                      color: formData.experience ? '#145875' : '#90a5b0',
                      cursor: isViewMode ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="">Select</option>
                    <option value="freshers">Freshers</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professionals">Professionals</option>
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <label style={{ display: 'block', marginBottom: '7px', color: '#145875', fontWeight: 600, fontSize: '0.98rem' }}>
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Describe your job here..."
                disabled={isViewMode}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  border: '1.4px solid #ddf4fe',
                  borderRadius: '8px',
                  fontSize: '0.99rem',
                  minHeight: '62px',
                  background: isViewMode ? '#f1f5f9' : '#f7fdff',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
              
              {!isViewMode && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    background: isAnalyzing ? '#94a3b8' : 'linear-gradient(90deg, #1fa2ff 0%, #12c2e9 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9px',
                    fontSize: '1.12rem',
                    fontWeight: 700,
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    marginTop: '4px',
                    marginBottom: '2px',
                    boxShadow: '0 2px 12px 0 #56dcff22',
                    transition: 'background 0.14s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div
            style={{
              height: CARD_HEIGHT,
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(4px)',
              borderRadius: '1.25rem',
              boxShadow: '0 4px 24px 0 #b8eafd44',
              border: '1.5px solid #d3f4ff',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            {/* Gradient Top Bar */}
            <div
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #224866 0%, #275a93 100%)',
                padding: '23px 30px 14px 30px',
                minHeight: '72px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: '1.23rem',
                  margin: 0
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    background: analysisResult ? '#10b981' : '#2dd4bf',
                    borderRadius: '50%',
                    marginRight: 10,
                    boxShadow: '0 0 0 2px #134e4a44, 0 1px 10px #0891b244',
                    display: 'inline-block',
                  }}
                />
                {analysisResult ? 'Analysis Results' : 'AI Assistant'}
              </h3>
              <span style={{
                color: '#e0f8fa',
                fontSize: '0.93rem',
                marginTop: 5,
                fontWeight: 500,
                opacity: 0.91
              }}>
                {analysisResult ? `Score: ${analysisResult.score}/100` : 'Upload Resume to begin'}
              </span>
            </div>

            {/* Content Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              background: 'linear-gradient(135deg, #fafdff 70%, #e2f7ff 100%)',
            }}>
              {!analysisResult ? (
                // Empty State
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 95,
                      height: 95,
                      margin: '0 auto 19px',
                      background: 'linear-gradient(135deg, #e0fbfa 55%, #c2f3fa 100%)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '1.2rem',
                      boxShadow: '0 1px 18px #b3ecfa44'
                    }}>
                      <FileText style={{ fontSize: 47, color: '#2dd4bf', opacity: 0.86 }} />
                    </div>
                    <div style={{
                      color: '#497385',
                      fontSize: '1.22rem',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}>
                      Upload your Resume to start
                    </div>
                    <div style={{
                      color: '#88b3cd',
                      fontSize: '1.07rem'
                    }}>
                      Once uploaded, AI Assistant will analyze your Resume.
                    </div>
                  </div>
                </div>
              ) : (
                // Results Display
                <div>
                  {/* Score Card */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${getScoreColor(analysisResult.score)}15, ${getScoreColor(analysisResult.score)}05)`,
                      border: `2px solid ${getScoreColor(analysisResult.score)}`,
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <Award size={48} style={{ color: getScoreColor(analysisResult.score), marginBottom: '12px' }} />
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: getScoreColor(analysisResult.score), marginBottom: '8px' }}>
                      {analysisResult.score}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: getScoreColor(analysisResult.score), fontWeight: 600 }}>
                      Resume Score
                    </div>
                  </div>

                  {/* Improvements Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#145875',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <TrendingUp size={22} style={{ color: '#f59e0b' }} />
                      AI Improvements
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {analysisResult.improvements.map((improvement, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'white',
                            padding: '14px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid #e0f2fe',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                          }}
                        >
                          <AlertCircle size={18} style={{ color: '#0ea5e9', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                            {improvement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  {analysisResult.fullReport && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                      {/* Strengths */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #86efac',
                      }}>
                        <h5 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#166534',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <CheckCircle size={18} />
                          Strengths
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '0.92rem', lineHeight: 1.7 }}>
                          {analysisResult.fullReport.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #fca5a5',
                      }}>
                        <h5 style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#991b1b',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <AlertCircle size={18} />
                          Areas to Improve
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c', fontSize: '0.92rem', lineHeight: 1.7 }}>
                          {analysisResult.fullReport.weaknesses.map((weakness, idx) => (
                            <li key={idx}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;























// past reports - alike 