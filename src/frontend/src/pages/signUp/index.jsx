// // src/pages/signUp/index.jsx

// import '../../index.css';
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from '../../firebase';
// import { signUpUser, authenticateWithFirebase } from '../../services/api';

// // Components & Assets
// import CustomInput from '../../components/CustomInput';
// import MediaButton from '../../components/mediaButton';
// import CustomSelect from '../../components/CustomSelect';
// import accountBanner from '../../assets/accountBanner.jpg';
// import logo from '../../assets/logo.png';
// import fbLogo from '../../assets/fbLogo.png';
// import ggLogo from '../../assets/ggLogo.png';
// import { FiX } from 'react-icons/fi';

// function SignUp() {
//     const [formData, setFormData] = useState({ display_name: '', email: '', password: '' });
//     const [gender, setGender] = useState('');
//     const [birthDate, setBirthDate] = useState({ day: '1', month: '1', year: (new Date().getFullYear() - 18).toString() });
//     const [daysInMonth, setDaysInMonth] = useState(31);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const timer = setTimeout(() => setIsMounted(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     useEffect(() => {
//         const year = parseInt(birthDate.year, 10);
//         const month = parseInt(birthDate.month, 10);
//         const newDaysInMonth = new Date(year, month, 0).getDate();
//         setDaysInMonth(newDaysInMonth);
//         if (parseInt(birthDate.day, 10) > newDaysInMonth) {
//             setBirthDate(prev => ({ ...prev, day: '1' }));
//         }
//     }, [birthDate.month, birthDate.year]);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//     const handleDateChange = (e) => setBirthDate({ ...birthDate, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         if (!gender) {
//             setError('Please select your gender.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const { day, month, year } = birthDate;
//             const dateObject = new Date(Date.UTC(year, month - 1, day));
//             const finalUserData = { ...formData, gender, dateOfBirth: dateObject.toISOString() };
//             await signUpUser(finalUserData);
//             navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
//         } catch (err) {
//             setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
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
//             <div className="hidden lg:block w-1/2 h-full">
//                 <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
//             </div>

//             <div className={`w-full lg:w-1/2 h-full flex flex-col items-center pt-16 pb-8 px-8 bg-white relative transition-all duration-1000 ease-out overflow-y-auto
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
//                     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                         <div className="text-center mb-4">
//                             <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
//                             <h1 className="text-3xl font-bold text-gray-800 font-poppins">Create an Account</h1>
//                             <p className="text-gray-500 mt-2">
//                                 Already have an account?{' '}
//                                 <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link>
//                             </p>
//                         </div>
                        
//                         <div className="flex flex-col gap-3">
//                             <MediaButton onClick={() => handleSocialSignIn('google')} disabled={loading}>
//                                 <img src={ggLogo} alt="Google" className="h-5 w-5 mr-3" /> Continue with Google
//                             </MediaButton>
//                             <MediaButton onClick={() => handleSocialSignIn('facebook')} disabled={loading}>
//                                 <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-3" /> Continue with Facebook
//                             </MediaButton>
//                         </div>
                        
//                         <div className="flex items-center gap-4">
//                             <hr className="flex-grow border-gray-200" />
//                             <span className="text-gray-400 text-xs font-semibold">OR</span>
//                             <hr className="flex-grow border-gray-200" />
//                         </div>
                        
//                         <CustomInput text="Username" placeholder="Enter your username" name="display_name" value={formData.display_name} onChange={handleChange} required />
//                         <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
//                         <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                        
//                         <div>
//                             <label className="text-sm font-poppins block mb-2 text-gray-700">Gender<span className="text-red-500 ml-1">*</span></label>
//                             <div className="flex gap-6">
//                                 <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-gray-700"><input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} required className="w-4 h-4 accent-gray-800" />Male</label>
//                                 <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-gray-700"><input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} className="w-4 h-4 accent-gray-800" />Female</label>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="text-sm font-poppins mb-2 block text-gray-700">Date of Birth<span className="text-red-500 ml-1">*</span></label>
//                             <div className="flex gap-2">
//                                 <CustomSelect label="Day" name="day" value={birthDate.day} onChange={handleDateChange} required>
//                                     {Array.from({ length: daysInMonth }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
//                                 </CustomSelect>
//                                 <CustomSelect label="Month" name="month" value={birthDate.month} onChange={handleDateChange} required>
//                                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (<option key={i + 1} value={i + 1}>{month}</option>))}
//                                 </CustomSelect>
//                                 <CustomSelect label="Year" name="year" value={birthDate.year} onChange={handleDateChange} required>
//                                     {Array.from({ length: 80 }, (_, i) => { const year = new Date().getFullYear() - 18 - i; return (<option key={year} value={year}>{year}</option>); })}
//                                 </CustomSelect>
//                             </div>
//                         </div>
                        
//                         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        
        
