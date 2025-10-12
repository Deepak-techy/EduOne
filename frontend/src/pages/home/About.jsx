const About = () => {
  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '50+', label: 'AI Features' },
    { number: '98%', label: 'Satisfaction' }
  ];

  const features = [
    {
      title: 'AI-Powered Learning',
      description: 'Advanced AI tools to enhance your study experience'
    },
    {
      title: 'Smart Organization',
      description: 'Keep all your academic materials in one place'
    },
    {
      title: 'Collaborative Platform',
      description: 'Connect and learn with students worldwide'
    },
    {
      title: 'Career Ready',
      description: 'Interview prep and resume building tools'
    }
  ];

  return (
    <section 
      id="about" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-gradient-to-br from-blue-50 to-cyan-50 
        dark:from-gray-900 dark:to-gray-800 
        transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B4965] dark:text-[#2196F3] mb-6">
            ABOUT US
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            EduOne is your all-in-one academic platform, built to help students and teachers manage learning, tasks, and collaboration. With AI-driven tools, EduOne makes studying smarter, organizing easier, and progress more visible.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#2196F3] dark:text-[#3b82f6] mb-2">
                {stat.number}
              </div>
              <div className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-white dark:bg-gray-800 
                shadow-md hover:shadow-xl 
                border-l-4 border-[#2196F3] dark:border-[#3b82f6]
                transition-all duration-300 hover:translate-x-2"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
