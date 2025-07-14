import '../../index.css';
import CustomInput from '../../components/input';
import MediaButton from '../../components/mediaButton';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function SignUp() {
    const [gender, setGender] = useState('');

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
            <div className="w-1/2 max-h-screen overflow-y-auto flex flex-col items-center bg-[#f9f9f2]">
                {/* Top Section */}
                <div className="h-[20%] w-[70%] flex flex-col justify-center items-center">
                    <img src="./src/assets/logo.png" className="h-[30%]" alt="" />
                    <div className="text-lg font-poppins">Sign up</div>
                    <div className="loginQues flex flex-row">
                        <div className="pr-[4px] font-poppins">Already have an account?</div>
                        <Link to="/login" className="font-poppins underline">
                            Login
                        </Link>
                    </div>
                </div>

                {/* Media Buttons */}
                <div className="h-[15%] w-[70%] flex flex-col justify-center items-center gap-2">
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
                <div className="h-[2%] w-[70%] flex items-center justify-center gap-4">
                    <hr className="flex-grow border-black opacity-30" />
                    <span className="text-black opacity-30 text-sm">OR</span>
                    <hr className="flex-grow border-black opacity-30" />
                </div>

                {/* Input Fields */}
                <div className="flex w-[70%] mt-4 flex-col">
                    <CustomInput text="Username*" placeholder="Enter your username" />
                    <CustomInput text="Email*" placeholder="Enter your email" />
                    <CustomInput
                        text="Password*"
                        placeholder="Enter your password"
                        type="password"
                    />

                    {/* Gender Radio Buttons */}
                    <div className="mt-2">
                        <label className="text-sm font-poppins block mb-1 text-[#000000]">Gender*</label>
                        <div className="flex gap-6 mb-[1rem]">
                            {/* Male */}
                            <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-[#000000]">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={gender === 'male'}
                                    onChange={() => setGender('male')}
                                    className="w-4 h-4 rounded-full border-2 border-gray-500 bg-[#f9f9f2] accent-black appearance-none checked:appearance-auto"
                                />
                                Male
                            </label>

                            {/* Female */}
                            <label className="flex items-center gap-2 font-poppins text-sm cursor-pointer text-[#000000]">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={gender === 'female'}
                                    onChange={() => setGender('female')}
                                    className="w-4 h-4 rounded-full border-2 border-gray-500 bg-[#f9f9f2] accent-black appearance-none checked:appearance-auto"
                                />
                                Female
                            </label>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="text-sm font-poppins mb-1 text-[#000000]">What’s your date of birth?</div>
                    <div className="flex gap-4">
                        {/* Ngày */}
                        <div className='basis-1/3'>
                            <label className="block text-sm font-poppins mb-1 text-[#000000]">Day</label>
                            <select className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]">
                                {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tháng */}
                        <div className='basis-1/3'>
                            <label className="block text-sm font-poppins mb-1 text-[#000000]">Month</label>
                            <select className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]">
                                {[
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December',
                                ].map((month, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Năm */}
                        <div className='basis-1/3'>
                            <label className="block text-sm font-poppins mb-1 text-[#000000]">Year</label>
                            <select className="w-full p-2 rounded border border-gray-300 font-poppins text-sm bg-[#f9f9f2] text-[#666666]">
                                {Array.from({ length: 100 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="w-[70%] text-sm font-poppins text-center text-poppins flex justify-between mt-5 mb-10">
                    By creating an account, you agree to the
                    <span className="underline mx-1 cursor-pointer">Terms of Use</span>
                    and
                    <span className="underline mx-1 cursor-pointer">Privacy Policy.</span>
                </div>
                {/* Create Button */}
                <button className="w-[70%] py-3 bg-black text-white font-poppins rounded-lg hover:bg-gray-600 transition-all duration-200 mb-10">
                    Create Account
                </button>


            </div>
        </div>
    );
}

export default SignUp;
