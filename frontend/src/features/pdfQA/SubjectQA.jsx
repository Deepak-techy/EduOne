// // src/features/pdfQA/SubjectQA.jsx
// import { useState, useEffect, useRef } from 'react';
// import { Send, Loader2, BookOpen, Search, Sparkles } from 'lucide-react';
// import { pdfQAService } from '../../services/pdfQAService';
// import MarkdownRenderer from '../../components/common/MarkdownRenderer';


// const SubjectQA = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [query, setQuery] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchSubject, setSearchSubject] = useState('');
  
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory]);

//   const fetchSubjects = async () => {
//     try {
//       const response = await pdfQAService.getSubjects();
//       // Backend returns: { statusCode: 200, data: [...], message: "...", success: true }
//       if (response.success && Array.isArray(response.data)) {
//         setSubjects(response.data);
//       } else {
//         setSubjects([]); // Empty array if API response is invalid
//       }
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       setSubjects([]); // Empty array on error
      
//       // FALLBACK SUBJECTS - Commented out (uncomment if needed for development)
//       /*
//       setSubjects([
//         { code: 'DSA', name: 'Data Structures & Algorithms' },
//         { code: 'OS', name: 'Operating Systems' },
//         { code: 'DBMS', name: 'Database Management Systems' },
//         { code: 'CN', name: 'Computer Networks' },
//         { code: 'ML', name: 'Machine Learning' },
//         { code: 'CPP', name: 'C++' },
//         { code: 'NN', name: 'Neural Networks' },
//         { code: 'NLP', name: 'Natural Language Processing' },
//         { code: 'OOPS', name: 'Object Oriented Programming' },
//         { code: 'AI', name: 'Artificial Intelligence' },
//       ]);
//       */
//     }
//   };

//   const handleSubmitQuery = async (e) => {
//     e.preventDefault();
//     if (!query.trim() || !selectedSubject) return;

//     const userMessage = { type: 'user', message: query, timestamp: new Date().toISOString() };
//     setChatHistory(prev => [...prev, userMessage]);
//     const currentQuery = query;
//     setQuery('');
//     setIsLoading(true);

//     try {
//       const response = await pdfQAService.querySubject(selectedSubject, currentQuery);
//       // Backend returns: { statusCode: 200, data: { answer: "...", sources: [...] } }
      
//       setChatHistory(prev => [...prev, {
//         type: 'ai',
//         message: response.data?.answer || 'No answer received',
//         sources: response.data?.sources || [],
//         timestamp: new Date().toISOString()
//       }]);
//     } catch (error) {
//       console.error('Query error:', error);
//       setChatHistory(prev => [...prev, {
//         type: 'error',
//         message: error.message || 'Something went wrong. Please try again.',
//         timestamp: new Date().toISOString()
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredSubjects = subjects.filter(sub => 
//     sub.name.toLowerCase().includes(searchSubject.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-6 relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-3xl"></div>
//           <div className="relative">
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 flex items-center gap-2">
//               <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
//               Subject Q&A
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400">Ask questions about your favorite subjects</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Subject List */}
//           <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
//             <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4">
//               <h3 className="font-bold text-white flex items-center gap-2">
//                 <BookOpen className="w-5 h-5" />
//                 Select Subject
//               </h3>
//             </div>
            
//             <div className="p-4">
//               <div className="relative mb-3">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search subjects..."
//                   value={searchSubject}
//                   onChange={(e) => setSearchSubject(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all"
//                 />
//               </div>

//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {filteredSubjects.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500 dark:text-slate-400">
//                     <p className="text-sm">No subjects available</p>
//                     <p className="text-xs mt-1">Please check backend connection</p>
//                   </div>
//                 ) : (
//                   filteredSubjects.map((subject) => (
//                     <button
//                       key={subject.code}
//                       onClick={() => setSelectedSubject(subject.code)}
//                       className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
//                         selectedSubject === subject.code
//                           ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/50 transform scale-105'
//                           : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-md'
//                       }`}
//                     >
//                       <span className="font-medium text-sm">{subject.name}</span>
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Chat */}
//           <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden" style={{ height: '600px' }}>
            
