// import React from 'react';
// import { Sparkles, Brain, Zap } from 'lucide-react';

// const LoadingScreen = ({ message = 'Analyzing Resume...' }) => {
//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 9999,
//       animation: 'fadeIn 0.3s ease-in',
//     }}>
//       <div style={{ textAlign: 'center' }}>
//         {/* Animated Icons */}
//         <div style={{
//           position: 'relative',
//           width: '200px',
//           height: '200px',
//           margin: '0 auto 40px',
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             animation: 'pulse 2s ease-in-out infinite',
//           }}>
//             <Brain size={80} style={{ color: 'white' }} strokeWidth={2} />
//           </div>
          
//           <div style={{
//             position: 'absolute',
//             top: '20%',
//             left: '20%',
//             animation: 'float 3s ease-in-out infinite',
//           }}>
//             <Sparkles size={40} style={{ color: '#fbbf24' }} />
//           </div>
          
//           <div style={{
//             position: 'absolute',
//             top: '20%',
//             right: '20%',
//             animation: 'float 3s ease-in-out infinite 0.5s',
//           }}>
//             <Zap size={40} style={{ color: '#fbbf24' }} />
//           </div>
          
//           <div style={{
//             position: 'absolute',
//             bottom: '20%',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             animation: 'float 3s ease-in-out infinite 1s',
//           }}>
//             <Sparkles size={40} style={{ color: '#fbbf24' }} />
//           </div>
//         </div>

//         {/* Loading Text */}
//         <h2 style={{
//           color: 'white',
//           fontSize: '2rem',
//           fontWeight: 900,
//           marginBottom: '16px',
//           animation: 'slideUp 0.5s ease-out',
//         }}>
//           {message}
//         </h2>
        
//         <p style={{
//           color: 'rgba(255,255,255,0.9)',
//           fontSize: '1.1rem',
//           fontWeight: 500,
//           marginBottom: '32px',
//           animation: 'slideUp 0.5s ease-out 0.2s both',
//         }}>
//           AI is processing your resume... ✨
//         </p>

//         {/* Progress Bar */}
//         <div style={{
//           width: '300px',
//           height: '6px',
//           background: 'rgba(255,255,255,0.3)',
//           borderRadius: '10px',
//           margin: '0 auto',
//           overflow: 'hidden',
//         }}>
//           <div style={{
//             height: '100%',
//             background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
//             animation: 'progress 2s ease-in-out infinite',
//             borderRadius: '10px',
//           }} />
//         </div>

//         {/* Dots Animation */}
//         <div style={{
//           marginTop: '24px',
//           display: 'flex',
//           gap: '12px',
//           justifyContent: 'center',
//         }}>
//           {[0, 1, 2].map((i) => (
//             <div
//               key={i}
//               style={{
//                 width: '12px',
//                 height: '12px',
//                 background: 'white',
//                 borderRadius: '50%',
//                 animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes pulse {
//           0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
//           50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }

//         @keyframes slideUp {
//           from { 
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes progress {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(400%); }
//         }

//         @keyframes bounce {
//           0%, 80%, 100% { 
//             transform: translateY(0);
//             opacity: 0.5;
//           }
//           40% { 
//             transform: translateY(-10px);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoadingScreen;





import React from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';

const LoadingScreen = ({ message = 'Analyzing Resume...' }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-in',
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Animated Icons */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          margin: '0 auto 40px',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <Brain size={80} style={{ color: 'white' }} strokeWidth={2} />
          </div>
          
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <Sparkles size={40} style={{ color: '#22d3ee' }} />
          </div>
          
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            animation: 'float 3s ease-in-out infinite 0.5s',
          }}>
            <Zap size={40} style={{ color: '#22d3ee' }} />
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'float 3s ease-in-out infinite 1s',
          }}>
            <Sparkles size={40} style={{ color: '#22d3ee' }} />
          </div>
        </div>

        {/* Loading Text */}
        <h2 style={{
          color: 'white',
          fontSize: '2rem',
          fontWeight: 900,
          marginBottom: '16px',
          animation: 'slideUp 0.5s ease-out',
        }}>
          {message}
        </h2>
        
        <p style={{
          color: 'rgba(255,255,255,0.95)',
          fontSize: '1.1rem',
          fontWeight: 500,
          marginBottom: '32px',
          animation: 'slideUp 0.5s ease-out 0.2s both',
        }}>
          AI is processing your resume... ✨
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '300px',
          height: '6px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          margin: '0 auto',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #22d3ee, #06b6d4, #22d3ee)',
            animation: 'progress 2s ease-in-out infinite',
            borderRadius: '10px',
          }} />
        </div>

        {/* Dots Animation */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                background: 'white',
                borderRadius: '50%',
                animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
            opacity: 0.5;
          }
          40% { 
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
