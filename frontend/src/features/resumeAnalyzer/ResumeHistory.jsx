import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

const ResumeHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewReport = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading History" />;
  }

  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
        padding: '40px 20px',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button onClick={() => navigate('/resume-analyzer')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', background: 'white',
            border: 'none', borderRadius: '12px', padding: '12px 24px',
            fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', cursor: 'pointer',
            marginBottom: '24px', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
          }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{
            background: 'linear-gradient(to right, #0ea5e9, #06b6d4)',
            borderRadius: '24px', padding: '48px', color: 'white',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
            marginBottom: '40px', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, marginBottom: '12px' }}>
              Resume History 📊
            </h1>
            <p style={{ fontSize: '1.15rem', opacity: 0.95, margin: 0, fontWeight: 500 }}>
              Track your progress • View past analyses • Improve over time
            </p>
          </div>
        </div>

        <div style={{
            background: 'white',
            borderRadius: '24px', padding: '80px 40px', textAlign: 'center',
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.12)',
            border: '2px solid #e0f2fe',
          }}
        >
          <div style={{
              width: '120px', height: '120px', margin: '0 auto 24px',
              background: '#f0f9ff',
              borderRadius: '24px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.15)',
            }}>
            <FileText size={56} style={{ color: '#0ea5e9' }} strokeWidth={2} />
          </div>

          <h3 style={{ fontSize: '1.8rem', color: '#0284c7', marginBottom: '12px', fontWeight: 800 }}>
            Coming Soon! 🚀
          </h3>
          
          <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 24px' }}>
            Resume history will be available once you connect your backend API.
          </p>

          <button onClick={() => navigate('/resume-analyzer/analyzer')} style={{
              background: 'linear-gradient(to right, #0ea5e9, #06b6d4)',
              color: 'white', border: 'none', borderRadius: '14px',
              padding: '14px 32px', fontSize: '1.05rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)',
              transition: 'all 0.3s', display: 'inline-flex',
              alignItems: 'center', gap: '10px',
            }}>
            <Sparkles size={20} />
            Analyze a Resume Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeHistory;
