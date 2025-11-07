import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaThumbsUp,
  FaUserCircle,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function IssueDescription() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const backButton = () => navigate(`/issues/constituency/${issue.constituency}`);
  const homeButton = () => navigate("/");
  const logoutButton = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const fetchIssue = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/issues/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });
        setIssue(res.data.issue);
        setComments(res.data.comments || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    };
    fetchIssue();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/issues/${id}/comment`,
        { text: newComment }
      );
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!issue) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-4 sm:p-6">
      {/* Top Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
        <button
          onClick={backButton}
          className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-md transition text-sm sm:text-base"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <button
          onClick={homeButton}
          className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md transition text-sm sm:text-base"
        >
          <FontAwesomeIcon icon={faHome} />
          Home
        </button>

        <button
          onClick={logoutButton}
          className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition text-sm sm:text-base"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg border border-gray-100 overflow-hidden">
        {/* Responsive Image + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <img
              src={`${issue.imageUrl}`}
              alt={issue.title}
              className="w-full h-60 sm:h-72 md:h-80 object-cover"
            />
          </div>
          <div className="h-60 sm:h-72 md:h-80">
            <iframe
              src={`https://www.google.com/maps?q=${issue.location.latitude},${issue.location.longitude}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Issue Details */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold">{issue.title}</h2>
          <p className="text-gray-700 mt-2 text-sm sm:text-base">{issue.description}</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm mt-4">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-green-600" />
              {issue.location.latitude && issue.location.longitude && (
                <span>
                  {issue.location.latitude.toFixed(4)}, {issue.location.longitude.toFixed(4)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-green-600" />
              <span>
                {issue.createdAt
                  ? new Date(issue.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-5 gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                issue.status === "Pending"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {issue.status}
            </span>

            <div className="flex items-center gap-1 text-green-600 text-sm">
              <FaThumbsUp /> <span>{issue.upvotes.length ?? 0} upvotes</span>
            </div>
          </div>
        </div>
        {/* If issue is resolved, show resolved photo */}
{issue.status === "Resolved" && issue.resolvedPhoto && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-green-700 mb-3">
    Resolution Proof:
    </h3>
    <img
      src={`${import.meta.env.VITE_API_URL}${issue.resolvedPhoto}`}
      alt="Resolved Issue"
      className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-lg md:px-50 shadow-md border border-gray-200"
    />
    <p className="text-xs text-center text-gray-600 mt-1">
                      Resolved on:{" "}
                      {new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}
                    </p>
  </div>
)}


        {/* Comments Section */}
        <div className="border-t p-4 sm:p-6 bg-gray-50">
          <h3 className="font-semibold mb-3 text-lg text-center sm:text-left">
            Comments ({comments.length})
          </h3>

          <form
            onSubmit={handleCommentSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow border outline-none rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm sm:text-base"
            >
              ➤
            </button>
          </form>

          {comments.map((comment, index) => (
            <div
              key={index}
              className="flex items-start gap-3 mb-3 bg-white p-3 rounded-lg shadow-sm text-sm sm:text-base"
            >
              <FaUserCircle className="text-green-600 text-xl sm:text-2xl" />
              <div>
                <p className="font-medium text-gray-800">{comment.name || "Local Resident"}</p>
                <p className="text-gray-600">{comment.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(comment.time).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
