import './landingPage.css'
import './index.css'
function App() {

  return (
    <div className='flex bg-white-600 h-screen w-screen justify-center items-center p-[2rem]'>
      <div className='smallWindow flex flex-col justify-center items-center h-full w-full border-2 border-black rounded-[2rem]'>
        <div className='topBar flex flex-row w-full h-[15%] justify-between'>
          <div className='logoSide h-full flex flex-row justify-center items-center ml-[8%]'>
            <img src="src/assets/logo.png" alt="" className='logoApp h-[50%]' />
            <div className='nameApp ml-[5%] text-1xl'>SoulNote</div>
          </div>
          <div className='logButton h-full w-[10%] flex flex-row justify-between items-center mr-[8%]'>
            <a href="" className='text-1xl font-inter'>Login</a>
            <a href="" className='text-1xl font-inter'>Sign up</a>
          </div>
        </div>
        <div className='bannerText flex flex-col justify-center items-center w-full h-[22%]'>
          <div className='text-5xl font-inter'>Capture your memories.</div>
          <div className='text-5xl mt-[1%] font-inter'>Feel them again.</div>
          <div className='text-2xl mt-[1%] font-inter'>A private diary to store your photos, voice and feelings - beautifully.</div>
        </div>
        <div className='getStartedButton flex flex row justify-center items-center bg-[#000000] w-[10%] h-[8%] rounded-[0.7rem] m-[1%] '>
          <a href="" className='text-[#ffffff] font-inter'>Get Started</a>
        </div>
        <div className='underShape flex flex-row justify-center items-center bg-[#f9f9f2] w-[50%] h-[36%] rounded-[1rem] border border-black p-[2%] '>
          <div className='flex flex-col justify-center items-start w-[50%] mr-[3.5%]'>
            <div className='flex flex-row justify-between w-full'>
              <div>04/02/2025</div>
              <div>Ho Chi Minh City</div>
              <div>#life #city</div>
            </div>
            <div className='mt-[2%] text-justify'>
              Today felt like a breath of calm in the middle of chaos. I wandered the streets with no destination — just me, the breeze, and the sounds of the city. Sometimes, these quiet moments say more than words ever could.
            </div>
          </div>
          <div className='flex flex-row justify-center items-center w-[50%] ml-[3.5%]'>
            <img src="src/assets/landingBanner.png" alt="" className='rounded-[0.5rem]' />
          </div>
        </div>
        <div className='w-[90%] h-[0.2px] border border-black  mt-[1rem] opacity-20'></div>
        <div className='footer flex flex-row justify-between w-[90%] h-[10%]   pt-[1rem] font-inter'>
          <div className='flex flex-row justify-between w-[20%] opacity-100'>
            <div>About</div>
            <div>Contact</div>
            <div>Terms</div>
          </div>
          <div>© 2025 SoulNote</div>
        </div>
      </div>
    </div>
  )
}

export default App
