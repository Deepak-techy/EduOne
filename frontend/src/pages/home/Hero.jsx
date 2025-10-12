import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="flex items-center bg-[#E8F4F8] dark:bg-[#1a1b1e] py-16 md:py-20 lg:py-24 px-6 md:px-10 lg:px-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-7 animate-fade-in order-2 lg:order-1">
            <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold leading-tight text-black dark:text-white transition-colors">
              Your All-in-One<br />
              Academic Companion
            </h1>
            
            <p className="text-base md:text-[17px] text-gray-700 dark:text-gray-400 leading-relaxed transition-colors mt-6">
              "A comprehensive web platform to support students and faculty with AI-powered academic assistance."
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-6">
              <button className="px-8 md:px-9 py-3 md:py-3.5 rounded-full text-sm md:text-[15px] font-semibold text-white bg-[#2196F3] hover:bg-[#35e09c] shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                Get Started
              </button>
              
              <button className="flex items-center justify-center gap-2.5 px-6 md:px-7 py-3 md:py-3 rounded-full text-sm md:text-[15px] font-medium border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-full sm:w-auto">
                <span>Read more</span>
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Right - Girl Illustration with 3D Effect */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 py-8 lg:py-0">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-900 transition-colors duration-300 shadow-2xl" />
            </div>
            
            {/* Girl Image - BIG with 3D Pop */}
            <div className="relative z-10 w-full scale-125 sm:scale-150 md:scale-[1.6] lg:scale-[1.7] xl:scale-[1.8] transform-gpu">
              <img 
                src="/src/assets/images/thelogogirl.png"
                alt="Student with book" 
                className="w-full h-auto drop-shadow-2xl transition-all duration-500 hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.2))'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
