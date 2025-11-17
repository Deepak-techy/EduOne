// import { useNavigate } from 'react-router-dom';
// import { History, FileCheck2, Zap, ArrowRight, TrendingUp, Star, Sparkles } from 'lucide-react';

// const ResumeAnalyzerHome = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #cffafe 0%, #e0f2fe 50%, #dbeafe 100%)',
//       padding: '60px 20px',
//       fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
//     }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
//         {/* Simple Header Section */}
//         <div style={{ textAlign: 'center', marginBottom: '60px' }}>
//           <div style={{
//             display: 'inline-block',
//             padding: '8px 20px',
//             background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
//             borderRadius: '30px',
//             marginBottom: '20px',
//             fontSize: '0.9rem',
//             color: 'white',
//             fontWeight: 600,
//             boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
//           }}>
//             ✨ AI-Powered Resume Analysis
//           </div>

//           <h1 style={{
//             fontSize: '3.2rem',
//             fontWeight: 900,
//             color: '#164e63',
//             margin: 0,
//             marginBottom: '20px',
//             lineHeight: 1.2,
//           }}>
//             Land Your Dream Job with
//             <br />
//             <span style={{ 
//               background: 'linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}>
//               Smart Resume Analysis
//             </span>
//           </h1>

//           <p style={{
//             fontSize: '1.2rem',
//             color: '#475569',
//             marginBottom: '40px',
//             maxWidth: '650px',
//             margin: '0 auto 40px',
//             lineHeight: 1.6,
//           }}>
//             Your intelligent companion for smart learning and career growth 📚
//           </p>

//           {/* CTA Buttons */}
//           <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
//             <button
//               onClick={() => navigate('/resume-analyzer/analyzer')}
//               style={{
//                 padding: '16px 36px',
//                 background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '12px',
//                 fontSize: '1.1rem',
//                 fontWeight: 800,
//                 cursor: 'pointer',
//                 boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
//                 transition: 'all 0.3s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.transform = 'translateY(-3px)';
//                 e.target.style.boxShadow = '0 12px 32px rgba(6, 182, 212, 0.45)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.35)';
//               }}
//             >
//               <Zap size={22} />
//               Analyze Resume Now
//               <ArrowRight size={22} />
//             </button>

//             <button
//               onClick={() => navigate('/resume-analyzer/history')}
//               style={{
//                 padding: '16px 32px',
//                 background: 'white',
//                 color: '#0891b2',
//                 border: '2px solid #a5f3fc',
//                 borderRadius: '12px',
//                 fontSize: '1.1rem',
//                 fontWeight: 700,
//                 cursor: 'pointer',
//                 transition: 'all 0.3s',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 boxShadow: '0 4px 12px rgba(6, 182, 212, 0.1)',
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = '#ecfeff';
//                 e.target.style.transform = 'translateY(-3px)';
//                 e.target.style.boxShadow = '0 8px 20px rgba(6, 182, 212, 0.15)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = 'white';
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.1)';
//               }}
//             >
//               <History size={22} />
//               View History
//             </button>
//           </div>

