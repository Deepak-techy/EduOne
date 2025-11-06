import { Target, Zap, Users, Trophy, Sparkles, CheckCircle, Lightbulb, Rocket } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ FIX: Track sidebar state
  const statsRef = useRef(null);

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

  const stats = [
    { 
      number: '10K+', 
      value: 10000,
      label: 'Active Students',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: '50+', 
      value: 50,
      label: 'AI Features',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      number: '98%', 
      value: 98,
      label: 'Satisfaction',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts(stats.map(stat => Math.floor(stat.value * progress)));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(stats.map(stat => stat.value));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatNumber = (value, index) => {
    if (index === 0) return `${(value / 1000).toFixed(value >= 1000 ? 0 : 1)}K+`;
    if (index === 1) return `${value}+`;
    if (index === 2) return `${value}%`;
    return value;
  };

  const features = [
    {
      icon: Lightbulb,
      title: 'AI-Powered Learning',
      description: 'Advanced AI tools to enhance your study experience and boost productivity',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Smart Organization',
      description: 'Keep all your academic materials organized in one intuitive platform',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Collaborative Platform',
      description: 'Connect and learn with students worldwide in a thriving community',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Rocket,
      title: 'Career Ready',
      description: 'Interview prep and resume building tools to kickstart your career',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section 
      id="about" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
        dark:from-[#1a1b1e] dark:via-[#1e1f24] dark:to-[#1a1b1e]
        transition-all duration-300 relative overflow-hidden"
      style={{
        // ✅ FIX: Shift content based on sidebar state
        marginLeft: sidebarOpen ? '250px' : '70px',
        width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
        transition: 'margin-left 0.35s cubic-bezier(.72,-0.2,.25,1), width 0.35s cubic-bezier(.72,-0.2,.25,1)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-80 h-80 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#2196F3]" />
            <span className="text-sm font-medium text-[#2196F3] dark:text-blue-400">
              About EduOne
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Your Academic Success </span>
            <br />
            <span className="bg-gradient-to-r from-[#2196F3] to-[#9C27B0] bg-clip-text text-transparent">
              Starts Here
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            EduOne is your all-in-one academic platform, built to help students and teachers manage learning, tasks, and collaboration. With AI-driven tools, we make studying smarter and organizing easier.
          </p>
        </div>

        {/* Stats with Counting Animation */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white dark:bg-[#25262b] 
                  rounded-2xl p-8 
                  border border-gray-200 dark:border-gray-800
                  hover:shadow-2xl hover:-translate-y-2
                  transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl 
                  bg-gradient-to-br ${stat.color}
                  flex items-center justify-center
                  group-hover:scale-110 group-hover:rotate-6
                  transition-all duration-500 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Animated Number */}
                <div className="text-4xl md:text-5xl font-bold text-[#2196F3] dark:text-blue-400 mb-2 text-center
                  group-hover:scale-110 transition-transform duration-300">
                  {formatNumber(counts[index], index)}
                </div>

                {/* Label */}
                <div className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 text-center">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="text-[#2196F3]">EduOne?</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the powerful features that make learning more effective and enjoyable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white dark:bg-[#25262b] 
                  rounded-2xl p-8 
                  border border-gray-200 dark:border-gray-800
                  hover:shadow-2xl hover:-translate-y-1
                  transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${feature.color}
                  group-hover:w-2 transition-all duration-300`} />

                {/* Content Wrapper */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex-shrink-0
                    bg-gradient-to-br ${feature.color}
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-6
                    transition-all duration-500 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2
                      group-hover:text-[#2196F3] dark:group-hover:text-blue-400
                      transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Check Icon */}
                  <CheckCircle className="w-6 h-6 text-green-500 opacity-0 group-hover:opacity-100
                    transform scale-50 group-hover:scale-100
                    transition-all duration-500 flex-shrink-0" />
                </div>

                {/* Hover Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} 
                  opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* Bottom Mission Statement */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#2196F3] to-[#9C27B0]
          rounded-2xl p-10 md:p-12 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
              To empower students worldwide with cutting-edge AI tools that make learning more accessible, 
              efficient, and enjoyable. We're committed to transforming education through innovation.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
