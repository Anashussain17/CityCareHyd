// src/pages/AdminPages/AuthorityAreaIssues.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FaClock, FaCheckCircle } from "react-icons/fa";

const AuthorityAreaIssues = () => {
  const { areaName } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]); //  for filtered view
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [filter, setFilter] = useState("All"); // current active filter

  useEffect(() => {
    const fetchAreaIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/authority/area/${areaName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setIssues(res.data.issues);
          setFilteredIssues(res.data.issues);
          setPendingCount(res.data.pendingCount);
          setResolvedCount(res.data.resolvedCount);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching area issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaIssues();
  }, [areaName, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter Logic
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === "All") {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter((issue) => issue.status === status);
      setFilteredIssues(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto mt-2 px-3 sm:px-6 md:px-8">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-800 leading-tight break-words">
          {areaName} - Area Issues
        </h2>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-md transition text-sm"           >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back</span>
          </button>

          <button
            onClick={() => navigate("/authority/dashboard")}
            className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition text-sm"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition text-sm"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-100 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-600">Pending Issues</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <FaClock className="text-yellow-500 text-3xl mt-4" />
        </div>

        <div className="bg-green-100 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-600">Resolved Issues</p>
            <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-3xl mt-4" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center sm:justify-end gap-2 mb-4">
        {["All", "Pending", "Resolved"].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all shadow-md ${
              filter === status
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      {filteredIssues.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">
          No issues found for this filter.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr
                  key={issue._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{issue.title}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      issue.status === "Pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {issue.status}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/authority/issue/${issue._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuthorityAreaIssues;