//           {/* Trust badges */}
//           <div style={{
//             display: 'flex',
//             gap: '20px',
//             justifyContent: 'center',
//             marginTop: '40px',
//             flexWrap: 'wrap',
//           }}>
//             {[
//               { icon: <Sparkles size={16} />, text: 'Smart Notes' },
//               { icon: <Zap size={16} />, text: 'AI Insights' },
//               { icon: <FileCheck2 size={16} />, text: 'Quick Search' },
//             ].map((badge, idx) => (
//               <div key={idx} style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 padding: '8px 16px',
//                 background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
//                 borderRadius: '20px',
//                 color: 'white',
//                 fontSize: '0.9rem',
//                 fontWeight: 600,
//                 boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
//               }}>
//                 {badge.icon}
//                 {badge.text}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 3-Step Process Cards (Upload Resume, AI Analysis, Get Results) */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//           gap: '24px',
//           marginBottom: '60px',
//         }}>
//           {[
//             {
//               step: '1',
//               icon: <FileCheck2 size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
//               title: 'Upload Resume',
//               description: 'Drop your resume (PDF/DOC)',
//               bg: '#ecfeff',
//               border: '#67e8f9',
//               iconBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
//             },
//             {
//               step: '2',
//               icon: <TrendingUp size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
//               title: 'AI Analysis',
//               description: 'Our AI analyzes in seconds',
//               bg: '#cffafe',
//               border: '#22d3ee',
//               iconBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
//             },
//             {
//               step: '3',
//               icon: <Star size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
//               title: 'Get Results',
//               description: 'Download detailed report',
//               bg: '#e0f2fe',
//               border: '#7dd3fc',
//               iconBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
//             },
//           ].map((feature, idx) => (
//             <div
//               key={idx}
//               style={{
//                 background: feature.bg,
//                 borderRadius: '20px',
//                 padding: '32px 28px',
//                 border: `2px solid ${feature.border}`,
//                 boxShadow: '0 4px 12px rgba(6, 182, 212, 0.08)',
//                 transition: 'all 0.3s',
//                 position: 'relative',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-6px)';
//                 e.currentTarget.style.boxShadow = '0 12px 28px rgba(6, 182, 212, 0.15)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.08)';
//               }}
//             >
//               <div style={{
//                 width: '70px',
//                 height: '70px',
//                 background: feature.iconBg,
//                 borderRadius: '16px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginBottom: '20px',
//                 boxShadow: '0 6px 20px rgba(6, 182, 212, 0.25)',
//                 position: 'relative',
//               }}>
//                 {feature.icon}
//                 <div style={{
//                   position: 'absolute',
//                   top: '-8px',
//                   right: '-8px',
//                   width: '28px',
//                   height: '28px',
//                   background: '#22d3ee',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '0.85rem',
//                   fontWeight: 900,
//                   color: 'white',
//                   boxShadow: '0 2px 8px rgba(34, 211, 238, 0.4)',
//                 }}>
//                   {feature.step}
//                 </div>
//               </div>
//               <h3 style={{
//                 fontSize: '1.4rem',
//                 fontWeight: 800,
//                 color: '#164e63',
//                 marginBottom: '10px',
//               }}>
//                 {feature.title}
//               </h3>
//               <p style={{
//                 fontSize: '0.95rem',
//                 color: '#475569',
//                 lineHeight: 1.6,
//                 margin: 0,
//               }}>
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>

        
//       </div>
//     </div>
//   );
// };

// export default ResumeAnalyzerHome;





import { useNavigate } from 'react-router-dom';
import { History, FileCheck2, Zap, ArrowRight, TrendingUp, Star, Sparkles } from 'lucide-react';

// const mainGradient = 'linear-gradient(180deg, rgb(0,140,255), rgb(0,230,255))';
const mainGradient = 'linear-gradient(90deg, #0099FF, #00D4FF)';


const ResumeAnalyzerHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(10deg, #ffffff, #e8f0fe)',
      padding: '30px 10px',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '50px',
      maxWidth: '1500px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '700px' }}>
        {/* PAYLY logo replaces AI tagline */}
        <div className="inline-flex items-center justify-center w-24 h-24 
          bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 
          rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent"></div>
          <FileCheck2 className="w-12 h-12 text-white animate-pulse relative z-10" strokeWidth={3} />
        </div>


        <h1
          style={{
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
          }}
        >
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
        <div style={{ marginTop: '38px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/resume-analyzer/analyzer')}
            style={{
              padding: '16px 44px',
              background: mainGradient,
              color: 'white',
              border: 'none',
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
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 20px 44px rgba(32, 158, 255, 0.2), 0 20px 44px rgba(130, 202, 212, 0.18)';
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
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        padding: '0 20px',
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
            iconBg: mainGradient
          },
          {
            step: '2',
            icon: <TrendingUp size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
            title: 'AI Analysis',
            description: 'Our AI analyzes in seconds',
            bg: 'rgb(240, 244, 255)',
            border: 'rgb(32, 158, 255)',
            iconBg: mainGradient
          },
          {
            step: '3',
            icon: <Star size={36} style={{ color: 'white' }} strokeWidth={2.5} />,
            title: 'Get Results',
            description: 'Download detailed report',
            bg: 'rgb(240, 244, 255)',
            border: 'rgb(32, 158, 255)',
            iconBg: mainGradient
          }
        ].map((feature, idx) => (
          <div key={idx} style={{
            background: feature.bg,
            borderRadius: '20px',
            padding: '32px 28px',
            border: `2px solid ${feature.border}`,
            boxShadow: '0 8px 30px rgba(130, 202, 212, 0.09), 0 8px 30px rgba(32, 158, 255, 0.08)',
            transition: 'all 0.3s ease',
            position: 'relative',
            cursor: 'default'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(130, 202, 212, 0.13), 0 16px 40px rgba(32, 158, 255, 0.13)';
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
      <style>
{`
  @keyframes auraGlow {
  0% {
    text-shadow: 0 0 3px rgba(14,165,233,0.4);
  }
  50% {
    text-shadow: 0 0 11px rgba(14,165,233,0.8);
  }
  100% {
    text-shadow: 0 0 3px rgba(14,165,233,0.4);
  }
}
`}
</style>
    </div>
  );
};

export default ResumeAnalyzerHome;

