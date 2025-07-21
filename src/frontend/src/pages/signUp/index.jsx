import '../../index.css';
import CustomInput from '../../components/input';
import MediaButton from '../../components/mediaButton';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase';
import { signUpUser, authenticateWithFirebase } from '../../services/api';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import fbLogo from '../../assets/fbLogo.png';
import ggLogo from '../../assets/ggLogo.png';

function SignUp() {
    const [formData, setFormData] = useState({ display_name: '', email: '', password: '' });
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '1', month: '1', year: new Date().getFullYear().toString() });
    const [daysInMonth, setDaysInMonth] = useState(31);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        // --- VALIDATION PHÍA FRONTEND ---
        if (!gender) {
            setError('Please select your gender.');
            return;
        }

        setLoading(true);
        try {
            const { day, month, year } = birthDate;
            const dateObject = new Date(year, month - 1, day);
            const finalUserData = { ...formData, gender, dateOfBirth: dateObject.toISOString() };
            await signUpUser(finalUserData);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (providerName) => { /* ... giữ nguyên ... */ };

    return (
        <div className="w-screen flex bg-[#f9f9f2]">
            <div className="w-1/2 h-screen"><img src={accountBanner} alt="Banner" className="h-full w-full object-cover" /></div>
            <div className="w-1/2 max-h-screen overflow-y-auto flex flex-col items-center bg-[#f9f9f2]">
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <div className="h-[20%] w-[70%] flex flex-col justify-center items-center">
                        <img src={logo} className="h-[30%] mb-3" alt="Logo" />
                        <div className="text-lg font-poppins text-2xl">Sign up</div>
                        <div className="loginQues flex flex-row">
                            <div className="pr-[4px] font-poppins">Already have an account?</div>
                            <Link to="/login" className="font-poppins underline">Login</Link>
                        </div>
                    </div>
                    <div className="h-[15%] w-[70%] flex flex-col justify-center items-center gap-2">
                        <MediaButton onClick={() => handleSocialSignIn('facebook')} disabled={loading}><img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-[7px]" />Continue with Facebook</MediaButton>
                        <MediaButton onClick={() => handleSocialSignIn('google')} disabled={loading}><img src={ggLogo} alt="Google" className="h-5 w-5 mr-[7px]" />Continue with Google</MediaButton>
                    </div>
                    <div className="h-[2%] w-[70%] flex items-center justify-center gap-4 mt-3">
                        <hr className="flex-grow border-black opacity-30" /><span className="text-black opacity-30 text-sm">OR</span><hr className="flex-grow border-black opacity-30" />
                    </div>
                    <div className="flex w-[70%] mt-4 flex-col">
                        <CustomInput text="Username*" placeholder="Enter your username" name="display_name" value={formData.display_name} onChange={handleChange} required />
                        <CustomInput text="Email*" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <CustomInput text="Password*" placeholder="Enter your password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                        <div className="mt-2">
                            <label className="text-sm font-poppins block mb-1 text-[#000000]">Gender*</label>
                            <div className="flex gap-6 mb-[1rem]">
                                <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-[#000000]"><input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} required className="w-4 h-4 rounded-full border-2 border-gray-500 bg-[#f9f9f2] accent-black appearance-none checked:appearance-auto" />Male</label>
                                <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-[#000000]"><input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} className="w-4 h-4 rounded-full border-2 border-gray-500 bg-[#f9f9f2] accent-black appearance-none checked:appearance-auto" />Female</label>
                            </div>
                        </div>
                        <div className="text-sm font-poppins mb-1 text-[#000000]">What’s your date of birth?*</div>
                        <div className="flex gap-4">
                            <div className='basis-1/3'><label className="block text-sm font-poppins mb-1 text-[#000000]">Day</label><select name="day" value={birthDate.day} onChange={handleDateChange} className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]" required>{Array.from({ length: daysInMonth }, (_, i) => (<option key={i + 1} value={i + 1} className="bg-white text-black">{i + 1}</option>))}</select></div>
                            <div className='basis-1/3'><label className="block text-sm font-poppins mb-1 text-[#000000]">Month</label><select name="month" value={birthDate.month} onChange={handleDateChange} className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]" required>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (<option key={i + 1} value={i + 1} className="bg-white text-black">{month}</option>))}</select></div>
                            <div className='basis-1/3'><label className="block text-sm font-poppins mb-1 text-[#000000]">Year</label><select name="year" value={birthDate.year} onChange={handleDateChange} className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]" required>{Array.from({ length: 100 }, (_, i) => { const year = new Date().getFullYear() - i; return (<option key={year} value={year} className="bg-white text-black">{year}</option>); })}</select></div>
                        </div>
                    </div>
                    {error && <p className="w-[70%] text-red-500 text-center mt-4">{error}</p>}
                    <div className="w-[70%] text-sm font-poppins text-center text-poppins flex justify-between mt-5 mb-10">By creating an account, you agree to the <span className="underline mx-1 cursor-pointer">Terms of Use</span> and <span className="underline mx-1 cursor-pointer">Privacy Policy.</span></div>
                    <button type="submit" disabled={loading} className="w-[70%] py-3 bg-black text-white font-poppins rounded-lg hover:bg-gray-600 transition-all duration-200 mb-10 disabled:bg-gray-400">{loading ? 'Processing...' : 'Create Account'}</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;