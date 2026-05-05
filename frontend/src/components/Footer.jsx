import React from 'react';
import { Github, Twitter, Linkedin, Code2, Leaf, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
                CleanPulse
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A premium, full-stack ecosystem connecting citizens and guardians to maintain a pristine environment through AI and real-time reporting.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/vedantxy" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/VedantPate1601" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" title="Twitter / X" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/vedant-patel-3b6a4636a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" title="LinkedIn" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://leetcode.com/u/Vedant_2403/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode Profile" title="LeetCode" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                <Code2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <nav aria-label="Footer Quick Links">
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Home</Link></li>
                <li><Link to="/ecosystem" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Ecosystem</Link></li>
                <li><Link to="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Leaderboard</Link></li>
                <li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" /> Join Movement</Link></li>
              </ul>
            </nav>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Key Features</h3>
            <ul className="space-y-3 text-sm" aria-label="Project Features">
              <li className="text-gray-600 dark:text-gray-400 flex items-start">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                AI Waste Analyzer
              </li>
              <li className="text-gray-600 dark:text-gray-400 flex items-start">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                Real-time Issue Reporting
              </li>
              <li className="text-gray-600 dark:text-gray-400 flex items-start">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                Smart Route Optimization
              </li>
              <li className="text-gray-600 dark:text-gray-400 flex items-start">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                Eco-Credits Gamification
              </li>
              <li className="text-gray-600 dark:text-gray-400 flex items-start">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 mr-2 flex-shrink-0"></div>
                Gemini Eco-Assistant
              </li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Connect</h3>
            <ul className="space-y-4 text-sm" aria-label="Contact Information">
              <li className="flex items-start text-gray-600 dark:text-gray-400">
                <MapPin className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>Planetary Healing HQ<br/>Global Initiative</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <a href="mailto:vedantpatelxy12@gmail.com" className="hover:text-green-500 transition-colors">vedantpatelxy12@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} CleanPulse. All rights reserved. Developed by <a href="https://github.com/vedantxy" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 font-medium transition-colors">Vedant</a>.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
