// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUsers, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-scroll";
import LandingLogo from "../../assets/LandingLogo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      
     
      <nav className="w-full flex justify-between items-center px-4 sm:px-8 md:px-16 py-3 md:py-4 shadow-sm bg-white/90 backdrop-blur-lg">
        <h1 className="text-xl sm:text-1xl md:text-3xl font-bold text-green-700 tracking-tight">
          CityCare <span className="text-green-500">Hyd</span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          <li className="hover:text-green-600 transition cursor-pointer list-none">
            <Link to="features" smooth={true} duration={500}>
              Features
            </Link>
          </li>
          <li className="hover:text-green-600 transition list-none cursor-pointer">
            About
          </li>
          <li className="hover:text-green-600 transition list-none cursor-pointer">
            Contact
          </li>
        </ul>

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
            Together, Let’s Make <br />
            <span className="text-green-500">Hyderabad Cleaner & Safer!</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md mx-auto md:mx-0">
            Report issues like potholes, garbage, or water supply disruptions
            directly through CityCare Hyd. Your concern will reach local
            authorities faster than ever!
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
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-green-700 mb-6">
          Key Features
        </h3>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-10 text-green-700 px-4">
          <div className="flex flex-col items-center max-w-[200px] sm:max-w-[220px]">
            <FaMapMarkerAlt className="text-3xl sm:text-4xl mb-3" />
            <h4 className="font-semibold text-lg mb-1">Report Issues</h4>
            <p className="text-gray-600 text-sm text-center">
              Easily upload images and auto-fetch location to report civic
              problems.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-[240px] sm:max-w-[280px]">
            <FaUsers className="text-3xl sm:text-4xl mb-3" />
            <h4 className="font-semibold text-lg mb-1">Community Driven</h4>
            <p className="text-gray-600 text-sm text-center">
              Citizens unite to bring transparency and accountability to the
              system.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-[200px] sm:max-w-[220px]">
            <FaShieldAlt className="text-3xl sm:text-4xl mb-3" />
            <h4 className="font-semibold text-lg mb-1">Verified Issues</h4>
            <p className="text-gray-600 text-sm text-center">
              Ensures every report is validated and visible to local authorities.
            </p>
          </div>
        </div>
      </section>

   
      <footer className="w-full text-center py-5 sm:py-6 bg-green-700 text-white text-xs sm:text-sm mt-auto">
        © {new Date().getFullYear()} CityCare Hyd | Developed by Anas Hussain
      </footer>
    </div>
  );
}
