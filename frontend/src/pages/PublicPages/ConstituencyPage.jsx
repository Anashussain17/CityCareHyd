

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import constituencies from "../../data/constituencies";
import logo from "../../assets/logo.png";
import bjpLogo from "../../assets/parties/bjp.png";
import incLogo from "../../assets/parties/inc.png";
import aimimLogo from "../../assets/parties/aimim.jpg";
import brsLogo from "../../assets/parties/brs.png";

export default function ConstituencyPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [issueCounts, setIssueCounts] = useState({});

  const parties = {
    AIMIM: aimimLogo,
    INC: incLogo,
    BRS: brsLogo,
    BJP: bjpLogo,
  };
  const backButton=()=>{
  navigate("/")
}
const homeButton=()=>{
  navigate("/")
}
const logoutButton=()=>{
  localStorage.removeItem("token")
  navigate("/login")
}
  useEffect(() => {
   if(!localStorage.getItem("token")){
    navigate("/login");
    return;
   }
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5717/api/issues/counts",{
          headers:{
            token:localStorage.getItem("token")
          }
        });
        setIssueCounts(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          navigate("/login");
        } else{
        console.error("Error fetching issue counts:", err);
      }}
    };
    fetchCounts();
  }, []);

  const filtered = constituencies.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.mla.toLowerCase().includes(q) ||
      c.party.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 shadow">
              <img src={logo} alt="CityCare Hyd logo" className="object-contain bg-green-600 rounded-circle" />
            </div>
            <div>
              <h2>Select Your Constituency</h2>
              <p className="text-sm text-gray-500">
                Hyderabad — pick your area to view civic issues
              </p>
            </div>
          </div>

          {/* Search */}
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search constituency, MLA or party"
              className="px-3 py-2 border rounded-lg md:w-64 w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
              {/* Navigation Buttons (Back, Home, Logout) */}
<div className="flex justify-center gap-4 mb-6">
  <button
    onClick={backButton}
    className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-md transition"
  >
    <FontAwesomeIcon icon={faArrowLeft} />
    Back
  </button>

  <button
    onClick={homeButton}
    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition"
  >
    <FontAwesomeIcon icon={faHome} />
    Home
  </button>

  <button
    onClick={logoutButton}
    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition"
  >
    <FontAwesomeIcon icon={faRightFromBracket} />
    Logout
  </button>
</div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/issues/constituency/${encodeURIComponent(c.name)}`)}
              className="w-full bg-white shadow p-4 flex items-center justify-between hover:shadow-md transition text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden">
                  <img
                    src={parties[c.party]}
                    alt={c.party}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/parties/default.png";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{c.name}</h2>
                  <p className="text-sm text-gray-500">
                    MLA: <span className="font-medium text-gray-700">{c.mla}</span>{" "}
                    <span className="ml-2 text-xs text-gray-400">({c.party})</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-green-600 font-semibold">
                  {issueCounts[c.name] ?? 0} Issues
                </div>
                <div className="text-xs text-gray-400">View issues</div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No constituencies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
