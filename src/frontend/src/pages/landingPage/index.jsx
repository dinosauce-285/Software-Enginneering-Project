import '../../index.css';
function LandingPage() {

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-[1200px] border-2 border-black rounded-3xl p-6 flex flex-col justify-center items-center">

        {/* Top bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6 w-full">
          <div className="flex items-center gap-4">
            <img src="src/assets/logo.png" className="h-10" />
            <span className="text-xl font-semibold">SoulNote</span>
          </div>
          <div className="flex gap-6">
            <a href="#">Login</a>
            <a href="#">Sign up</a>
          </div>
        </div>

        {/* Banner */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Capture your memories.</h1>
          <h2 className="text-4xl font-bold mt-2">Feel them again.</h2>
          <p className="text-lg mt-4">
            A private diary to store your photos, voice and feelings – beautifully.
          </p>
          <button className="bg-black text-white px-6 py-2 mt-6 rounded-md">
            Get Started
          </button>
        </div>

        {/* Memory Preview */}
        <div className="flex flex-wrap justify-between items-start gap-4 bg-[#f9f9f2] p-6 rounded-lg border border-black w-[60%]">
          <div className="w-full md:w-[48%]">
            <div className="flex flex-wrap gap-2 text-sm justify-between">
              <span>04/02/2025</span>
              <span>Ho Chi Minh City</span>
              <span>#life #city</span>
            </div>
            <p className="mt-4 text-justify text-base">
              Today felt like a breath of calm in the middle of chaos. I wandered the streets with no destination — just me, the breeze, and the sounds of the city. Sometimes, these quiet moments say more than words ever could.
            </p>
          </div>
          <div className="w-full md:w-[48%]">
            <img src="src/assets/landingBanner.png" className="w-full h-auto object-cover rounded-md" />
          </div>
        </div>

        {/* Footer */}
        <hr className="my-6 w-[90%]" />
        <div className="flex justify-between items-center text-sm w-[90%]">
          <div className="flex gap-6">
            <span>About</span>
            <span>Contact</span>
            <span>Terms</span>
          </div>
          <div>© 2025 SoulNote</div>
        </div>
      </div>
    </div>

  )
}

export default LandingPage
