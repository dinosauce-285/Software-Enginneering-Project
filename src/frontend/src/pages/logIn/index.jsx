// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from '../../firebase';
// import { loginUser, authenticateWithFirebase } from '../../services/api';
// import '../../index.css';

// // Components & Assets
// import CustomInput from '../../components/input';
// import MediaButton from '../../components/mediaButton';
// import accountBanner from '../../assets/accountBanner.jpg';
// import logo from '../../assets/logo.png';
// import fbLogo from '../../assets/fbLogo.png';
// import ggLogo from '../../assets/ggLogo.png';
// import { FiX } from 'react-icons/fi';

// function LogIn() {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [rememberMe, setRememberMe] = useState(false);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const navigate = useNavigate();

//     // Kích hoạt animation khi component được mount
//     useEffect(() => {
//         const timer = setTimeout(() => setIsMounted(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);
//         try {
//             await loginUser({ ...formData, rememberMe });
//             navigate('/dashboard');
//         } catch (err) {
//             setError('Invalid email or password. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const handleSocialSignIn = async (providerName) => {
//         if (providerName === 'facebook') {
//             alert("The Facebook login feature is awaiting verification from Meta.\nPlease use Google or Email to log in.");
//             return;
//         }
//         const provider = new GoogleAuthProvider();
//         setError(null);
//         setLoading(true);
//         try {
//             const result = await signInWithPopup(auth, provider);
//             const idToken = await result.user.getIdToken();
//             await authenticateWithFirebase(idToken);
//             navigate('/dashboard');
//         } catch (err) {
//             console.error(`Google sign-in error:`, err);
//             if (err.code !== 'auth/popup-closed-by-user') {
//                 setError('An error occurred during Google sign-in.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-screen h-screen flex bg-gray-50">
//             {/* Left Panel: Image Banner */}
//             <div className="hidden lg:block w-1/2 h-full">
//                 <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
//             </div>

//             {/* Right Panel: Login Form with Animation */}
//             <div className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white relative transition-all duration-1000 ease-out
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
//                         {/* Header */}
//                         <div className="text-center mb-4">
//                             <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
//                             <h1 className="text-3xl font-bold text-gray-800 font-poppins">Welcome Back!</h1>
//                             <p className="text-gray-500 mt-2">
//                                 Don't have an account?{' '}
//                                 <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
//                             </p>
//                         </div>
                        
//                         {/* Social Logins */}
//                         <div className="flex flex-col gap-3">
//                             <MediaButton 
//                                 onClick={() => handleSocialSignIn('google')} 
//                                 disabled={loading}
//                             >
//                                 <img src={ggLogo} alt="Google" className="h-5 w-5 mr-3" /> Continue with Google
//                             </MediaButton>
//                             <MediaButton 
//                                 onClick={() => handleSocialSignIn('facebook')} 
//                                 disabled={loading}
//                             >
//                                 <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-3" /> Continue with Facebook
//                             </MediaButton>
//                         </div>
                        
//                         {/* Separator */}
//                         <div className="flex items-center gap-4">
//                             <hr className="flex-grow border-gray-200" />
//                             <span className="text-gray-400 text-xs font-semibold">OR</span>
//                             <hr className="flex-grow border-gray-200" />
//                         </div>
                        
//                         {/* Email & Password Inputs */}
//                         <div className="flex flex-col gap-4">
//                             <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
//                             <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
//                         </div>

//                         {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        
//                         {/* Remember Me & Forgot Password */}
//                         <div className='flex justify-between items-center w-full text-sm'>
//                             <div className="flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     id="remember"
//                                     className="w-4 h-4 accent-gray-800 rounded"
//                                     checked={rememberMe}
//                                     onChange={(e) => setRememberMe(e.target.checked)}
//                                 />
//                                 <label htmlFor="remember" className="text-gray-600 cursor-pointer">
//                                     Remember Me
//                                 </label>
//                             </div>
//                             <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Forgot password?</Link>
//                         </div>
                        
//                         {/* Submit Button */}
//                         <button 
//                             type="submit" 
//                             disabled={loading} 
//                             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
//                         >
//                             {loading ? 'Logging in...' : 'Log In'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LogIn;
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from '../../firebase';
// import { loginUser, authenticateWithFirebase } from '../../services/api';
// import '../../index.css';

// // Components & Assets
// import CustomInput from '../../components/CustomInput';
// import MediaButton from '../../components/mediaButton';
// import accountBanner from '../../assets/accountBanner.jpg';
// import logo from '../../assets/logo.png';
// import fbLogo from '../../assets/fbLogo.png';
// import ggLogo from '../../assets/ggLogo.png';
// import { FiX } from 'react-icons/fi';

// function LogIn() {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [rememberMe, setRememberMe] = useState(false);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const navigate = useNavigate();

//     // Kích hoạt animation khi component được mount
//     useEffect(() => {
//         const timer = setTimeout(() => setIsMounted(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);
//         try {
//             await loginUser({ ...formData, rememberMe });
//             navigate('/dashboard');
//         } catch (err) {
//             setError('Invalid email or password. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const handleSocialSignIn = async (providerName) => {
//         if (providerName === 'facebook') {
//             alert("The Facebook login feature is awaiting verification from Meta.\nPlease use Google or Email to log in.");
//             return;
//         }
//         const provider = new GoogleAuthProvider();
//         setError(null);
//         setLoading(true);
//         try {
//             const result = await signInWithPopup(auth, provider);
//             const idToken = await result.user.getIdToken();
//             await authenticateWithFirebase(idToken);
//             navigate('/dashboard');
//         } catch (err) {
//             console.error(`Google sign-in error:`, err);
//             if (err.code !== 'auth/popup-closed-by-user') {
//                 setError('An error occurred during Google sign-in.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-screen h-screen flex bg-gray-50">
//             {/* Left Panel: Image Banner */}
//             <div className="hidden lg:block w-1/2 h-full">
//                 <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
//             </div>

