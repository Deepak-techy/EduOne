import { useNavigate } from 'react-router-dom';
import { History, FileCheck2, Zap, ArrowRight, Target, Shield, Star, TrendingUp, Clock } from 'lucide-react';

const ResumeAnalyzerHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
        padding: '40px 20px',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            borderRadius: '24px',
            padding: '80px 60px',
            marginBottom: '60px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(14, 165, 233, 0.25)',
          }}>
          
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '30px',
              marginBottom: '24px',
              fontSize: '0.9rem',
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}>
              ✨ AI-Powered Resume Analysis
            </div>

            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              marginBottom: '24px',
              lineHeight: 1.2,
            }}>
              Land Your Dream Job with
              <br />
              <span style={{ 
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                Smart Resume Analysis
              </span>
            </h1>

            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '40px',
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}>
              Your intelligent companion for smart learning 📚
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/resume-analyzer/analyzer')}
                style={{
                  padding: '18px 40px',
                  background: 'white',
                  color: '#0284c7',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.3)';
                }}
              >
                <Zap size={22} />
                Analyze Resume Now
                <ArrowRight size={22} />
              </button>

              <button
                onClick={() => navigate('/resume-analyzer/history')}
                style={{
                  padding: '18px 36px',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.25)';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <History size={22} />
                View History
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              marginTop: '40px',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: <Zap size={16} />, text: 'Smart Notes' },
                { icon: <Target size={16} />, text: 'AI Insights' },
                { icon: <Shield size={16} />, text: 'Quick Search' },
              ].map((badge, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#22d3ee',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  {badge.icon}
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}>
          {[
            {
              icon: <Zap size={36} style={{ color: '#0ea5e9' }} strokeWidth={2.5} />,
              title: 'Lightning Fast',
              description: 'Faster than making instant noodles. Seriously.',
              bg: '#f0f9ff',
            },
            {
              icon: <Target size={36} style={{ color: '#22d3ee' }} strokeWidth={2.5} />,
              title: 'Job-Specific Tips',
              description: 'No generic advice. Only what matters for YOUR role.',
              bg: '#f0f9ff',
            },
            {
              icon: <Shield size={36} style={{ color: '#0ea5e9' }} strokeWidth={2.5} />,
              title: 'Private & Secure',
              description: 'Your resume, your secrets. We won\'t tell anyone!',
              bg: '#f0f9ff',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: feature.bg,
                borderRadius: '20px',
                padding: '32px 28px',
                border: '2px solid #e0f2fe',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.08)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.08)';
              }}
            >
              <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#1e293b',
                marginBottom: '10px',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px 50px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '2px solid #e5e7eb',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#0284c7',
            textAlign: 'center',
            marginBottom: '50px',
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
          }}>
            {[
              { step: '1', icon: <FileCheck2 size={32} />, title: 'Upload Resume', desc: 'Drop your resume (PDF/DOC)' },
              { step: '2', icon: <TrendingUp size={32} />, title: 'AI Analysis', desc: 'Our AI analyzes in seconds' },
              { step: '3', icon: <Star size={32} />, title: 'Get Results', desc: 'Download detailed report' },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)',
                  position: 'relative',
                }}>
                  {item.icon}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '32px',
                    height: '32px',
                    background: '#22d3ee',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    color: 'white',
                  }}>
                    {item.step}
                  </div>
                </div>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button
              onClick={() => navigate('/resume-analyzer/analyzer')}
              style={{
                padding: '18px 48px',
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 32px rgba(14, 165, 233, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.3)';
              }}
            >
              <Zap size={24} />
              Start Your Free Analysis
              <ArrowRight size={24} />
            </button>
            <p style={{ marginTop: '16px', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
              No credit card required • Takes less than 2 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerHome;
