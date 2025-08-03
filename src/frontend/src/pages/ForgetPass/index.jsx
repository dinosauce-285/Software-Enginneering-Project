// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import accountBanner from '../../assets/accountBanner.jpg';
// import logo from '../../assets/logo.png';
// import { FiX, FiArrowLeft } from 'react-icons/fi';
// import CustomInput from '../../components/CustomInput';


// import '../../index.css';

// function ForgetPass() {

//     const [email, setEmail] = useState('');
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const navigate = useNavigate();
//     useEffect(() => {
//         const timer = setTimeout(() => setIsMounted(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
    

    
//     setTimeout(() => {
//         setLoading(false);

//         navigate('/enter-otp'); 
//     }, 1000);
// };

//     return (

//         <div className="w-screen h-screen flex bg-gray-50">
  
//             <div className="hidden lg:block w-1/2 h-full">
//                 <img
//                     src={accountBanner}
//                     alt="Banner"
//                     className="h-full w-full object-cover"
//                 />
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
//                             <h1 className="text-3xl font-bold text-gray-800 font-poppins">Forgot Password?</h1>
//                             <p className="text-gray-500 mt-2">
//                                 No worries, we'll send you reset instructions.
//                             </p>
//                         </div>

//                         <div className="flex flex-col gap-4">
//                             <CustomInput
//                                 text="Email"
//                                 placeholder="Enter your email"
//                                 name="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>

  
//                         {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
//                         >
//                             {loading ? 'Sending...' : 'Send Instructions'}
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

// export default ForgetPass;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import { FiX, FiArrowLeft } from 'react-icons/fi';
import CustomInput from '../../components/CustomInput';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../services/api'; // Import API
import '../../index.css';

function ForgetPass() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await forgotPassword(email);
            toast.success(response.message || "Reset instructions sent to your email!");
            // Chuyển trang và mang theo email
            navigate('/enter-otp', { state: { email: email } });
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex bg-gray-50">
            <div className="hidden lg:block w-1/2 h-full"><img src={accountBanner} alt="Banner" className="h-full w-full object-cover" /></div>
            <div className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-white ...`}>
                <button onClick={() => navigate('/')} className="absolute top-6 right-6 ..."><FiX size={24} /></button>
                <div className="w-full max-w-sm">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="text-center mb-4">
                            <img src={logo} className="h-12 mx-auto mb-4" alt="Logo" />
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Forgot Password?</h1>
                            <p className="text-gray-500 mt-2">No worries, we'll send you reset instructions.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full py-3 bg-gray-900 ...">{loading ? 'Sending...' : 'Send Instructions'}</button>
                        <Link to="/login" className="flex items-center justify-center ..."><FiArrowLeft /> Back to log in</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgetPass;