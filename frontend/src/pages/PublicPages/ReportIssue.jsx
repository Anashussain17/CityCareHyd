// src/pages/ReportIssue.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../../components/Alert";
import { Camera } from "lucide-react";

function ReportIssue() {
  const { constituency } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showAlert, setShowAlert] = useState(null);


  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));

      // Fetch location when photo is taken
      if (navigator.geolocation) {
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setLoadingLocation(false);
          },
          (err) => {
            console.error("Error fetching location:", err);
            setLoadingLocation(false);
          }
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (location.latitude && location.longitude) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("constituency", constituency);
        if (image) formData.append("image", image);
        if (location.latitude && location.longitude) {
          formData.append("latitude", location.latitude);
          formData.append("longitude", location.longitude);
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/api/issues`, formData, {
          headers: { "Content-Type": "multipart/form-data",token: localStorage.getItem("token"), },
        });
        setShowAlert({ type: "success", msg: "Report Submitted ✅" });
        setTimeout(() => {
          navigate(`/issues/constituency/${constituency}`);
        }, 2000);
      } else {
        setShowAlert({
          type: "danger",
          msg: "⚠️ Unable to access location.\n Make sure location services are turned on and permission is granted to this site. ",
        });
        setTimeout(() => {
          setShowAlert(null);
        }, 3000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          navigate("/login");
        } else{
      console.error("Error reporting issue", err);
          setShowAlert({ type: "danger", msg: "Failed to submit report." });
    setTimeout(()=> setShowAlert(null), 3000);

    }}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold">Report an Issue</h1>

        {/* Title */}
        <label className="block text-sm font-semibold my-2">Add Title</label>
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded outline-none focus:ring-2 focus:ring-green-400"
          required
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Upload Photo */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-2">Add Photo</label>
          <label
            htmlFor="file-upload"
            className="flex flex-row items-center justify-center border-2 border-dashed border-green-500 rounded-lg h-40 cursor-pointer bg-green-50 hover:bg-green-100 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center text-green-600 mt-4">
                <Camera size={36} />
                <span className="mt-2 font-medium">
                  Tap to take or upload photo
                </span>
              </div>
            )}

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Location Info */}
          {loadingLocation ? (
            <p className="text-sm text-gray-500 mt-2">Fetching location...</p>
          ) : location.latitude ? (
            <p className="text-sm text-green-600 mt-2">
              📍 Location attached: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
              <iframe
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </p>
          ) : null}
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Issue Description
          </label>
          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full outline-none border p-2 rounded focus:ring-2 focus:ring-green-400"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mb-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit Issue Report
        </button>
        <Alert showAlert={showAlert} />

        <p className="text-xs text-gray-500 text-center">
          Your report will be forwarded to local authorities
        </p>
      </form>
    </div>
  );
}

export default ReportIssue;
