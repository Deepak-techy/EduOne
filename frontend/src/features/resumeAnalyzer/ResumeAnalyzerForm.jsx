import { FileText, Loader2, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const ResumeAnalyzerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: '',
    jobRole: '',
    experience: '',
    jobDescription: '',
    resume: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!formData.candidateName || !formData.jobRole || !formData.experience || !formData.jobDescription || !formData.resume) {
      setError('Please fill all fields and upload a resume');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 3500));
      const fileDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(formData.resume);
      });

      const analysisResult = {
        id: Date.now(),
        candidateName: formData.candidateName,
        jobRole: formData.jobRole,
        experience: formData.experience,
        jobDescription: formData.jobDescription,
        fileName: formData.resume.name,
        fileType: formData.resume.type,
        fileDataUrl: fileDataUrl,
        score: Math.floor(Math.random() * 30) + 70,
        improvements: [
          'Add more quantifiable achievements and metrics',
          `Include relevant technical skills for ${formData.jobRole}`,
          'Improve formatting and structure',
          'Add certifications relevant to the role',
          'Expand project descriptions with outcomes',
        ],
        fullReport: {
          strengths: ['Clear job history', 'Good education background', 'Strong technical skills'],
          weaknesses: ['Limited project descriptions', 'Missing key skills', 'Could improve formatting'],
        },
        createdAt: new Date().toISOString(),
      };

      navigate(`/resume-analyzer/result/${analysisResult.id}`, {
        state: { reportData: analysisResult }
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze resume. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <LoadingScreen message="Analyzing Your Resume" />;
  }

  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
        padding: '40px 20px',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/resume-analyzer')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', background: 'white',
            border: 'none', borderRadius: '12px', padding: '12px 24px',
            fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer',
            marginBottom: '24px', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
          }}>
          <ArrowLeft size={18} />
        </button>

        <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            borderRadius: '24px', padding: '48px 40px', marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)', textAlign: 'center',
          }}>
          <h1 style={{
              fontWeight: 900, color: 'white', fontSize: '2.5rem', margin: 0,
              marginBottom: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 20,
            }}>
            <FileText size={40} strokeWidth={2.5} /> Analyze Your Resume
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.15rem', margin: 0, fontWeight: 500 }}>
            Get AI-powered insights in seconds 🚀
          </p>
        </div>

        {error && (
          <div style={{
              padding: '16px 20px', background: '#fee2e2', border: '2px solid #ef4444',
              borderRadius: '12px', color: '#991b1b', fontWeight: 600, marginBottom: '24px',
            }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                Candidate Name *
              </label>
              <input type="text" name="candidateName" value={formData.candidateName} onChange={handleChange}
                placeholder="Enter name..." style={{
                  width: '100%', padding: '16px 20px', border: '2px solid #e0f2fe',
                  borderRadius: '14px', fontSize: '1.05rem', background: 'white',
                  fontWeight: 500, outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                Job Role *
              </label>
              <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange}
                placeholder="e.g., Software Engineer" style={{
                  width: '100%', padding: '16px 20px', border: '2px solid #e0f2fe',
                  borderRadius: '14px', fontSize: '1.05rem', background: 'white',
                  fontWeight: 500, outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                Experience Level *
              </label>
              <select name="experience" value={formData.experience} onChange={handleChange} style={{
                  width: '100%', padding: '16px 20px', border: '2px solid #e0f2fe',
                  borderRadius: '14px', fontSize: '1.05rem', background: 'white',
                  fontWeight: 500, outline: 'none', cursor: 'pointer',
                  color: formData.experience ? '#1e293b' : '#94a3b8',
                }}>
                <option value="">Select level</option>
                <option value="freshers">Freshers (0-1 years)</option>
                <option value="intermediate">Intermediate (1-5 years)</option>
                <option value="professionals">Professional (5+ years)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                Job Description *
              </label>
              <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange}
                placeholder="Paste job description..." style={{
                  width: '100%', padding: '16px 20px', border: '2px solid #e0f2fe',
                  borderRadius: '14px', fontSize: '1.05rem', minHeight: '200px',
                  background: 'white', fontWeight: 500, fontFamily: 'inherit',
                  outline: 'none', resize: 'vertical',
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center' }}>
            <div onClick={() => document.getElementById('resumeFileInput').click()} style={{
                border: formData.resume ? '3px solid #22d3ee' : '3px dashed #0ea5e9',
                borderRadius: '24px', padding: '60px 32px', textAlign: 'center',
                background: formData.resume ? '#cffafe' : '#f0f9ff',
                cursor: 'pointer', width: '100%', transition: 'all 0.3s',
              }}>
              <div style={{
                  width: 120, height: 120, margin: '0 auto 24px',
                  background: formData.resume ? '#22d3ee' : '#0ea5e9',
                  borderRadius: '24px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 12px 28px rgba(14, 165, 233, 0.2)',
                }}>
                {formData.resume ? (
                  <CheckCircle size={60} style={{ color: 'white' }} strokeWidth={2.5} />
                ) : (
                  <span style={{ fontSize: '4rem' }}>📄</span>
                )}
              </div>
              
              <div style={{
                  fontSize: '1.5rem', color: formData.resume ? '#0e7490' : '#0284c7',
                  fontWeight: 800, marginBottom: 16,
                }}>
                {formData.resume ? '✅ Uploaded!' : 'Upload Resume'}
              </div>
              
              <div style={{
                  fontSize: '1.1rem', color: formData.resume ? '#06b6d4' : '#0ea5e9',
                  fontWeight: 600,
                }}>
                {formData.resume ? `📄 ${formData.resume.name}` : 'Click to upload'}
              </div>
              
              {!formData.resume && (
                <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: 12 }}>
                  PDF, DOC, or DOCX (Max 10MB)
                </div>
              )}
              
              <input id="resumeFileInput" type="file" accept=".pdf,.doc,.docx"
                onChange={handleFileUpload} style={{ display: 'none' }}
              />
              
              {formData.resume && (
                <button onClick={(e) => {
                    e.stopPropagation();
                    setFormData(prev => ({ ...prev, resume: null }));
                  }} style={{
                    marginTop: '24px', padding: '12px 32px', background: 'white',
                    border: '2px solid #22d3ee', borderRadius: '14px', color: '#0891b2',
                    fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
                  }}>
                  Change File
                </button>
              )}
            </div>
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={isAnalyzing} style={{
            width: '100%', padding: '20px 0',
            background: isAnalyzing ? '#94a3b8' : 'linear-gradient(to right, #0ea5e9, #06b6d4)',
            color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.3rem',
            fontWeight: 800, cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            boxShadow: isAnalyzing ? 'none' : '0 8px 24px rgba(14, 165, 233, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
          }}>
          {isAnalyzing ? (
            <>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={28} />
              Analyze Resume 🚀
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.95rem' }}>
          * All fields required
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzerForm;
