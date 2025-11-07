// src/pages/IssueFeed.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const IssueFeed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { constituency } = useParams();

  const backButton = () => navigate("/constituencies");
  const homeButton = () => navigate("/");
  const logoutButton = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  // 🔹 Fetch issues
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchIssues = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/issues/constituency/${constituency}`,
          { headers: { token: localStorage.getItem("token") } }
        );
        setIssues(res.data.issues);
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [constituency, navigate]);

  // 🔹 Upvote handler
  const handleUpvote = async (issueId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/issues/${issueId}/upvote`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId
            ? { ...issue, upvotes: res.data.upvotes }
            : issue
        )
      );
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error upvoting issue:", err);
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading issues...</p>;

  // 🔹 Filter issues
  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter((issue) => issue.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Issues in {constituency}
        </h1>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["All", "Pothole", "Garbage", "Electricity", "Water", "Other"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 sm:px-4 py-1 rounded text-sm font-medium transition ${
                  filter === cat
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          <button
            onClick={backButton}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-md transition text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>

          <button
            onClick={homeButton}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition text-sm"
          >
            <FontAwesomeIcon icon={faHome} />
            Home
          </button>

          <button
            onClick={logoutButton}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition text-sm"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>

        {/* Issue list */}
        {filteredIssues.length === 0 ? (
          <p className="text-center text-gray-600">No issues found.</p>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="flex flex-col sm:flex-row items-start bg-white rounded-2xl shadow-md p-4 sm:p-5 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/issue/${issue._id}`)}
            >
              {/* Left: text */}
              <div className="flex-1 pr-0 sm:pr-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  {issue.title}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  {issue.description}
                </p>

                {/* Meta info */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                    {issue.category}
                  </span>

                  {issue.location.latitude && issue.location.longitude && (
                    <span className="text-gray-500">
                      📍 {issue.location.latitude.toFixed(4)},{" "}
                      {issue.location.longitude.toFixed(4)}
                    </span>
                  )}

                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
                      issue.status === "Resolved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>

                {/* Upvote */}
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(issue._id);
                    }}
                    className="bg-blue-500 text-white text-sm sm:text-base px-3 py-1.5 rounded hover:bg-blue-600 transition"
                  >
                    👍 Upvote ({issue.upvotes?.length || 0})
                  </button>
                </div>
              </div>

              {/* Right: image */}
              {issue.imageUrl && (
                <img
                  src={`${issue.imageUrl}`}
                  alt="Issue"
                  className="mt-3 sm:mt-0 w-full sm:w-40 h-40 object-cover rounded-lg"
                />
              )}
            </div>
          ))
        )}

        {/* Floating “+” button */}
        <button
          onClick={() => navigate(`/report-issue/${constituency}`)}
          className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-3xl rounded-circle shadow-lg transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default IssueFeed;
