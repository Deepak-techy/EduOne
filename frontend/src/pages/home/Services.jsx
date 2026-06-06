// src/pages/home/Services.jsx

import { FileText, BookOpen, Users, Calendar, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Services = () => {
  // ❌ REMOVED: Local sidebar state tracking
  // ✅ KEPT: useAuth for user authentication
  const navigate = useNavigate();
  const { user } = useAuth();

  // ❌ REMOVED: useEffect polling for sidebar changes

  const services = [
    {
      icon: FileText,
      title: 'PDF Q&A',
      description: 'Ask questions from your PDFs instantly with AI-powered intelligence',
      color: 'from-blue-500 to-cyan-500',
      delay: '0'
    },
    {
      icon: BookOpen,
      title: 'Note Organizer',
      description: 'Organize and manage your study notes efficiently with smart categorization',
      color: 'from-purple-500 to-pink-500',
      delay: '100'
    },
    {
      icon: Calendar,
      title: 'Academic Planner',
      description: 'Plan your academic schedule and never miss important deadlines',
      color: 'from-green-500 to-emerald-500',
      delay: '200'
    },
    {
      icon: Shield,
      title: 'Resume Builder',
      description: 'Build professional resumes with AI assistance and stand out',
      color: 'from-pink-500 to-rose-500',
      delay: '300'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with students worldwide and share knowledge together',
      color: 'from-orange-500 to-red-500',
      delay: '400'
    }
  ];

  const featureRoute = {
    'PDF Q&A': '/pdf-qa',
    'Note Organizer': '/notes-organizer',
    'Academic Planner': '/academic-planner',
    'Resume Builder': '/resume-analyzer',
    'Community': '/community'
  };

  return (
    <section 
      id="services" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50
        dark:from-[#1a1b1e] dark:via-[#1e1f24] dark:to-[#1a1b1e]
        transition-all duration-300 relative overflow-hidden"
      // ✅ FIXED: Removed inline styles - App.jsx handles layout now
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#2196F3]" />
            <span className="text-sm font-medium text-[#2196F3] dark:text-blue-400">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Everything You Need </span>
            <br />
            <span className="bg-gradient-to-r from-[#2196F3] to-[#00BCD4] bg-clip-text text-transparent">
              In One Platform
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto mt-4">
            Powerful AI-driven tools designed to boost your academic success
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const route = featureRoute[service.title];

            return (
              <div
                key={index}
                onClick={() => {
                  if (!user) return;
                  if (route) navigate(route);
                }}
                className={`group relative bg-white dark:bg-[#25262b] 
                  rounded-2xl p-8 
                  border border-gray-200 dark:border-gray-800
                  hover:border-transparent dark:hover:border-transparent
                  hover:shadow-2xl hover:-translate-y-2
                  transition-all duration-500
                  ${user ? 'cursor-pointer' : 'cursor-not-allowed'} 
                  overflow-hidden
                  w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]`}
                style={{ animationDelay: `${service.delay}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="absolute inset-0 bg-white dark:bg-[#25262b] 
                  group-hover:opacity-95 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className={`w-16 h-16 mb-6 rounded-xl 
                    bg-gradient-to-br ${service.color}
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-6
                    transition-all duration-500 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3
                    group-hover:text-gray-900 dark:group-hover:text-white
                    transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4
                    group-hover:text-gray-700 dark:group-hover:text-gray-300
                    transition-colors duration-300">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#2196F3] dark:text-blue-400 font-medium
                    opacity-0 group-hover:opacity-100 
                    transform translate-x-0 group-hover:translate-x-2
                    transition-all duration-300">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {!user && (
                  <div className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none">
                    <span className="text-xs font-medium text-white/90 bg-black/45 backdrop-blur px-2 py-1 rounded-lg">
                      Login required
                    </span>
                  </div>
                )}

                <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className={`w-full h-full bg-gradient-to-br ${service.color} rounded-bl-full`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Ready to experience all features?
          </p>
          <button className="px-8 py-4 rounded-full 
            bg-gradient-to-r from-[#2196F3] to-[#00BCD4]
            text-white font-semibold text-base
            hover:shadow-2xl hover:scale-105
            transition-all duration-300
            inline-flex items-center gap-2">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
