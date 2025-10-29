// src/pages/AdminPages/AuthorityDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaClock,  FaTasks, FaStar } from "react-icons/fa";

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 },
    areas: [],
    recentIssues: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/authority/dashboard`,
          { headers: { token } }
        );

        // Sort recent issues by upvotes descending
        const sortedRecent = res.data.recentIssues.sort(
          (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
        );

        setData({ ...res.data, recentIssues: sortedRecent });
      } catch (err) {
         if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authority Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-100 p-5 rounded-xl shadow flex items-center justify-between">
  <div>
    <p className="text-gray-600">Total Issues</p>
    <p className="text-3xl font-bold text-blue-600">{data.stats.total}</p>
  </div>
  <FaTasks className="text-blue-500 text-3xl mt-4" />
</div>

<div className="bg-yellow-100 p-5 rounded-xl shadow flex items-center justify-between">
  <div>
    <p className="text-gray-600">Pending Issues</p>
    <p className="text-3xl font-bold text-yellow-600">{data.stats.pending}</p>
  </div>
  <FaClock className="text-yellow-500 text-3xl mt-4" />
</div>

<div className="bg-green-100 p-5 rounded-xl shadow flex items-center justify-between">
  <div>
    <p className="text-gray-600">Resolved Issues</p>
    <p className="text-3xl font-bold text-green-600">{data.stats.resolved}</p>
  </div>
  <FaCheckCircle className="text-green-500 text-3xl mt-4" />
</div>
      </div>

      {/* Area-wise table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Area-wise Issues</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Area</th>
                <th className="py-2 px-4 text-center">Pending</th>
                
                <th className="py-2 px-4 text-center">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {data.areas.map((area, idx) => (
                <tr
                  key={idx}
                  className="border-b cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(`/authority/area/${area.name}`)
                  }
                >
                  <td className="py-2 px-4">{area.name}</td>
                  <td className="py-2 px-4 text-center">{area.pending}</td>
                 
                  <td className="py-2 px-4 text-center">{area.resolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Issues */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top Issues</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr className="bg-gray-200">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Area</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Upvotes</th>
                <th className="py-2 px-4">Reported On</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.recentIssues.map((issue) => (
                <tr key={issue._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{issue._id.slice(-6)}</td>
                  <td className="py-2 px-4">{issue.constituency}</td>
                  <td className="py-2 px-4">{issue.category}</td>
                  <td className="py-2 px-4">{issue.status}</td>
                  <td className="py-2 px-4 text-center flex items-center  gap-1">
                    <FaStar className="text-yellow-500" /> {issue.upvotes?.length || 0}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() =>
                        navigate(`/authority/issue/${issue._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
