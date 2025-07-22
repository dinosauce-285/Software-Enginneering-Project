import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import logo from '../../assets/logo.png';
import landingBanner from '../../assets/landingBanner.png';

export default function LandingPage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra localStorage khi component được render
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (

    <div className="min-h-screen w-full bg-white font-poppins text-gray-800">
      <div className="w-full max-w-7xl mx-auto px-8 py-6 flex flex-col">
        {/* Top bar (Header) */}
        <header className="flex justify-between items-center w-full py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SoulNote Logo" className="h-10" />
            <span className="text-2xl font-semibold">SoulNote</span>
          </div>
          <nav className="flex items-center gap-6 text-base font-medium">
            {/* --- LOGIC MỚI CHO HEADER --- */}
            {isLoggedIn ? (
              // Nếu đã đăng nhập, hiển thị nút Dashboard
              <Link to="/dashboard" className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              // Nếu chưa đăng nhập, hiển thị Login và Sign Up
              <>
                <Link to="/login" className="hover:text-black transition-colors">Login</Link>
                <Link to="/signup" className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col justify-center items-center my-20">

            {/* Banner */}
            <section className="text-center mb-16">
              <h1 className="text-6xl font-bold tracking-tight">
                Capture your memories.
              </h1>
              <h2 className="text-6xl font-bold tracking-tight mt-2">
                Feel them again.
              </h2>
              <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
                A private diary to store your photos, voice and feelings – beautifully.
              </p>
              
    
              <Link to="/signup" className="inline-block bg-black text-white px-8 py-3 mt-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Get Started
              </Link>

            </section>

            {/* Memory Preview */}
            <section className="w-full max-w-5xl mx-auto bg-[#F9F9F2] p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                
                {/* text column */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-center gap-4 text-sm font-medium text-gray-700">
                    <span>04/02/2025</span>
                    <span>Ho Chi Minh City</span>
                    <span className="text-blue-600">#life #city</span>
                    <span>Happy</span>
                  </div>
               
                  <p className="text-base leading-relaxed text-justify">
                    The afternoon sun cast long, languid shadows across the cobblestones, and I found myself on a familiar path, one I hadn't walked in years. Every corner held a whisper of the past—a faint echo of forgotten laughter, a ghost of a shared conversation. It's strange how places can hold onto memories, keeping them safe until you return to unlock them. I sat on the old park bench, its wood worn smooth by time and countless others, and simply let the feelings wash over me. It wasn't sadness, but a sweet, profound sense of connection to the person I used to be. The world kept moving, but for a little while, my world stood perfectly still.
                  </p>
                </div>
                
                {/* Cột ảnh */}
                <div className="w-full md:w-1/2">
                  <img 
                    src={landingBanner} 
                    alt="A black and white preview of a memory"
                    className="w-full h-auto object-cover rounded-lg shadow-md" 
                  />
                </div>

              </div>
            </section>
        </div>

        {/* Footer */}
        <footer className="w-full mt-auto pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex gap-6">
                    <a href="#" className="hover:text-black">About</a>
                    <a href="#" className="hover:text-black">Contact</a>
                    <a href="#" className="hover:text-black">Terms</a>
                </div>
                <div>
                    © {new Date().getFullYear()} SoulNote
                </div>
            </div>
        </footer>

      </div>
    </div>
  );
}