//                         <p className="text-xs text-center text-gray-500 whitespace-nowrap">
//                             By creating an account, you agree to our{' '}
//                             <Link to="/terms" className="font-semibold text-blue-600 hover:underline">Terms of Use</Link>
//                             {' and '}
//                             <Link to="/privacy" className="font-semibold text-blue-600 hover:underline">Privacy Policy</Link>.
//                         </p>

//                         <button 
//                             type="submit" 
//                             disabled={loading} 
//                             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
//                         >
//                             {loading ? 'Creating Account...' : 'Create Account'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignUp;
// src/pages/signUp/index.jsx

import '../../index.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase';
import { signUpUser, authenticateWithFirebase } from '../../services/api';

// Components & Assets
import CustomInput from '../../components/CustomInput';
import MediaButton from '../../components/mediaButton';
import CustomSelect from '../../components/CustomSelect';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import fbLogo from '../../assets/fbLogo.png';
import ggLogo from '../../assets/ggLogo.png';
import { FiX } from 'react-icons/fi';

function SignUp() {
    const [formData, setFormData] = useState({ display_name: '', email: '', password: '' });
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '1', month: '1', year: (new Date().getFullYear() - 18).toString() });
    const [daysInMonth, setDaysInMonth] = useState(31);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const year = parseInt(birthDate.year, 10);
        const month = parseInt(birthDate.month, 10);
        const newDaysInMonth = new Date(year, month, 0).getDate();
        setDaysInMonth(newDaysInMonth);
        if (parseInt(birthDate.day, 10) > newDaysInMonth) {
            setBirthDate(prev => ({ ...prev, day: '1' }));
        }
    }, [birthDate.month, birthDate.year]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleDateChange = (e) => setBirthDate({ ...birthDate, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!gender) {
            setError('Please select your gender.');
            return;
        }
        setLoading(true);
        try {
            const { day, month, year } = birthDate;
            const dateObject = new Date(Date.UTC(year, month - 1, day));
            const finalUserData = { ...formData, gender, dateOfBirth: dateObject.toISOString() };
            await signUpUser(finalUserData);
            navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
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
            await authenticateWithFirebase(idToken);
            navigate('/dashboard');
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
            <div className="hidden lg:block w-1/2 h-full">
                <img src={accountBanner} alt="Banner" className="h-full w-full object-cover" />
            </div>

            <div className={`w-full lg:w-1/2 h-full flex flex-col items-center pt-16 pb-8 px-8 bg-white relative transition-all duration-1000 ease-out overflow-y-auto
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="text-center mb-4">
                            <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Create an Account</h1>
                            <p className="text-gray-500 mt-2">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link>
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <MediaButton onClick={() => handleSocialSignIn('google')} disabled={loading}>
                                <img src={ggLogo} alt="Google" className="h-5 w-5 mr-3" /> Continue with Google
                            </MediaButton>
                            <MediaButton onClick={() => handleSocialSignIn('facebook')} disabled={loading}>
                                <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-3" /> Continue with Facebook
                            </MediaButton>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <hr className="flex-grow border-gray-200" />
                            <span className="text-gray-400 text-xs font-semibold">OR</span>
                            <hr className="flex-grow border-gray-200" />
                        </div>
                        
                        <CustomInput text="Username" placeholder="Enter your username" name="display_name" value={formData.display_name} onChange={handleChange} required />
                        <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                        
                        <div>
                            <label className="text-sm font-poppins block mb-2 text-gray-700">Gender<span className="text-red-500 ml-1">*</span></label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-gray-700"><input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} required className="w-4 h-4 accent-gray-800" />Male</label>
                                <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-gray-700"><input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} className="w-4 h-4 accent-gray-800" />Female</label>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-poppins mb-2 block text-gray-700">Date of Birth<span className="text-red-500 ml-1">*</span></label>
                            <div className="flex gap-2">
                                <CustomSelect label="Day" name="day" value={birthDate.day} onChange={handleDateChange} required>
                                    {Array.from({ length: daysInMonth }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                                </CustomSelect>
                                <CustomSelect label="Month" name="month" value={birthDate.month} onChange={handleDateChange} required>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (<option key={i + 1} value={i + 1}>{month}</option>))}
                                </CustomSelect>
                                <CustomSelect label="Year" name="year" value={birthDate.year} onChange={handleDateChange} required>
                                    {Array.from({ length: 80 }, (_, i) => { const year = new Date().getFullYear() - 18 - i; return (<option key={year} value={year}>{year}</option>); })}
                                </CustomSelect>
                            </div>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        
        
                        <p className="text-xs text-center text-gray-500 whitespace-nowrap">
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" className="font-semibold text-blue-600 hover:underline">Terms of Use</Link>
                            {' and '}
                            <Link to="/privacy" className="font-semibold text-blue-600 hover:underline">Privacy Policy</Link>.
                        </p>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;