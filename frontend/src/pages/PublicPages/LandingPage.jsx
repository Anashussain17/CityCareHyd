// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUsers, FaShieldAlt } from "react-icons/fa";
// import { Link } from "react-scroll";
import LandingLogo from "../../assets/LandingLogo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      
     
      <nav className="w-full flex justify-between items-center px-4 sm:px-8 md:px-16 py-1 md:py-4 shadow-sm bg-white/90 backdrop-blur-lg">
      <h1 className=" font-extrabold   leading-tight select-none">
  <span className="font-[Montserrat]  block text-[1.8rem] md:text-[1.6rem] sm:text-[1.4rem] text-black">
    Report
  </span>
  <hr className="my-0" />
  <span className="font-[Montserrat] block text-[2rem] md:text-[1.8rem] sm:text-[1.6rem] text-green-600 tracking-[0.13rem]">
    M L A
  </span>
</h1>
        {/* Auth Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-2 sm:px-5 py-1.5 sm:py-2 rounded font-medium hover:bg-green-700 transition text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login?mode=signup")}
            className="border-2 border-green-600 text-green-700 px-2 sm:px-5 py-1.5 sm:py-2 rounded font-medium hover:bg-green-50 transition text-sm sm:text-base"
          >
            Sign Up
          </button>
        </div>
      </nav>

   
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-grow px-4 sm:px-8 md:px-20 py-10 md:py-16 w-full">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 leading-tight mb-4">
  Bridging Citizens, <br />
  <span className="text-green-500">Leaders & Local Bodies.</span>
</h2>
<p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto md:mx-0">
  ReportMLA connects people, MLAs, and civic authorities to create a transparent
  system where every issue is tracked until it is resolved.
</p>



          <div className="flex flex-col sm:flex-row justify-center md:justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded font-medium text-base sm:text-lg hover:bg-green-700 transition"
            >
              Get Started
            </button>
            <li
              href="#features"
              className="border-2 border-green-600 text-green-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded list-none cursor-pointer font-medium text-base sm:text-lg hover:bg-green-50 transition"
            >
              Learn More
            </li>
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex justify-center mb-8 md:mb-0"
        >
          <img
            src={LandingLogo}
            alt="CityCare illustration"
            className="w-[260px] sm:w-[340px] md:w-[420px] h-auto"
          />
        </motion.div>
      </div>

     <section id="features" className="py-12 sm:py-16 bg-white w-full">
  <h3 className="text-center text-2xl sm:text-3xl font-bold text-green-700 mb-4">
    Key Features
  </h3>

  <div className="flex flex-wrap justify-center gap-8 sm:gap-10 text-green-700 px-4">

    <div className="flex flex-col items-center max-w-[200px] sm:max-w-[220px]">
      <FaMapMarkerAlt className="text-3xl sm:text-4xl mb-3" />
      <h4 className="font-semibold text-lg mb-1">Report Local Issues</h4>
      <p className="text-gray-600 text-sm text-center">
        Citizens can report civic problems like potholes, garbage, or drainage
        issues with photos and location details.
      </p>
    </div>

    <div className="flex flex-col items-center max-w-[240px] sm:max-w-[280px]">
      <FaUsers className="text-3xl sm:text-4xl mb-3" />
      <h4 className="font-semibold text-lg mb-1">MLA Insights</h4>
      <p className="text-gray-600 text-sm text-center">
        MLAs can view all issues reported within their constituency to track
        areas needing attention and coordinate with GHMC officials.
      </p>
    </div>

    <div className="flex flex-col items-center max-w-[300px] sm:max-w-[220px]">
      <FaShieldAlt className="text-3xl sm:text-4xl mb-3" />
      <h4 className="font-semibold text-lg mb-1">Live Issue Status</h4>
      <p className="text-gray-600 text-sm text-center">
        Every issue remains visible until marked resolved by the concerned
        authority, ensuring accountability at every level.
      </p>
    </div>

  </div>
</section>


   
      <footer className="w-full text-center py-5 sm:py-6 bg-green-700 text-white text-xs sm:text-sm mt-auto">
        © {new Date().getFullYear()} ReportMLA - Empowering Citizens. Enabling Action. <br /> Developed by Anas Hussain
      </footer>
    </div>
  );
}
