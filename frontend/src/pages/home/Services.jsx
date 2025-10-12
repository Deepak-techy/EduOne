import { FileText, BookOpen, Users, Mic, Calendar, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: 'PDF Q&A',
      description: 'Ask questions from your PDFs instantly with AI'
    },
    {
      icon: BookOpen,
      title: 'Note Organizer',
      description: 'Organize and manage your study notes efficiently'
    },
    {
      icon: Calendar,
      title: 'Academic Planner',
      description: 'Plan your academic schedule and deadlines'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with students and share knowledge'
    },
    {
      icon: Mic,
      title: 'Interview AI',
      description: 'Practice interviews with AI-powered feedback'
    },
    {
      icon: Shield,
      title: 'Resume',
      description: 'Build professional resumes with AI assistance'
    }
  ];

  return (
    <section 
      id="services" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-white dark:bg-[#1a1b1e]
        transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B4965] dark:text-[#2196F3] mb-4">
            EXPLORE
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B4965] dark:text-[#2196F3]">
            EDUONE SERVICES
          </h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative 
                  bg-gradient-to-br from-gray-100 to-gray-200 
                  dark:from-[#25262b] dark:to-[#1a1b1e]
                  rounded-3xl p-8 md:p-10 
                  hover:shadow-2xl hover:scale-105 
                  dark:hover:shadow-blue-500/20
                  transition-all duration-300 
                  border border-gray-300 dark:border-gray-800
                  cursor-pointer"
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl 
                    bg-white dark:bg-[#2d2e33]
                    flex items-center justify-center 
                    shadow-lg group-hover:shadow-xl 
                    dark:group-hover:shadow-blue-500/30
                    transition-all duration-300
                    border border-gray-200 dark:border-gray-700">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#2196F3] dark:text-[#4a9eff]" />
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h4>

                {/* Description */}
                <p className="text-sm md:text-base text-center text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent 
                  group-hover:border-[#2196F3] dark:group-hover:border-[#4a9eff] 
                  transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
