import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const backButton = () => {
    navigate(`/issues/constituency/${issue.constituency}`);
  };
  const homeButton = () => {
    navigate("/");
  };
  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`http://localhost:5717/api/issues/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        console.log(res.data);
        setIssue(res.data.issue);
        setComments(res.data.comments || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token expired or invalid
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
        `http://localhost:5717/api/issues/${id}/comment`,
        {
          text: newComment,
        }
      );
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!issue) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 p-6">
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
      <div className="max-w-5xl mx-auto mt-8 bg-white shadow-md rounded-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div>
            <img
              src={`http://localhost:5717${issue.imageUrl}`}
              alt={issue.title}
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Map */}
          <div className="h-80">
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
        <div className="p-6">
          <h2 className="text-2xl font-semibold">{issue.title}</h2>
          <p className="text-gray-700 mt-2">{issue.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mt-4">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-green-600" />
              {issue.location.latitude && issue.location.longitude && (
                <span>
                  {issue.location.latitude.toFixed(4)},{" "}
                  {issue.location.longitude.toFixed(4)}
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

          <div className="flex justify-between items-center mt-5">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                issue.status === "Pending"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {issue.status}
            </span>

            <div className="flex items-center gap-1 text-green-600">
              <FaThumbsUp /> <span>{issue.upvotes.length ?? 0} upvotes</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t p-6 bg-gray-50">
          <h3 className="font-semibold mb-3 text-lg">
            Comments ({comments.length})
          </h3>

          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 mb-5"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow border outline-none rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              ➤
            </button>
          </form>

          {comments.map((comment, index) => (
            <div
              key={index}
              className="flex items-start gap-3 mb-3 bg-white p-3 rounded-lg shadow-sm"
            >
              <FaUserCircle className="text-green-600 text-xl" />
              <div>
                <p className="font-medium text-gray-800">
                  {comment.name || "Local Resident"}
                </p>
                <p className="text-gray-600 text-sm">{comment.text}</p>
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
