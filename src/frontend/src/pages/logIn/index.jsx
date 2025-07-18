import '../../index.css'
import CustomInput from '../../components/input'
import MediaButton from '../../components/mediaButton';
import { Link } from 'react-router-dom';
function LogIn() {
    return (
        <div className="w-screen flex bg-[#f9f9f2] ">
            {/* Left Side */}
            <div className="w-1/2 h-screen">
                <img
                    src="./src/assets/accountBanner.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Right Side */}
            <div className="w-1/2 max-h-screen overflow-y-auto flex flex-col items-center bg-[#f9f9f2] justify-center">
                <div className="h-[20%] w-[70%] flex flex-col justify-center items-center">
                    <img src="./src/assets/logo.png" className="h-[30%] mb-3" alt="" />
                    <div className="text-lg font-poppins text-2xl">Login</div>
                    <div className="loginQues flex flex-row">
                        <div className="pr-[4px] font-poppins">Doesn't have an account?</div>
                        <Link to="/signup" className="font-poppins underline">
                            Sign up
                        </Link>
                    </div>
                </div>

                {/* Media Buttons */}
                <div className="h-[15%] w-[70%] flex flex-col justify-center items-center gap-2 ">
                    <MediaButton>
                        <img
                            src="./src/assets/fbLogo.png"
                            alt=""
                            className="h-5 w-5 mr-[7px]"
                        />
                        Continue with Facebook
                    </MediaButton>
                    <MediaButton>
                        <img
                            src="./src/assets/ggLogo.png"
                            alt=""
                            className="h-5 w-5 mr-[7px]"
                        />
                        Continue with Google
                    </MediaButton>
                </div>

                {/* OR Divider */}
                <div className="h-[2%] w-[70%] flex items-center justify-center gap-4 mt-3">
                    <hr className="flex-grow border-black opacity-30" />
                    <span className="text-black opacity-30 text-sm">OR</span>
                    <hr className="flex-grow border-black opacity-30" />
                </div>
                {/* Input Fields */}
                <div className="flex w-[70%] mt-4 flex-col">
                    <CustomInput text="Email" placeholder="Enter your email" />
                    <CustomInput
                        text="Password"
                        placeholder="Enter your password"
                        type="password" />
                    <div />
                </div>
                {/*Remember + forget section*/}
                <div className='flex flex-row justify-between items-center w-[70%] mb-10'>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-3 h-3 accent-black"
                        />
                        <label htmlFor="remember" className="text-sm font-poppins text-[#000000]">
                            Remember Me
                        </label>
                    </div>
                    <div>
                        <Link to="/forgot-password" className="font-poppins underline text-sm">Forgot your password</Link>
                    </div>
                </div>
                {/* Create Button */}
                <button className="w-[70%] py-3 bg-black text-white font-poppins rounded-lg hover:bg-gray-600 transition-all duration-200 mb-10">
                    Log in
                </button>
            </div>
        </div>
    );
}
export default LogIn;