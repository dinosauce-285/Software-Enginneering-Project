import '../../index.css';
import CustomInput from '../../components/input';
import MediaButton from '../../components/mediaButton';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase';
import { loginUser, authenticateWithFirebase } from '../../services/api';
import accountBanner from '../../assets/accountBanner.jpg';
import logo from '../../assets/logo.png';
import fbLogo from '../../assets/fbLogo.png';
import ggLogo from '../../assets/ggLogo.png';

function LogIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    // --- THÊM STATE MỚI ---
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- HÀM SUBMIT ĐÃ ĐƯỢỢC CẬP NHẬT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Gói dữ liệu cuối cùng, bao gồm cả rememberMe
            const finalCredentials = {
                ...formData,
                rememberMe: rememberMe,
            };
            await loginUser(finalCredentials); // Gửi đi
            alert('Đăng nhập thành công!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Email hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSocialSignIn = async (providerName) => {
        if (providerName === 'facebook') {
            alert("Chức năng Đăng nhập bằng Facebook đang chờ Meta xác minh.\nVui lòng sử dụng Đăng nhập bằng Google hoặc Email.");
            return;
        }
        const provider = new GoogleAuthProvider();
        setError(null);
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            await authenticateWithFirebase(idToken);
            alert(`Đăng nhập bằng Google thành công!`);
            navigate('/dashboard');
        } catch (err) {
            console.error(`Lỗi đăng nhập Google:`, err);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(`Đã có lỗi xảy ra khi đăng nhập bằng Google.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen flex bg-[#f9f9f2] ">
            <div className="w-1/2 h-screen"><img src={accountBanner} alt="Banner" className="h-full w-full object-cover" /></div>
            <div className="w-1/2 max-h-screen overflow-y-auto flex flex-col items-center bg-[#f9f9f2] justify-center">
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
                    <div className="h-[20%] w-[70%] flex flex-col justify-center items-center">
                        <img src={logo} className="h-[30%] mb-3" alt="Logo" />
                        <div className="text-lg font-poppins text-2xl">Login</div>
                        <div className="loginQues flex flex-row">
                            <div className="pr-[4px] font-poppins">Doesn't have an account?</div>
                            <Link to="/signup" className="font-poppins underline">Sign up</Link>
                        </div>
                    </div>
                    <div className="h-[15%] w-[70%] flex flex-col justify-center items-center gap-2 ">
                        <MediaButton onClick={() => handleSocialSignIn('facebook')} disabled={loading}><img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-[7px]" />Continue with Facebook</MediaButton>
                        <MediaButton onClick={() => handleSocialSignIn('google')} disabled={loading}><img src={ggLogo} alt="Google" className="h-5 w-5 mr-[7px]" />Continue with Google</MediaButton>
                    </div>
                    <div className="h-[2%] w-[70%] flex items-center justify-center gap-4 mt-3">
                        <hr className="flex-grow border-black opacity-30" /><span className="text-black opacity-30 text-sm">OR</span><hr className="flex-grow border-black opacity-30" />
                    </div>
                    <div className="flex w-[70%] mt-4 flex-col">
                        <CustomInput text="Email" placeholder="Enter your email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <CustomInput text="Password" placeholder="Enter your password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    {error && <p className="w-[70%] text-red-500 text-center mt-2">{error}</p>}
                    <div className='flex flex-row justify-between items-center w-[70%] mt-4 mb-10'>
                        <div className="flex items-center gap-2">
                            {/* --- KẾT NỐI CHECKBOX VỚI STATE --- */}
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-3 h-3 accent-black"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember" className="text-sm font-poppins text-[#000000]">
                                Remember Me
                            </label>
                        </div>
                        <div><Link to="/forgot-password" className="font-poppins underline text-sm">Forgot your password</Link></div>
                    </div>
                    <button type="submit" disabled={loading} className="w-[70%] py-3 bg-black text-white font-poppins rounded-lg hover:bg-gray-600 transition-all duration-200 mb-10 disabled:bg-gray-400">{loading ? 'Logging in...' : 'Log in'}</button>
                </form>
            </div>
        </div>
    );
}

export default LogIn;