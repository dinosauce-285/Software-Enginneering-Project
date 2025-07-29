import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import { FiX } from 'react-icons/fi';
import CustomInput from '../../components/CustomInput';
import '../../index.css';

function ResetPassword() {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please try again.');
            return;
        }
        
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            alert("Password has been reset successfully!");
            navigate('/login');
        }, 1500);
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
                            <h1 className="text-3xl font-bold text-gray-800 font-poppins">Create New Password</h1>
                            <p className="text-gray-500 mt-2">
                                Your new password must be different from previous ones.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <CustomInput text="New Password" placeholder="Enter your new password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                            <CustomInput text="Confirm Password" placeholder="Confirm your new password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center -my-2">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;