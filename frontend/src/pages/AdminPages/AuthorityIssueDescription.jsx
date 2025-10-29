// src/pages/AdminPages/AuthorityIssueDescription.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faPaperPlane,
  faUpload,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

import Alert from "../../components/Alert";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5717";

const AuthorityIssueDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [resolvedImage, setResolvedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [showAlert,setShowAlert]=useState(null)

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchIssue = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/authority/issue/${id}`, {
          headers,
        });
        if (res.data?.success) setIssue(res.data.issue);
        else setIssue(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching issue:", err);
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, navigate, token]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    setPostingComment(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/authority/issue/${id}/comment`,
        { text: comment },
        { headers }
      );
      setComment("");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/authority/issue/${id}`, {
        headers,
      });
      if (res.data?.success) setIssue(res.data.issue);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("Error adding comment:", err);
      setShowAlert("Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const handleResolveUpload = async (e) => {
    e.preventDefault();
    if (!resolvedImage) return alert("Please choose an image to upload.");
    setUploading(true);
    const formData = new FormData();
    formData.append("resolvedPhoto", resolvedImage);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/authority/issue/${id}/resolve`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/authority/issue/${id}`, {
        headers,
      });
      if (res.data?.success) setIssue(res.data.issue);
      setResolvedImage(null);
      setShowAlert({type:"success",msg:"Resolved photo uploaded and issue marked resolved✅"});
      setTimeout(()=>{setShowAlert(null)},2000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("Error uploading resolved photo:", err);
      setShowAlert({type:"danger",msg:"Failed to upload resolved photo❌"});
      setTimeout(()=>{setShowAlert(null)},2000)
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 font-semibold">
        Loading issue details...
      </div>
    );

  if (!issue)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 font-semibold">
        Issue not found.
      </div>
    );

  const urlFor = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
     <div className="w-full max-w-5xl mx-auto mt-2 px-3 sm:px-6 md:px-8">
  {/* Header */}
  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-800 leading-tight break-words">
   {issue.constituency} - {issue.title} Issue
  </h2>

  {/* Navigation buttons */}
   {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-sm sm:text-base mb-6"></div> */}
  <div className="flex flex-wrap justify-center  gap-2 sm:gap-3 sm:text-base mb-4">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-md transition text-sm"    >
      <FontAwesomeIcon icon={faArrowLeft} />
      <span>Back</span>
    </button>

    {/* Dashboard Button */}
    <button
      onClick={() => navigate('/authority/dashboard')}
      className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition text-sm"
    >
      <FontAwesomeIcon icon={faHome} />
      <span>Dashboard</span>
    </button>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 px-2 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition text-sm"
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <span>Logout</span>
    </button>
  </div>
</div>




      {/* MAIN CONTENT */}
      <div className="space-y-8">
        {/* ISSUE INFO CARD */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* LEFT SIDE - TEXT DETAILS */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {issue.category}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Area:</span> {issue.constituency}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    issue.status === "Pending" ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {issue.status}
                </span>
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Reported On:</span>{" "}
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed">{issue.description}</p>
            </div>

            {/* RIGHT SIDE - IMAGES */}
            <div className="flex flex-col md:flex-row gap-4 md:w-1/2">
              {/* Reported Image */}
              {issue.imageUrl && (
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 mb-2">Reported Photo</p>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${issue.imageUrl}`}
                    alt="Reported"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                      Reported on:{" "}
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                </div>
              )}
              {/* Resolution Image */}
              <div className="flex-1">
                <p className="font-semibold text-gray-700 mb-2">Resolution Proof</p>
                {issue.resolvedPhoto ? (
                  <>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${issue.resolvedPhoto}`}
                      alt="Resolved"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Resolved on:{" "}
                      {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">No resolved proof uploaded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* LOCATION BELOW */}
          {issue.location?.latitude && issue.location?.longitude && (
            <div>
              <p className="font-semibold mb-3 text-gray-700 mt-4">Location</p>
              <div className="w-full h-56 rounded-md overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${issue.location.latitude},${issue.location.longitude}&z=15&output=embed`}
                  title="Issue Location"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                📍 {issue.location.latitude.toFixed(6)},{" "}
                {issue.location.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* UPLOAD BELOW LOCATION */}
          {issue.status !== "Resolved" && (
            <div className="mt-6">
              <p className="font-semibold mb-2 text-gray-700">Mark as Resolved</p>
         
{showAlert && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
    <Alert showAlert={showAlert} />
  </div>
)}

<form onSubmit={handleResolveUpload} className="flex flex-col md:flex-row gap-3">
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setResolvedImage(e.target.files?.[0] || null)}
    className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
  />
  <button
    type="submit"
    disabled={uploading}
    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow disabled:opacity-60"
  >
    <FontAwesomeIcon icon={faUpload} />
    {uploading ? "Uploading..." : "Upload & Resolve"}
  </button>
</form>

            </div>
          )}
        </div>

        {/* COMMENTS CARD */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Comments</h4>

          <div className="space-y-3 max-h-[40vh] overflow-auto pr-2">
            {issue.comments && issue.comments.length > 0 ? (
              issue.comments.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <FaUserCircle className="text-green-600 text-2xl flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">{c.name || "Resident"}</p>
                      <p className="text-xs text-gray-400 ml-2">
                        {new Date(c.time).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <p className="text-gray-700 mt-1">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg text-gray-500 italic">
                No comments yet.
              </div>
            )}
          </div>

          {/* ADD COMMENT */}
          <div className="mt-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={postingComment || !comment.trim()}
              className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              {postingComment ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityIssueDescription;
