

import { useState,useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "../../assets/logo.png";
import Alert from "../../components/Alert";


export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(null);

  useEffect(() => {

     const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.isAdmin) {
        navigate("/authority/dashboard", { replace: true });
      } else {
        navigate("/constituencies", { replace: true });
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token"); 
    }
  }

  
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") {
      setIsSignup(true);
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const endpoint = isSignup
      ? `${import.meta.env.VITE_API_URL}/api/auth/signup`
      : `${import.meta.env.VITE_API_URL}/api/auth/login`;

    const payload = isSignup
      ? { email, password, confirmPassword }
      : { email, password };

    const res = await axios.post(endpoint, payload);

    setShowAlert({ type: "success", msg: res.data.message });
    setTimeout(() => {setEmail("");setPassword("");setConfirmPassword("");setShowAlert(null)}, 3000);

    if (res.data.token) {
  localStorage.setItem("token", res.data.token);

  setShowAlert({ type: "success", msg: res.data.message });

  setTimeout(() => {
    if (res.data.isAdmin) {
      navigate("/authority/dashboard"); // admin route
    } else {
      navigate("/constituencies"); // user route
    }
  }, 2000);
}

  } catch (err) {
    setShowAlert({ type: "danger", msg: err.response?.data?.message || "Something went wrong" });
    setTimeout(() =>{setEmail("");setPassword(""); setShowAlert(null)}, 3000);
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      
      <div className="flex flex-col items-center mb-3">
        <div>
          <img
            src={logo}
            alt="CityCare Hyd logo"
            className="w-16 h-16 object-contain bg-green-600 rounded-circle"
          />
        </div>
        <h1 className=" font-extrabold   leading-tight select-none">
  <span className="font-[Montserrat]  block text-[1.8rem] md:text-[1.6rem] sm:text-[1.4rem] text-black">
    Report
  </span>
  <hr className="my-0" />
  <span className="font-[Montserrat] block text-[2rem] md:text-[1.8rem] sm:text-[1.6rem] text-green-600 tracking-[0.13rem]">
    M L A
  </span>
</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-3 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        <Alert showAlert={showAlert} />
        </form>
        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-green-600 cursor-pointer font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