//             <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20"></div>
//               <div className="relative">
//                 <h3 className="font-bold text-white flex items-center gap-2">
//                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
//                   AI Assistant
//                 </h3>
//                 <p className="text-xs text-slate-300 mt-1">
//                   {selectedSubject ? subjects.find(s => s.code === selectedSubject)?.name : 'Select a subject to begin'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50/50 to-cyan-50/30 dark:from-slate-950/50 dark:to-slate-900/50">
//               {chatHistory.length === 0 ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center shadow-lg">
//                       <BookOpen className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
//                     </div>
//                     <p className="text-slate-600 dark:text-slate-400 font-medium">
//                       {!selectedSubject ? 'Select a subject to start' : 'Ask your first question!'}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {chatHistory.map((chat, index) => (
//                     <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
//                       <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-lg ${
//                         chat.type === 'user' 
//                           ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white' 
//                           : chat.type === 'error' 
//                           ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-800 dark:text-red-300 border-2 border-red-200 dark:border-red-800' 
//                           : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700'
//                       }`}>
//                         <p className="text-sm leading-relaxed">{chat.message}</p>
//                         {chat.sources && chat.sources.length > 0 && (
//                           <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
//                             <p className="text-xs opacity-75">📚 Source: {chat.sources[0].subject}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   {isLoading && (
//                     <div className="flex justify-start">
//                       <div className="bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-800 px-5 py-3 rounded-2xl shadow-lg">
//                         <div className="flex items-center gap-2">
//                           <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
//                           <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <div ref={chatEndRef} />
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleSubmitQuery} className="border-t-2 border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder={!selectedSubject ? "Select subject first..." : "Type your question..."}
//                   disabled={!selectedSubject || isLoading}
//                   className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all disabled:opacity-50 text-slate-800 dark:text-slate-200"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!selectedSubject || isLoading || !query.trim()}
//                   className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 active:scale-95"
//                 >
//                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubjectQA;
























// src/features/pdfQA/SubjectQA.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, BookOpen, Search, Sparkles } from 'lucide-react';
import { pdfQAService } from '../../services/pdfQAService';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';


const SubjectQA = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSubject, setSearchSubject] = useState('');
  
  const chatEndRef = useRef(null);


  useEffect(() => {
    fetchSubjects();
  }, []);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);


  const fetchSubjects = async () => {
    try {
      const response = await pdfQAService.getSubjects();
      // Backend returns: { statusCode: 200, data: [...], message: "...", success: true }
      if (response.success && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        setSubjects([]); // Empty array if API response is invalid
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]); // Empty array on error
      
      // FALLBACK SUBJECTS - Commented out (uncomment if needed for development)
      /*
      setSubjects([
        { code: 'DSA', name: 'Data Structures & Algorithms' },
        { code: 'OS', name: 'Operating Systems' },
        { code: 'DBMS', name: 'Database Management Systems' },
        { code: 'CN', name: 'Computer Networks' },
        { code: 'ML', name: 'Machine Learning' },
        { code: 'CPP', name: 'C++' },
        { code: 'NN', name: 'Neural Networks' },
        { code: 'NLP', name: 'Natural Language Processing' },
        { code: 'OOPS', name: 'Object Oriented Programming' },
        { code: 'AI', name: 'Artificial Intelligence' },
      ]);
      */
    }
  };


  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !selectedSubject) return;


    const userMessage = { type: 'user', message: query, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setIsLoading(true);


    try {
      const response = await pdfQAService.querySubject(selectedSubject, currentQuery);
      // Backend returns: { statusCode: 200, data: { answer: "...", sources: [...] } }
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.data?.answer || 'No answer received',
        sources: response.data?.sources || [],
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Query error:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchSubject.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              Subject Q&A
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Ask questions about your favorite subjects</p>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Subject List */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Select Subject
              </h3>
            </div>
            
            <div className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all"
                />
              </div>


              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSubjects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">No subjects available</p>
                    <p className="text-xs mt-1">Please check backend connection</p>
                  </div>
                ) : (
                  filteredSubjects.map((subject) => (
                    <button
                      key={subject.code}
                      onClick={() => setSelectedSubject(subject.code)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        selectedSubject === subject.code
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/50 transform scale-105'
                          : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-md'
                      }`}
                    >
                      <span className="font-medium text-sm">{subject.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>


          {/* Chat */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden" style={{ height: '600px' }}>
            
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20"></div>
              <div className="relative">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  AI Assistant
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedSubject ? subjects.find(s => s.code === selectedSubject)?.name : 'Select a subject to begin'}
                </p>
              </div>
            </div>


            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50/50 to-cyan-50/30 dark:from-slate-950/50 dark:to-slate-900/50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      {!selectedSubject ? 'Select a subject to start' : 'Ask your first question!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-lg ${
                        chat.type === 'user' 
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white' 
                          : chat.type === 'error' 
                          ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-800 dark:text-red-300 border-2 border-red-200 dark:border-red-800' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700'
                      }`}>
                        {/* Conditional rendering: user messages as plain text, AI messages with markdown */}
                        {chat.type === 'user' ? (
                          <p className="text-sm leading-relaxed">{chat.message}</p>
                        ) : (
                          <MarkdownRenderer content={chat.message} />
                        )}
                        
                        {chat.sources && chat.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs opacity-75">📚 Source: {chat.sources[0].subject}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-800 px-5 py-3 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>


            <form onSubmit={handleSubmitQuery} className="border-t-2 border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={!selectedSubject ? "Select subject first..." : "Type your question..."}
                  disabled={!selectedSubject || isLoading}
                  className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-all disabled:opacity-50 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="submit"
                  disabled={!selectedSubject || isLoading || !query.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};


export default SubjectQA;
