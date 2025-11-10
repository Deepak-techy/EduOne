// src/pages/help/HelpSupport.jsx

import { useState } from 'react';
import { ArrowLeft, ChevronDown, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer:
        'Visit the Sign Up page and fill in your details including email, username, and password. Verify your email and you\'re all set!',
    },
    {
      id: 2,
      question: 'How can I update my profile?',
      answer:
        'Click on your avatar in the navbar, select "Edit Profile", and update your information including avatar, username, and email.',
    },
    {
      id: 3,
      question: 'How does PDF Q&A work?',
      answer:
        'Upload a PDF document OR select subjects, ask questions about its content, and our AI will provide answers based on the document text.',
    },
    {
      id: 4,
      question: 'Can I export my notes?',
      answer:
        'NO! But Your notes can be saved in our Notes Organizer Libary.',
    },
    {
      id: 5,
      question: 'How do I reset my password?',
      answer:
        'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email.',
    },
    {
      id: 6,
      question: 'Is my data secure?',
      answer:
        'We use industry-standard encryption and security protocols to protect your data. Your information is never shared with third parties.',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1a1b1e] dark:to-[#23272f] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <button
          // onClick={() => navigate(-1)}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home </span>
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Find answers to common questions and get support
        </p>

        {/* Support Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Documentation */}
          <div className="bg-white dark:bg-[#23272f] rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Read our comprehensive guides and tutorials
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 transition font-medium"
            >
              View Docs <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Support */}
          <div className="bg-white dark:bg-[#23272f] rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Email our support team for personalized help
            </p>
            <a
              href="mailto:support@eduone.com?subject=Support Request&body=Hi Support Team,%0A%0AI need help with..."
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:opacity-80 transition font-medium"
            >
              Email Support <ExternalLink className="w-4 h-4" />
            </a>

          </div>

          {/* Community */}
          <div className="bg-white dark:bg-[#23272f] rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connect with other users and share knowledge
            </p>
            <a
              href="#community"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:opacity-80 transition font-medium"
            >
              Join Community <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map(faq => (
              <div
                key={faq.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2d3748] hover:bg-gray-100 dark:hover:bg-[#32404e] transition text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFaq === faq.id && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23272f]">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
          <p className="mb-6 opacity-90">
            Can't find what you're looking for? Get in touch with our support team.
          </p>
          <a
            href="mailto:support@eduone.com"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
