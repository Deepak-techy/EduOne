import React from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';

const LoadingScreen = ({ message = 'Analyzing Resume...' }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif"
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '60px 50px',
        borderRadius: '24px',
        boxShadow: '0 12px 48px rgba(6, 182, 212, 0.15)',
        border: '2px solid #a5f3fc',
        maxWidth: '500px'
      }}>
        {/* Animated Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 30px',
          background:'linear-gradient(90deg, #0099FF, #00D4FF)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)'
        }}>
          <Brain size={60} style={{ color: 'white', strokeWidth: 2 }} />
        </div>

        {/* Message */}
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 900,
          color: '#164e63',
          marginBottom: '16px'
        }}>
          {message}
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#475569',
          marginBottom: '32px'
        }}>
          AI is processing your resume... ✨
        </p>

        {/* Loading Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              background: '#06b6d4',
              borderRadius: '50%',
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
