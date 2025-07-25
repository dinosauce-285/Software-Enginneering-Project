import '../../index.css'
import CustomInput from '../../components/CustomInput'
import { Link } from 'react-router-dom';
function ForgetPass() {
    return (
        <div className="w-screen flex bg-[#f9f9f2]">
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
                    <div className="text-2xl font-poppins">Forgot Password</div>
                    <div className=" flex flex-row">
                        <div className="pr-[4px] font-poppins">We’ll send a verification code to your email.</div>

                    </div>
                </div>

                {/* Input Fields */}
                <div className="flex w-[70%] mt-4 flex-col">
                    <CustomInput placeholder="Enter your email" />
                </div>
                {/*Back to login*/}
                <div className='w-auto mb-5 mt-5 flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"  />
                    </svg>

                    <Link to="/login" className='font-poppins underline text-lg'>Back to login</Link>
                </div>


                {/* Create Button */}
                <button className="w-[70%] py-3 bg-black text-white font-poppins rounded-lg hover:bg-gray-600 transition-all duration-200 mb-10">
                    Send code
                </button>
            </div>
        </div>

    );
}
export default ForgetPass;