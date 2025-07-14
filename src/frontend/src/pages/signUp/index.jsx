import '../../index.css'
import CustomInput from '../../components/input'
import MediaButton from '../../components/mediaButton';
import { Link } from 'react-router-dom';

function SignUp() {
    return ( 
        
        <div className="h-screen w-screen flex bg-[#f9f9f2]">
            {/* Left Side */}
            <div className="w-1/2 h-full">
                <img src="./src/assets/accountBanner.jpg" alt="" className="h-full w-full object-cover" />
            </div>

            {/* Right Side */}
            <div className="w-1/2 h-full flex flex-col items-center">
                {/* Top Section */}
                <div className="h-[20%] w-[70%] flex flex-col justify-center items-center">
                    <img src="./src/assets/logo.png" className="h-[30%]" alt="" />
                    <div className="text-lg font-inter">Sign up</div>
                    <div className="loginQues flex flex-row">
                        <div className="pr-[4px] font-inter">Already have an account?</div>
                        <Link to="/login" className="font-inter underline">Login</Link>
                    </div>
                </div>

                {/* Media Buttons */}
                <div className="h-[15%] w-[70%] flex flex-col justify-center items-center gap-2">
                    <MediaButton>
                        <img src="./src/assets/fbLogo.png" alt="" className="h-5 w-5 mr-[7px]" />
                        Continue with Facebook
                    </MediaButton>
                    <MediaButton>
                        <img src="./src/assets/ggLogo.png" alt="" className="h-5 w-5 mr-[7px]" />
                        Continue with Google
                    </MediaButton>
                </div>

                {/* OR Divider */}
                <div className="h-[2%] w-[70%] flex items-center justify-center gap-4">
                    <hr className="flex-grow border-black opacity-30" />
                    <span className="text-black opacity-30 text-sm">OR</span>
                    <hr className="flex-grow border-black opacity-30" />
                </div>

                {/* Input Fields Placeholder */}
                <div className="flex w-[70%] mt-4 flex-col ">

                    <CustomInput text='Username*' placeholder='Enter your username'></CustomInput>
                    <CustomInput text='Email*' placeholder='Enter your email'></CustomInput>
                    <CustomInput text='Password*' placeholder='Enter your password' type='password'></CustomInput>
                </div>

                {/* Create Button Placeholder */}
                <div className="h-[15%] w-[70%] bg-blue-500 mt-2">
                    {/* Submit button here */}
                </div>
            </div>
        </div>
    );
}

export default SignUp;
