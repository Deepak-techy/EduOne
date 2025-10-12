import { useState } from 'react';
import { Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section 
      id="contact" 
      className="py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 
        bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 
        dark:from-[#1a1b1e] dark:via-[#25262b] dark:to-[#1a1b1e]
        transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* LEFT - Illustration & Text */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-[#1B4965] dark:text-white">Get in </span>
                <span className="text-[#2196F3] dark:text-[#4a9eff]">touch</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400">
                Reach out, and let's create a universe of possibilities together!
              </p>
            </div>

            {/* Handshake Image Placeholder - DARK */}
            <div className="relative">
              <div className="w-full h-64 md:h-80 rounded-3xl 
                bg-gradient-to-br from-blue-100 to-purple-100 
                dark:bg-gradient-to-br dark:from-[#2d2e33] dark:to-[#1a1b1e]
                flex items-center justify-center overflow-hidden
                border border-transparent dark:border-gray-800
                transition-all duration-300">
                <div className="text-center p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Let's connect !!
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
                    Let's align our connection! Reach out and let the magic of collaboration illuminate our skies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Contact Form */}
          <div className="bg-white dark:bg-[#25262b] rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-800 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Value"
                  required
                  className="w-full px-4 py-3 rounded-lg 
                    bg-gray-50 dark:bg-[#1a1b1e]
                    border border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#2196F3] dark:focus:ring-[#4a9eff]
                    transition-all duration-200"
                />
              </div>

              {/* Surname Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surname
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Value"
                  required
                  className="w-full px-4 py-3 rounded-lg 
                    bg-gray-50 dark:bg-[#1a1b1e]
                    border border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#2196F3] dark:focus:ring-[#4a9eff]
                    transition-all duration-200"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Value"
                  required
                  className="w-full px-4 py-3 rounded-lg 
                    bg-gray-50 dark:bg-[#1a1b1e]
                    border border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#2196F3] dark:focus:ring-[#4a9eff]
                    transition-all duration-200"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Value"
                  rows="4"
                  required
                  className="w-full px-4 py-3 rounded-lg 
                    bg-gray-50 dark:bg-[#1a1b1e]
                    border border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-white 
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-[#2196F3] dark:focus:ring-[#4a9eff]
                    transition-all duration-200
                    resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-lg 
                  bg-gray-900 dark:bg-[#2d2e33]
                  hover:bg-gray-800 dark:hover:bg-[#3d3e43]
                  text-white font-semibold text-base
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  shadow-md hover:shadow-lg"
              >
                <span>Submit</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
