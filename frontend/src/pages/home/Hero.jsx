import Sidebar from "../../components/layout/Sidebar";
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  return (
    <section
      id="home"
      className="flex items-start bg-[#E8F4F8] dark:bg-[rgb(26,27,30)] py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-12 transition-colors duration-300"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0', // sidebar css margin handles distance
        alignItems: 'flex-start',
        minHeight: '540px'
      }}
    >
      {/* Sidebar only when logged in */}
      {user && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      <div className="max-w-7xl mx-auto w-full flex-1 transition-all duration-300">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">

          {/* Hero Heading + desc + buttons */}
          <div className="space-y-6 md:space-y-7 animate-fade-in order-1">
            <div className="flex items-start gap-4 lg:block">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[64px] font-bold leading-tight text-black dark:text-white transition-colors flex-1">
                Your All-in-One<br />
                Academic Companion
              </h1>
              <div className="lg:hidden relative flex-shrink-0 w-36 sm:w-44 md:w-52">
                <div className="absolute inset-0 bg-[#2196F3]/20 dark:bg-[#2196F3]/20 blur-2xl rounded-full" />
                <img
                  src="/src/assets/images/thelogogirl.png"
                  alt="Student with book"
                  className="relative w-full h-auto drop-shadow-xl transition-all duration-500"
                />
              </div>
            </div>
            <p className="text-base md:text-[17px] text-gray-700 dark:text-gray-400 leading-relaxed transition-colors">
              "A comprehensive web platform to support students and faculty with AI-powered academic assistance."
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2">
              <button className="px-8 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-[15px] font-semibold text-white bg-[#2196F3] hover:bg-[#35e09c] shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                Get Started
              </button>
              <button className="group flex items-center justify-center gap-2.5 px-6 md:px-7 py-3 rounded-full text-sm md:text-[15px] font-medium border-2 border-gray-700 dark:border-gray-500 bg-transparent dark:bg-gray-800/50 text-gray-800 dark:text-yellow-200 hover:bg-gray-800 hover:text-white hover:border-gray-800 dark:hover:bg-gray-300 dark:hover:text-white dark:hover:border-b-gray-50 transition-all duration-300 w-full sm:w-auto">
                <span>Read more</span>
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
          {/* Right - Image (Desktop Only) */}
          <div className="hidden lg:flex relative items-center justify-center order-2 py-8 lg:py-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-[#2196F3]/20 dark:bg-[#2196F3]/20 blur-3xl rounded-full" />
            <div className="relative w-[20rem] xl:w-[20rem] z-10">
              <img
                src="/src/assets/images/thelogogirl.png"
                alt="Student with book"
                className="w-full h-auto drop-shadow-2xl transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
