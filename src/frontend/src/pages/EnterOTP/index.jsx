// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import accountBanner from '../../assets/accountBanner.jpg';
// import logo from '../../assets/logo.png';
// import { FiX, FiArrowLeft } from 'react-icons/fi';
// import '../../index.css';

// function EnterOTP() {
//     const [otp, setOtp] = useState(new Array(6).fill(""));
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const navigate = useNavigate();
//     const inputRefs = useRef([]);

//     useEffect(() => {
//         const timer = setTimeout(() => setIsMounted(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     const handleChange = (element, index) => {
//         if (isNaN(element.value)) return false;

//         setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

//         if (element.value !== "" && element.nextSibling) {
//             element.nextSibling.focus();
//         }
//     };

//     const handleKeyDown = (e, index) => {
//         if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
//             e.target.previousSibling.focus();
//         }
//     };

// const handleSubmit = (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     const enteredOtp = otp.join("");
    
//     if (enteredOtp.length < 6) {
//         setError("Please enter a valid 6-digit code.");
//         setLoading(false);
//         return;
//     }


//     setTimeout(() => {
//         setLoading(false);
   
//         navigate('/reset-password');
//     }, 1000);
// };

//     return (
//         <div className="w-screen h-screen flex bg-gray-50">
//             <div className="hidden lg:block w-1/2 h-full">
//                 <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
//             </div>
//             <div
//                 className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white relative transition-all duration-1000 ease-out
//                 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
//             >
//                 <button
//                     onClick={() => navigate('/')}
//                     className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
//                     aria-label="Close"
//                 >
//                     <FiX size={24} />
//                 </button>
//                 <div className="w-full max-w-sm">
//                     <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//                         <div className="text-center mb-4">
//                             <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
//                             <h1 className="text-3xl font-bold text-gray-800 font-poppins">Enter Verification Code</h1>
//                             <p className="text-gray-500 mt-2">
//                                 We've sent a 6-digit code to your email.
//                             </p>
//                         </div>
//                         <div className="flex justify-center gap-2">
//                             {otp.map((data, index) => (
//                                 <input
//                                     ref={el => inputRefs.current[index] = el}
//                                     key={index}
//                                     type="text"
//                                     name="otp"
//                                     className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                     maxLength="1"
//                                     value={data}
//                                     onChange={e => handleChange(e.target, index)}
//                                     onKeyDown={e => handleKeyDown(e, index)}
//                                     onFocus={e => e.target.select()}
//                                 />
//                             ))}
//                         </div>
//                         {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
//                         >
//                             {loading ? 'Verifying...' : 'Verify'}
//                         </button>
//                         <Link
//                             to="/login"
//                             className="flex items-center justify-center gap-2 font-semibold text-blue-600 hover:underline text-sm mt-2"
//                         >
//                             <FiArrowLeft />
//                             Back to log in
//                         </Link>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default EnterOTP;


import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import { FiX, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { verifyOtp, forgotPassword } from '../../services/api';
import '../../index.css';

function EnterOTP() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    // State mới cho bộ đếm ngược
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const email = location.state?.email;

    // Logic cho bộ đếm ngược
    useEffect(() => {
        if (countdown === 0) {
            setCanResend(true);
            return;
        }
        const timerId = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [countdown]);

    useEffect(() => {
        if (!email) {
            console.error("No email provided for OTP verification.");
            navigate('/forgot-password');
        }
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.value !== "" && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        
        setLoading(true);
        try {
            await forgotPassword(email);
            toast.success("A new verification code has been sent.");
            setCanResend(false);
            setCountdown(30);
        } catch (err) {
            toast.error("Failed to resend code. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        
        if (enteredOtp.length < 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await verifyOtp(email, enteredOtp);
            navigate('/reset-password', { 
                state: { otpVerificationToken: response.otpVerificationToken }
            });
        } catch (err) {
            setError(err.message || 'Verification failed. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex bg-gray-50">
            <div className="hidden lg:block w-1/2 h-full">
                <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
            </div>
            <div
                className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white relative transition-all duration-1000 ease-out
                ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all"
                    aria-label="Close"
                >
                    <FiX size={24} />
                </button>
                <div className="w-full max-w-sm">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="text-center mb-4">
                            <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Enter Verification Code</h1>
                            <p className="text-gray-500 mt-2">
                                We've sent a 6-digit code to your email.
                            </p>
                        </div>
                        <div className="flex justify-center gap-2">
                            {otp.map((data, index) => (
                                <input
                                    ref={el => inputRefs.current[index] = el}
                                    key={index}
                                    type="text"
                                    name="otp"
                                    className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                    required
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        
                        <div className="text-center text-sm text-gray-500">
                            Didn't receive the code?{' '}
                            <button 
                                type="button"
                                onClick={handleResendOtp}
                                disabled={!canResend || loading}
                                className="font-semibold text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 font-semibold text-blue-600 hover:underline text-sm mt-2"
                        >
                            <FiArrowLeft />
                            Back to log in
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EnterOTP;