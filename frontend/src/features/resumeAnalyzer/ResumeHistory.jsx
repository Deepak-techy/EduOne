
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Trash2, Eye, Calendar } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import { resumeService } from '../../services/resumeService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResumeHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [isBackHovered, setIsBackHovered] = useState(false);
  
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await resumeService.getAllResumes();
      let resumeList = [];
      if (Array.isArray(response)) resumeList = response;
      else if (Array.isArray(response.data)) resumeList = response.data;
      else if (response.data && Array.isArray(response.data.resumes)) resumeList = response.data.resumes;
      else if (response.data && Array.isArray(response.data.data)) resumeList = response.data.data;
      else if (response.resumes && Array.isArray(response.resumes)) resumeList = response.resumes;
      setResumes(resumeList);
    } catch (error) {
      setError(error.message || 'Failed to load resume history');
      toast.error(error.message || 'Failed to load resume history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReport = (resumeId) => {
    setIsLoadingReport(true);
    setTimeout(() => {
      navigate(`/resume-analyzer/result/${resumeId}`);
    }, 500);
  };

  const handleDelete = (resumeId) => {
    setConfirmId(resumeId);
  };

  const confirmDelete = async () => {
  if (!confirmId) return;
  
  setDeletingId(confirmId);
  // DON'T clear confirmId here - keep modal open during deletion!
  
  try {
    await resumeService.deleteResume(confirmId);
    setResumes(resumes.filter(resume => resume._id !== confirmId));
    toast.success('Resume deleted successfully!');
  } catch (error) {
    toast.error(error.message || 'Failed to delete resume');
  } finally {
    setDeletingId(null);
    setConfirmId(null); // Clear modal AFTER deletion completes
  }
};


  const cancelDelete = () => {
    setConfirmId(null);
    toast.info('Deletion cancelled');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#14b8a6'; // Teal
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444';
  };

  const deletingItem = resumes.find(r => r._id === confirmId);
  const mainGradient = 'linear-gradient(315deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)';


  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#e8f0fe',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", 
      color: '#475569',
      width: '100%',  // Changed from minWidth to width
      maxWidth: '100vw',  // Prevent horizontal overflow
      overflowX: 'hidden'  // Hide horizontal scroll
    }}>
      {(isLoading || isLoadingReport) && (
        <LoadingScreen message={isLoadingReport ? "Loading Analysis..." : "Loading History..."} />
      )}

      <div style={{
        minHeight: '100vh',
        background: '#e8f0fe',
        padding: '25px 20px',
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif",
        filter: (isLoading || isLoadingReport) ? 'blur(3px)' : 'none',
        pointerEvents: (isLoading || isLoadingReport) ? 'none' : 'auto',
        transition: 'filter 0.3s ease',
        maxWidth: '100%',  // Added
        margin: '0 auto'  // Center the content
      }}>
        <ToastContainer position="top-right" autoClose={2500} />
        
        {/* Container with max-width for proper layout */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5px' }}>
          
          <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <button
              onClick={() => navigate('/resume-analyzer')}
              onMouseEnter={() => setIsBackHovered(true)}
              onMouseLeave={() => setIsBackHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                borderRadius: '2px',
                padding: '50px 6px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isBackHovered ? '#0891b2' : '#06b6d4',
                cursor: 'pointer',
                transition: 'color 0.2s',
                flexShrink: 0  // Prevent button from shrinking
              }}
            >
              <ArrowLeft size={30} color={isBackHovered ? '#0891b2' : '#06b6d4'} />
            </button>

            <div style={{
              background: mainGradient,
              borderRadius: '24px',
              padding: '24px 30px',  // Reduced padding
              color: 'white',
              boxShadow: '0 8px 24px rgba(6,182,212,0.25)',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',  // Changed from minWidth to width
              flex: 1  // Take remaining space
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{
                  color: 'white',
                  fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',  // Responsive font size
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '0 0 10px 0',
                  flexWrap: 'wrap'  // Allow wrapping on small screens
                }}>
                  <Sparkles size={35} />
                  Resume History 📊
                </h1>
                <p style={{ 
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',  // Responsive font size
                  opacity: 0.95, 
                  margin: 0, 
                  fontWeight: 400 
                }}>
                  Track your progress • View past analyses • Improve over time
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '16px 20px',
              background: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              color: '#991b1b',
              fontWeight: 600,
              marginBottom: '24px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Empty state or Resume cards */}
          {!Array.isArray(resumes) || resumes.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(6,182,212,0.12)',
              border: '2px solid #67e8f9',
              marginLeft: '50px'
            }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              background: '#cffafe',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(6,182,212,0.15)',
            }}>
              <FileText size={56} style={{ color: '#06b6d4' }} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#0891b2', marginBottom: '12px', fontWeight: 800 }}>
              No Resume History Yet 📝
            </h3>
            <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 24px' }}>
              Start analyzing resumes to see your history here!
            </p>
            <button
              onClick={() => navigate('/resume-analyzer/analyzer')}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 32px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(6,182,212,0.3)',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Sparkles size={20} />
              Analyze a Resume Now
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            paddingLeft: '50px',
            paddingRight: '15px',
            width: '100%'
          }}>
            {resumes.map(resume => {
              const score = resume.score
                || resume.overallScore
                || (resume.analysisResult && (resume.analysisResult.score || resume.analysisResult.overallScore))
                || (resume.analysis && (resume.analysis.score || resume.analysis.overallScore))
                || 0;

              const candidateName = resume.fullName
                || resume.candidateName
                || resume.fileName?.replace('.pdf', '')
                || 'Resume Analysis';

              const jobRole = resume.jobRole
                || resume.targetRole
                || resume.position
                || 'Job Role';

              const formattedDate = resume.createdAt
                ? new Date(resume.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
                : 'N/A';

              return (
                <div
                  key={resume._id}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    boxShadow: '0 4px 20px rgba(6,182,212,0.12)',
                    border: '2px solid #a5f3fc',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    transform: deletingId === resume._id ? 'scale(0.98)' : 'scale(1)',
                    opacity: deletingId === resume._id ? 0.6 : 1,
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== resume._id) {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 44px rgba(130, 202, 212, 0.2), 0 20px 44px rgba(130, 202, 212, 0.18)';
                      e.currentTarget.style.borderColor = '#22d3ee';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== resume._id) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,182,212,0.12)';
                      e.currentTarget.style.borderColor = '#a5f3fc';
                    }
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: score > 0 ? getScoreColor(score) : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '1.3rem',
                    boxShadow: `0 4px 16px ${score > 0 ? 'rgba(6,182,212,0.3)' : 'rgba(0,0,0,0.1)'}`,
                    border: '3px solid white'
                  }}>
                    {score > 0 ? score : 'N/A'}
                  </div>

                  <div style={{ paddingRight: '80px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #cffafe, #a5f3fc)',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={24} style={{ color: mainGradient }} strokeWidth={2.5} />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: mainGradient,
                        margin: 0,
                        lineHeight: 1.3,
                        wordBreak: 'break-word'
                      }}>
                        {candidateName}
                      </h3>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: '#cffafe',
                        borderRadius: '8px',
                        border: '1px solid #67e8f9'
                      }}>
                        <span style={{ fontSize: '1rem' }}>📋</span>
                        <span style={{
                          fontSize: '0.95rem',
                          color: '#0891b2',
                          fontWeight: 600
                        }}>
                          {jobRole}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Calendar size={16} style={{ color: '#64748b' }} />
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#64748b',
                          fontWeight: 500
                        }}>
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleViewReport(resume._id)}
                        disabled={deletingId === resume._id}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          background: deletingId === resume._id
                            ? '#cbd5e1'
                            : mainGradient,
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: deletingId === resume._id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s',
                          boxShadow: deletingId === resume._id
                            ? 'none'
                            : '0 4px 12px rgba(6,182,212,0.25)'
                        }}
                      >
                        <Eye size={18} />
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(resume._id)}
                        disabled={deletingId === resume._id}
                        style={{
                          padding: '12px 20px',
                          background: deletingId === resume._id
                            ? '#cbd5e1'
                            : 'linear-gradient(135deg, #fecaca, #fca5a5)',
                          color: deletingId === resume._id ? 'white' : '#dc2626',
                          border: `2px solid ${deletingId === resume._id ? '#cbd5e1' : '#f87171'}`,
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: deletingId === resume._id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {confirmId && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: '#FADADD',
              padding: '40px 36px',
              borderRadius: '24px',
              boxShadow: '0 8px 48px rgba(6,182,212,0.3)',
              minWidth: '380px',
              maxWidth: '500px',
              textAlign: 'center',
              border: '5px solid #F47174',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(239,68,68,0.25)'
              }}>
                <Trash2 size={36} style={{ color: '#dc2626' }} />
              </div>

              <h2 style={{
                color: '#0891b2',
                fontWeight: 800,
                fontSize: '1.5rem',
                marginBottom: '12px',
                margin: 0
              }}>
                Confirm Deletion
              </h2>

              <p style={{
                color: '#475569',
                marginBottom: '24px',
                marginTop: '16px',
                fontWeight: 500,
                fontSize: '1rem',
                lineHeight: 1.6
              }}>
                Are you sure you want to delete:<br />
                <span style={{
                  color: '#0891b2',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  display: 'inline-block',
                  marginTop: '8px'
                }}>
                  {(deletingItem && (deletingItem.fullName || deletingItem.candidateName || deletingItem.fileName?.replace('.pdf', ''))) || 'This resume analysis'}
                </span>
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === confirmId}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: deletingId === confirmId 
                      ? '#94a3b8' 
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: deletingId === confirmId ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s',
                    boxShadow: deletingId === confirmId 
                      ? 'none' 
                      : '0 4px 16px rgba(239,68,68,0.3)',
                    opacity: deletingId === confirmId ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (deletingId !== confirmId) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.4)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (deletingId !== confirmId) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.3)';
                    }
                  }}
                >
                  {deletingId === confirmId ? (
                    <>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTop: '3px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete
                    </>
                  )}
                </button>


                <button
                  onClick={cancelDelete}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: 'white',
                    color: '#475569',
                    border: '2px solid #cbd5e1',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
         @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
      `}</style>
    </div>
  </div>
  );
};

export default ResumeHistory;
