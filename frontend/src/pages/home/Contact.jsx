import { Mail, Clock, Send, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Contact = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ FIX: Track sidebar state

  // ✅ FIX: Listen for sidebar width changes
  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector('[style*="width"]');
      if (sidebar) {
        const width = parseInt(sidebar.style.width);
        setSidebarOpen(width > 70);
      }
    };

    checkSidebar();
    const interval = setInterval(checkSidebar, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="contact" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
        dark:from-[#1a1b1e] dark:via-[#1e1f24] dark:to-[#1a1b1e]
        transition-all duration-300 relative overflow-hidden"
      style={{
        // ✅ FIX: Shift content based on sidebar state
        marginLeft: sidebarOpen ? '250px' : '70px',
        width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
        transition: 'margin-left 0.35s cubic-bezier(.72,-0.2,.25,1), width 0.35s cubic-bezier(.72,-0.2,.25,1)'
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#2196F3]" />
            <span className="text-sm font-medium bg-gradient-to-r from-[#2196F3] to-[#9C27B0] bg-clip-text text-transparent">
              Get in Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">We're Here to </span>
            <br />
            <span className="bg-gradient-to-r from-[#2196F3] via-[#9C27B0] to-[#E91E63] bg-clip-text text-transparent">
              Help You Succeed
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
            Questions? Feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Main Contact Card */}
        <div className="relative group mb-12">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2196F3] via-[#9C27B0] to-[#E91E63] 
            rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white dark:bg-[#25262b] rounded-3xl p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Email */}
              <div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#9C27B0]
                  flex items-center justify-center mb-6
                  group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Drop us a line
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  Our friendly team is always here to chat and answer your questions.
                </p>
                
                <a 
                  href="mailto:support@eduone.com"
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 
                    bg-gradient-to-r from-[#2196F3] to-[#9C27B0]
                    text-white rounded-xl font-semibold text-lg
                    hover:shadow-2xl hover:scale-105
                    transition-all duration-300">
                  <span>support@eduone.com</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Right Side - Support Info */}
              <div className="space-y-6">
                {/* Support Hours */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 
                  rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500
                      flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      Support Hours
                    </h4>
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="flex justify-between">
                      <span>Mon - Fri:</span>
                      <span className="font-semibold">9 AM - 6 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-semibold">10 AM - 4 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-gray-500">Closed</span>
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 
                  rounded-2xl p-6 border border-purple-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500
                      flex items-center justify-center">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      Quick Response
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    We typically respond within <span className="font-bold text-[#2196F3]">24 hours</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white dark:bg-[#25262b] rounded-2xl 
            border border-gray-200 dark:border-gray-800
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#2196F3] to-[#00BCD4] bg-clip-text text-transparent mb-2">
              24hrs
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Response Time
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-[#25262b] rounded-2xl 
            border border-gray-200 dark:border-gray-800
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#9C27B0] to-[#E91E63] bg-clip-text text-transparent mb-2">
              99%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Satisfaction Rate
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-[#25262b] rounded-2xl 
            border border-gray-200 dark:border-gray-800
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Always Here
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Need instant answers? Check out our{' '}
            <a href="#" className="text-[#2196F3] hover:text-[#9C27B0] font-semibold transition-colors">
              Help Center
            </a>
            {' '}or{' '}
            <a href="#" className="text-[#2196F3] hover:text-[#9C27B0] font-semibold transition-colors">
              FAQs
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default Contact;