//             {/* Right Panel: Login Form with Animation */}
//             <div className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white relative transition-all duration-1000 ease-out
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
//                         {/* Header */}
//                         <div className="text-center mb-4">
//                             <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
//                             <h1 className="text-3xl font-bold text-gray-800 font-poppins">Welcome Back!</h1>
//                             <p className="text-gray-500 mt-2">
//                                 Don't have an account?{' '}
//                                 <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
//                             </p>
//                         </div>
                        
//                         {/* Social Logins */}
//                         <div className="flex flex-col gap-3">
//                             <MediaButton 
//                                 onClick={() => handleSocialSignIn('google')} 
//                                 disabled={loading}
//                             >
//                                 <img src={ggLogo} alt="Google" className="h-5 w-5 mr-3" /> Continue with Google
//                             </MediaButton>
//                             <MediaButton 
//                                 onClick={() => handleSocialSignIn('facebook')} 
//                                 disabled={loading}
//                             >
//                                 <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-3" /> Continue with Facebook
//                             </MediaButton>
//                         </div>
                        
//                         {/* Separator */}
//                         <div className="flex items-center gap-4">
//                             <hr className="flex-grow border-gray-200" />
//                             <span className="text-gray-400 text-xs font-semibold">OR</span>
//                             <hr className="flex-grow border-gray-200" />
//                         </div>
                        
//                         {/* Email & Password Inputs */}
//                         <div className="flex flex-col gap-4">
//                             <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
//                             <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
//                         </div>

//                         {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        
//                         {/* Remember Me & Forgot Password */}
//                         <div className='flex justify-between items-center w-full text-sm'>
//                             <div className="flex items-center gap-2">
//                                 <input
//                                     type="checkbox"
//                                     id="remember"
//                                     className="w-4 h-4 accent-gray-800 rounded"
//                                     checked={rememberMe}
//                                     onChange={(e) => setRememberMe(e.target.checked)}
//                                 />
//                                 <label htmlFor="remember" className="text-gray-600 cursor-pointer">
//                                     Remember Me
//                                 </label>
//                             </div>
//                             <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Forgot password?</Link>
//                         </div>
                        
//                         {/* Submit Button */}
//                         <button 
//                             type="submit" 
//                             disabled={loading} 
//                             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
//                         >
//                             {loading ? 'Logging in...' : 'Log In'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LogIn;



import '../../index.css';
// --- SỬA LẠI CÁC ĐƯỜNG DẪN IMPORT TẠI ĐÂY ---
import CustomInput from '../../components/CustomInput'; // Sửa từ ../components/input
import MediaButton from '../../components/mediaButton';   // Sửa từ ../components/mediaButton
// ---------------------------------------------
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase';
import { loginUser, authenticateWithFirebase } from '../../services/api';

// Import assets
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import fbLogo from '../../assets/fbLogo.png';
import ggLogo from '../../assets/ggLogo.png';
import { FiX } from 'react-icons/fi';

function LogIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await loginUser({ ...formData, rememberMe });
            if (response.user.role === 'ADMIN') {
                navigate('/user-management');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSocialSignIn = async (providerName) => {
        if (providerName === 'facebook') {
            alert("The Facebook login feature is awaiting verification from Meta.\nPlease use Google or Email to log in.");
            return;
        }
        const provider = new GoogleAuthProvider();
        setError(null);
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const response = await authenticateWithFirebase(idToken);
            if (response.user.role === 'ADMIN') {
                navigate('/user-management');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(`Google sign-in error:`, err);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('An error occurred during Google sign-in.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex bg-gray-50">
            {/* Left Panel: Image Banner */}
            <div className="hidden lg:block w-1/2 h-full">
                <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
            </div>

            {/* Right Panel: Login Form with Animation */}
            <div className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white relative transition-all duration-1000 ease-out
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
                        {/* Header */}
                        <div className="text-center mb-4">
                            <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Welcome Back!</h1>
                            <p className="text-gray-500 mt-2">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
                            </p>
                        </div>
                        
                        {/* Social Logins */}
                        <div className="flex flex-col gap-3">
                            <MediaButton 
                                onClick={() => handleSocialSignIn('google')} 
                                disabled={loading}
                            >
                                <img src={ggLogo} alt="Google" className="h-5 w-5 mr-3" /> Continue with Google
                            </MediaButton>
                            <MediaButton 
                                onClick={() => handleSocialSignIn('facebook')} 
                                disabled={loading}
                            >
                                <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-3" /> Continue with Facebook
                            </MediaButton>
                        </div>
                        
                        {/* Separator */}
                        <div className="flex items-center gap-4">
                            <hr className="flex-grow border-gray-200" />
                            <span className="text-gray-400 text-xs font-semibold">OR</span>
                            <hr className="flex-grow border-gray-200" />
                        </div>
                        
                        {/* Email & Password Inputs */}
                        <div className="flex flex-col gap-4">
                            <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        
                        {/* Remember Me & Forgot Password */}
                        <div className='flex justify-between items-center w-full text-sm'>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 accent-gray-800 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                                    Remember Me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Forgot password?</Link>
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LogIn;