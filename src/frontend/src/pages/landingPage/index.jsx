import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiTag, FiSmile } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import landingBanner from '../../assets/landingBanner.png';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen w-full bg-white font-poppins text-slate-800 overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="SoulNote Logo" className="h-9" />
              <span className="text-2xl font-semibold text-slate-900">SoulNote</span>
            </Link>
            <nav className="flex items-center gap-6 text-base font-medium">
              {isLoggedIn ? (
                <Link to="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors duration-300">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
                  <Link to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors duration-300">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.section
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Capture your memories.
          </h1>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mt-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Feel them again.
          </h2>
          <p className="text-lg text-slate-600 mt-6 max-w-3xl mx-auto">
            A private digital diary to store your photos, voice notes, and feelings – beautifully organized and forever yours.
          </p>
          <Link to="/signup" className="inline-block bg-slate-900 text-white px-10 py-4 mt-10 rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Started
          </Link>
        </motion.section>

        <motion.section
          className="w-full max-w-5xl mx-auto mt-24 sm:mt-32 bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-start sm:justify-between gap-x-6 gap-y-4 text-sm text-slate-600">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <FiCalendar /> 04 Feb 2025
                </span>
                
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <FiMapPin /> Ho Chi Minh City
                </span>
                <span className="flex items-start gap-2 text-blue-600">
                  <FiTag className="mt-0.5" />
                  <div>
                    <div>#life</div>
                  </div>
                </span>

                <span className="flex items-center gap-2 whitespace-nowrap">
                  <FiSmile /> Happy
                </span>

              </div>
              <p className="text-base leading-relaxed text-slate-700 text-justify">
                The afternoon sun cast long, languid shadows across the cobblestones, and I found myself on a familiar path, one I hadn't walked in years. Every corner held a whisper of the past—a faint echo of forgotten laughter, a ghost of a shared conversation. It's strange how places can hold onto memories, keeping them safe until you return to unlock them. I sat on the old park bench, its wood worn smooth by time and countless others, and simply let the feelings wash over me. It wasn't sadness, but a sweet, profound sense of connection to the person I used to be. The world kept moving, but for a little while, my world stood perfectly still.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <img 
                src={landingBanner} 
                alt="A black and white preview of a memory"
                className="w-full h-auto object-cover rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="w-full border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="SoulNote Logo" className="h-6 opacity-70" />
                    <span>© {new Date().getFullYear()} SoulNote. All Rights Reserved.</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-900 transition-colors">About</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>
    </div>
  );
}