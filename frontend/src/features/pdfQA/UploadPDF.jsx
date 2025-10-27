// src/features/pdfQA/UploadPDF.jsx
import { useState, useEffect, useRef } from 'react';
import { Upload, Send, Loader2, FileText, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { pdfQAService } from '../../services/pdfQAService';

const UploadPDF = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('pdfSessionId');
    if (storedSessionId) setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    setIsUploading(true);

    try {
      const response = await pdfQAService.uploadPDF(file);
      // Backend returns: { statusCode: 200, data: { sessionId: "...", chunkCount: 256 } }
      
      if (response.success && response.data?.sessionId) {
        setUploadedFile(file.name);
        setSessionId(response.data.sessionId);
        sessionStorage.setItem('pdfSessionId', response.data.sessionId);
        
        setChatHistory([{
          type: 'system',
          message: `PDF "${file.name}" uploaded successfully! (${response.data.chunkCount} chunks processed)`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSessionId(null);
    sessionStorage.removeItem('pdfSessionId');
    setChatHistory([]);
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !sessionId) return;

    const userMessage = { type: 'user', message: query, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');
    setIsLoading(true);

    try {
      const response = await pdfQAService.queryUploadedPDF(sessionId, currentQuery);
      // Backend returns: { statusCode: 200, data: "answer as string" }
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.data || 'No answer received',
        source: uploadedFile,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              Upload PDF
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Upload your documents and ask questions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Area */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your PDF
              </h3>
            </div>
            
            <div className="p-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
                disabled={isUploading}
              />

              {!uploadedFile ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full p-8 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-2xl hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
                >
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-teal-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Click to upload</p>
                      <p className="text-xs text-slate-500 mt-1">PDF files only, up to 10MB</p>
                    </div>
                  )}
                </button>
              ) : (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl shadow-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">Successfully Uploaded</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 break-all mt-1">{uploadedFile}</p>
                    </div>
                    <button 
                      onClick={handleRemoveFile} 
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  💡 <span className="font-semibold">Tip:</span> Your PDF is processed securely and deleted after your session ends.
                </p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden" style={{ height: '600px' }}>
            
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20"></div>
              <div className="relative">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  AI Assistant
                </h3>
                <p className="text-xs text-slate-300 mt-1">{uploadedFile || 'Upload a PDF to begin'}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50/50 to-teal-50/30 dark:from-slate-950/50 dark:to-slate-900/50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      {!uploadedFile ? 'Upload a PDF to start' : 'Ask your first question!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-lg ${
                        chat.type === 'user' 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white' 
                          : chat.type === 'system' 
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800' 
                          : chat.type === 'error' 
                          ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-800 dark:text-red-300 border-2 border-red-200 dark:border-red-800' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700'
                      }`}>
                        <p className="text-sm leading-relaxed">{chat.message}</p>
                        {chat.source && chat.type === 'ai' && (
                          <p className="text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 opacity-75">
                            📄 {chat.source}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-800 px-5 py-3 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
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
                  placeholder={!uploadedFile ? "Upload PDF first..." : "Type your question..."}
                  disabled={!uploadedFile || isLoading}
                  className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all disabled:opacity-50 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="submit"
                  disabled={!uploadedFile || isLoading || !query.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-teal-500/50 transition-all transform hover:scale-105 active:scale-95"
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

export default UploadPDF;
