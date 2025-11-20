
import { useNavigate } from 'react-router-dom';
import { History, FileCheck2, Zap, ArrowRight, TrendingUp, Star, Sparkles } from 'lucide-react';

  const mainGradient = 'linear-gradient(315deg, #0099FF 0%, #00D4FF 0%, #60A5FA 100%, #2563EB 150%)';
const newGradient = 'linear-gradient(315deg, #0099FF 0%, #00D4FF 5%, #60A5FA 90%, #2563EB 150%)';
const ResumeAnalyzerHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(10deg, #ffffff, #e8f0fe)',
      padding: '30px 170px',  // Increased from 10px to 170px for side padding
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '50px',
      maxWidth: '1500px',  
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '700px' }}>
        {/* Logo */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '96px',
          height: '96px',
          background: 'linear-gradient(205deg, #22d3ee, #06b6d4, #0284c7)',
          borderRadius: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(6, 182, 212, 0.4)',
          transform: 'scale(1)',
          transition: 'transform 0.3s',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: newGradient
          }}></div>
          <FileCheck2 size={48} style={{ color: 'white', position: 'relative', zIndex: 10 }} strokeWidth={3} />
        </div>

        <h1 style={{
          fontSize: '3.3rem',
          fontWeight: 900,
          lineHeight: 1.08,
          marginBottom: '24px',
          background: mainGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
          letterSpacing: '-1px',
        }}>
          Resume Analyzer
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'rgb(54,68,97)',
          lineHeight: 1.65,
          margin: 'auto',
          maxWidth: '600px',
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          fontWeight: 400
        }}>
          Your AI companion for landing that <span style={{
            background: mainGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            fontFamily: "'Poppins', 'Inter', Arial, sans-serif"
          }}>dream job</span>
        </p>

        {/* CTA Buttons */}
        <div style={{ 
          marginTop: '38px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          flexWrap: 'wrap',
          padding: '0 20px'  
        }}>
          <button
            onClick={() => navigate('/resume-analyzer/analyzer')}
            style={{
              padding: '16px 44px',
              background: mainGradient,
              color: 'white',
              border: mainGradient,
              borderRadius: '20px',
              fontSize: '1.12rem',
              fontWeight: 800,
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
              cursor: 'pointer',
              boxShadow: '0 12px 28px rgba(32, 158, 255, 0.12), 0 12px 28px rgba(130, 202, 212, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.3px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.059)';
              e.currentTarget.style.boxShadow = '0 20px 44px rgba(130, 202, 212, 0.2), 0 20px 44px rgba(130, 202, 212, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(32, 158, 255, 0.12), 0 12px 28px rgba(130, 202, 212, 0.12)';
            }}
          >
            <Zap size={22} /> Analyze Resume Now <ArrowRight size={22} />
          </button>
          
          <button
            onClick={() => navigate('/resume-analyzer/history')}
            style={{
              padding: '16px 38px',
              background: 'white',
              color: 'rgb(130, 202, 212)',
              border: '2px solid rgb(32, 158, 255)',
              borderRadius: '20px',
              fontSize: '1.12rem',
              fontWeight: 700,
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(130, 202, 212, 0.08), 0 6px 16px rgba(32, 158, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgb(240, 244, 255)';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(32, 158, 255, 0.17)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(130, 202, 212, 0.08), 0 6px 16px rgba(32, 158, 255, 0.08)';
            }}
          >
            <History size={22} /> Past Reports
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
      {[
        {
          step: '1',
          icon: <FileCheck2 size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
          title: 'Upload Resume',
          description: 'Drop your resume (PDF)',
          bg: 'rgb(240, 244, 255)',
          border: 'rgb(32, 158, 255)',
          iconBg: newGradient, //'linear-gradient(35deg, #33ADFF, #4DDBFF)',              
          boxShadow: '0 6px 16px rgba(130, 202, 212, 0.08), 0 6px 16px rgba(32, 158, 255, 0.08)',
        },
        {
          step: '2',
          icon: <TrendingUp size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
          title: 'AI Analysis',
          description: 'Our AI analyzes in seconds',
          bg: 'rgb(240, 244, 255)',
          border: 'rgb(32, 158, 255)',
          iconBg: newGradient //'linear-gradient(180deg, #0099FF, #00D4FF)'
        },
        {
          step: '3',
          icon: <Star size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
          title: 'Get Results',
          description: 'Download detailed report',
          bg: 'rgb(240, 244, 255)',
          border: 'rgb(32, 158, 255)',
          iconBg: newGradient //'linear-gradient(135deg, #33ADFF, #4DDBFF)'
        }
      ].map((feature, idx) => (
        <div key={idx} style={{
          background: feature.bg,
          borderRadius: '20px',
          padding: '32px 28px',
          border: `2px solid ${feature.border}`,
          boxShadow: '0 8px 30px rgba(130, 202, 212, 0.09), 0 8px 30px rgba(32, 158, 255, 0.06)',
          transition: 'all 0.3s ease',
          position: 'relative',
          cursor: 'default'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(32, 158, 255, 0.17) , 0 6px 16px rgba(130, 202, 212, 0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(130, 202, 212, 0.09), 0 8px 30px rgba(32, 158, 255, 0.08)';
          }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            background: feature.iconBg,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 6px 20px rgba(130, 202, 212, 0.17), 0 6px 20px rgba(32, 158, 255, 0.11)',
            position: 'relative'
          }}>
            {feature.icon}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '28px',
              height: '28px',
              background: mainGradient,
              borderRadius: '50%',
              color: 'white',
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
              fontWeight: 900,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(130, 202, 212, 0.09), 0 2px 8px rgba(32, 158, 255, 0.07)'
            }}>
              {feature.step}
            </div>
          </div>
          <h3 style={{
            fontSize: '1.31rem',
            fontWeight: 800,
            color: 'rgb(45,55,72)',
            marginBottom: '10px',
            fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
            background: mainGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {feature.title}
          </h3>
          <p style={{
            fontSize: '1rem',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            color: 'rgb(90,108,125)',
            lineHeight: 1.58,
            margin: 0
          }}>
            {feature.description}
          </p>
        </div>
      ))}

      </div>

      {/* Responsive Media Query */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="padding: '30px 80px'"] {
            padding: 30px 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: '30px 80px'"] {
            padding: 20px 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeAnalyzerHome;























