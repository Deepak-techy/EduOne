import { FileText, Loader2, CheckCircle, ArrowLeft, Sparkles, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { resumeService } from '../../services/resumeService';

const ResumeAnalyzerForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    candidateName: '',
    jobRole: '',
    experience: '',
    jobDescription: '',
    resume: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);

  useEffect(() => {
    if (error) {
      setShowErrorPopup(true);
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      const allowedTypes = [
        'application/pdf',
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setError('');
    }
  };

  const handleChangeFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData((prev) => ({ ...prev, resume: null }));
  };

  const handleAnalyze = async () => {
  // Validation
  if (!formData.candidateName || !formData.jobRole || !formData.experience || !formData.jobDescription || !formData.resume) {
    setError('Please fill all fields and upload a resume');
    return;
  }

  setIsAnalyzing(true);
  setError('');

  try {
    // Prepare form data for upload
    const uploadData = new FormData();
    uploadData.append('fullName', formData.candidateName);
    uploadData.append('jobRole', formData.jobRole);
    uploadData.append('experienceLevel', formData.experience);
    uploadData.append('jobDescription', formData.jobDescription);
    uploadData.append('resume', formData.resume);

    // Call backend API
    const result = await resumeService.analyzeResume(uploadData);
    const backendData = result?.data?.data || result?.data || {};

    // Check for errors or empty response
    if (!backendData || backendData.error || typeof backendData !== 'object' || Object.keys(backendData).length === 0) {
      setError(backendData?.error || 'Analysis failed. Please check your PDF and try again.');
      setIsAnalyzing(false);
      return;
    }

    // Extract resume ID from nested structure (data.resume._id)
    const resumeId = backendData.resume?._id || backendData._id || backendData.id;

    if (resumeId) {
      // Navigate using the saved resume ID from backend
      console.log('Navigating to result with ID:', resumeId);
      navigate(`/resume-analyzer/result/${resumeId}`);
    } else {
      // Fallback: Create temporary blob URL and navigate to /result/new
      console.log('No resume ID found, using fallback with blob URL');
      const localFileUrl = URL.createObjectURL(formData.resume);
      const enhancedData = {
        ...backendData,
        fullName: formData.candidateName,
        jobRole: formData.jobRole,
        experienceLevel: formData.experience,
        score: backendData.overallScore || backendData.score || 0,
        improvements: backendData.improvements || backendData.suggestions || [],
        strengths: backendData.strengths || [],
        categoryScores: backendData.categoryScores || {},
        missingKeywords: backendData.missingKeywords || [],
        summary: backendData.summary || '',
        fileUrl: localFileUrl,
        fileName: formData.resume.name,
      };
      navigate(`/resume-analyzer/result/new`, { state: { reportData: enhancedData } });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    let msg = 'Failed to analyze resume. ';
    if (error?.response?.status === 500) {
      msg += 'Server error. Try another PDF.';
    } else {
      msg += error?.message || 'Please check your file and try again.';
    }
    setError(msg);
    setIsAnalyzing(false);
  }
};


const mainGradient = 'linear-gradient(90deg, #0099FF, #00D4FF)';

  return (
    <div style={{ minHeight: '50vh', background: '#e8f0fe', padding: 10, fontFamily: '"Inter", sans-serif', position: 'relative' }}>
      {isAnalyzing && <LoadingScreen message="Analyzing Your Resume..." />}
      {showErrorPopup && error && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            maxWidth: 400,
            background: '#fee2e2',
            border: '2px solid #0ea5e9',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 10px 40px rgba(14,165,233,0.15)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#0ea5e9', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{error}</p>
          </div>
          <button
            onClick={() => {
              setShowErrorPopup(false);
              setError('');
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0891b2', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div
        style={{
          minHeight: '50vh',
          padding: 6,
          filter: isAnalyzing ? 'blur(3px)' : 'none',
          pointerEvents: isAnalyzing ? 'none' : 'auto',
          transition: 'filter 0.3s',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={() => navigate('/resume-analyzer')}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'left',
              gap: '0px',
              background: 'none',
              border: 'none',
              borderRadius: '2px',
              padding: '0px 4px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: isBackHovered ? '#0d9488' : '#06b6d4',
              cursor: 'pointer',
              marginBottom: '2px',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={30} color={isBackHovered ? '#0d9488' : '#06b6d4'} />
          </button>
          <div
            style={{
              background: mainGradient,
              borderRadius: 16,
              padding: '15px 500px',
              marginBottom: 20,
              boxShadow: '0 5px 24px rgba(14,165,233,0.13)',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontWeight: 900,
                color: 'white',
                fontSize: '1.75rem',
                margin: 0,
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
              }}
            >
              <FileText size={28} strokeWidth={2.6} /> Analyze Your Resume
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
              Get AI-powered insights in seconds 🚀
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            flexWrap: 'wrap',
            alignItems: 'stretch',
            filter: isAnalyzing ? 'blur(4px)' : 'none',
            transition: 'filter 0.3s',
          }}
        >
          {/* Left inputs */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column' }}>
            {['candidateName', 'jobRole'].map((field) => (
              <div style={{ marginBottom: 18 }} key={field}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.97rem',
                  }}
                >
                  {field === 'candidateName' ? 'Candidate Name *' : 'Job Role *'}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field === 'candidateName' ? 'Enter name...' : 'e.g., Software Engineer'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #7dd3fc',
                    borderRadius: 12,
                    fontSize: '1rem',
                    background: '#fff',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.97rem',
                }}
              >
                Experience Level *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #7dd3fc',
                  borderRadius: 12,
                  fontSize: '1rem',
                  background: '#fff',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  color: formData.experience ? '#0e7490' : '#a2aace',
                }}
              >
                <option value="">Select level</option>
                <option value="Fresher (0-1 years)">Freshers (0-1 years)</option>
                <option value="Intermediate (1-5 years)">Intermediate (1-5 years)</option>
                <option value="Experienced (5+ years)">Experienced (5+ years)</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.97rem',
                }}
              >
                Job Description *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste job description..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #7dd3fc',
                  borderRadius: 12,
                  fontSize: '1rem',
                  flex: 1,
                  background: '#fff',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  minHeight: 140,
                }}
              />
            </div>
            {/* Analyze Button */}
            <div
              style={{
                minHeight: '15vh',
                background: '#e8f0fe',
                padding: 20,
                fontFamily: '"Inter", sans-serif',
                position: 'relative',
              }}
            >
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                style={{
                  width: 'auto',
                  minWidth: 500,
                  margin: '0 auto',
                  display: 'flex',
                  padding: '14px 48px',
                  background: isAnalyzing
                    ? '#38bdf8'
                    : 'linear-gradient(to right, #38bdf8, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 50,
                  fontSize: '1.17rem',
                  fontWeight: 800,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  boxShadow: isAnalyzing ? 'none' : '0 8px 22px rgba(14,165,233,0.16)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!isAnalyzing) {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 12px 32px rgba(6,182,212,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 24px rgba(14,165,233,0.16)';
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} /> Save & Analyze Resume 🚀
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right file upload */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex' }}>
            <div
              onClick={() => fileInputRef.current?.click()} // Fix upload trigger
              style={{
                border: formData.resume ? '3px solid #22c55e' : '3px dashed #06b6d4',
                borderRadius: 20,
                padding: '6px 16px 16px 16px',
                textAlign: 'center',
                background: formData.resume ? '#dcfce7' : '#f0f9ff',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxHeight: '500px',
                overflow: 'hidden',
              }}
              aria-label="Upload Resume"
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  margin: '0 auto 20px',
                  background: formData.resume
                    ? 'linear-gradient(135deg, #34d399 10%, #22c55e 90%)'
                    : '#06b6d4',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: formData.resume ? '0 8px 20px rgba(34,197,94,0.3)' : '0 8px 20px rgba(6,182,212,0.2)',
                }}
              >
                {formData.resume ? (
                  <CheckCircle size={60} color="white" strokeWidth={2.5} />
                ) : (
                  <span style={{ fontSize: '3rem', color: '#06b6d4' }}>📄</span>
                )}
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  color: formData.resume ? '#15803d' : '#0ea5e9',
                  fontWeight: 1000,
                  marginBottom: 12,
                }}
              >
                {formData.resume ? '✅ Uploaded!' : 'Upload Resume'}
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  color: formData.resume ? '#16a34a' : '#0ea5e9',
                  fontWeight: 800,
                }}
              >
                {formData.resume ? `📄 ${formData.resume.name}` : 'Click to upload'}
              </div>
              {!formData.resume && (
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 10 }}>
                  PDF(Max 20MB)
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              {formData.resume && (
                <button
                  onClick={handleChangeFile}
                  style={{
                    marginTop: 16,
                    padding: '10px 28px',
                    background: 'white',
                    border: '2px solid #22c55e',
                    borderRadius: '50px',
                    color: '#15803d',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',

                  }}
                >
                  Change File
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0;} to { transform: translateX(0); opacity: 1;} }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzerForm;
