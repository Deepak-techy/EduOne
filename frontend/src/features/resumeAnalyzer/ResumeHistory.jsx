// ResumeHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Briefcase, Award, Eye, Trash2 } from 'lucide-react';

const ResumeHistory = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
    setHistoryData(history);
  }, []);

  const handleDelete = (id) => {
    const updatedHistory = historyData.filter(item => item.id !== id);
    setHistoryData(updatedHistory);
    localStorage.setItem('resumeHistory', JSON.stringify(updatedHistory));
  };

  const handleView = (id) => {
    navigate(`/resume-analyzer/report/${id}`);
  };

  // Rest of the component remains the same...
  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getExperienceBadge = (exp) => {
    const badges = {
      freshers: { label: 'Fresher', color: '#3b82f6' },
      intermediate: { label: 'Intermediate', color: '#8b5cf6' },
      professionals: { label: 'Professional', color: '#ec4899' },
    };
    return badges[exp] || badges.freshers;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e0f7fa 0%, #f5f5f5 100%)',
        padding: '40px',
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
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

          <div
            style={{
              background: 'linear-gradient(90deg, #11dec1 0%, #1da6dd 100%)',
              borderRadius: '1.25rem',
              padding: '28px 32px',
              color: 'white',
              boxShadow: '0 4px 20px rgba(17, 222, 193, 0.2)',
            }}
          >
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, marginBottom: '8px' }}>
              Resume Analysis History
            </h1>
            <p style={{ fontSize: '1.05rem', opacity: 0.9, margin: 0 }}>
              View and manage all your past resume analyses ({historyData.length} reports)
            </p>
          </div>
        </div>

        {/* History Cards */}
        {historyData.length === 0 ? (
          <div
            style={{
              background: 'white',
              borderRadius: '1.25rem',
              padding: '60px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            <FileText size={64} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#64748b', marginBottom: '8px' }}>
              No History Found
            </h3>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              Start analyzing resumes to see your history here
            </p>
            <button
              onClick={() => navigate('/resume-analyzer/analyzer')}
              style={{
                background: 'linear-gradient(90deg, #1fa2ff 0%, #12c2e9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Analyze Resume Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {historyData.map((item) => {
              const expBadge = getExperienceBadge(item.experience);
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '1.25rem',
                    padding: '24px 28px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    border: '1.5px solid #e2f1f8',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1dc9c2';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(29, 201, 194, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2f1f8';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      {/* Header Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #c6f9f5 0%, #e0fbfa 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileText size={24} style={{ color: '#12bec4' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#145875', margin: 0 }}>
                            {item.candidateName}
                          </h3>
                          <p style={{ fontSize: '0.9rem', color: '#82a7bc', margin: 0 }}>
                            {item.fileName}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Briefcase size={18} style={{ color: '#5bb6b9' }} />
                          <div>
                            <p style={{ fontSize: '0.8rem', color: '#82a7bc', margin: 0 }}>Job Role</p>
                            <p style={{ fontSize: '0.95rem', color: '#145875', fontWeight: 600, margin: 0 }}>
                              {item.jobRole}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Award size={18} style={{ color: expBadge.color }} />
                          <div>
                            <p style={{ fontSize: '0.8rem', color: '#82a7bc', margin: 0 }}>Experience</p>
                            <p
                              style={{
                                fontSize: '0.95rem',
                                color: expBadge.color,
                                fontWeight: 600,
                                margin: 0,
                              }}
                            >
                              {expBadge.label}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Calendar size={18} style={{ color: '#5bb6b9' }} />
                          <div>
                            <p style={{ fontSize: '0.8rem', color: '#82a7bc', margin: 0 }}>Analyzed On</p>
                            <p style={{ fontSize: '0.95rem', color: '#145875', fontWeight: 600, margin: 0 }}>
                              {new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Improvements Preview */}
                      {item.improvements && item.improvements.length > 0 && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0369a1', marginBottom: '6px' }}>
                            AI Improvements:
                          </p>
                          <p style={{ fontSize: '0.88rem', color: '#075985', margin: 0, lineHeight: 1.5 }}>
                            {item.improvements[0]}
                            {item.improvements.length > 1 && ` + ${item.improvements.length - 1} more...`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Score Badge */}
                    <div
                      style={{
                        minWidth: '100px',
                        textAlign: 'center',
                        padding: '16px',
                        background: `${getScoreColor(item.score)}15`,
                        borderRadius: '12px',
                        border: `2px solid ${getScoreColor(item.score)}`,
                      }}
                    >
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: getScoreColor(item.score), margin: 0 }}>
                        {item.score}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: getScoreColor(item.score), margin: 0, fontWeight: 600 }}>
                        Score
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2f1f8' }}>
                    <button
                      onClick={() => handleView(item.id)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'linear-gradient(90deg, #1fa2ff 0%, #12c2e9 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '11px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <Eye size={18} />
                      View Report
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: '#fff',
                        color: '#ef4444',
                        border: '1.5px solid #fecaca',
                        borderRadius: '8px',
                        padding: '11px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;
