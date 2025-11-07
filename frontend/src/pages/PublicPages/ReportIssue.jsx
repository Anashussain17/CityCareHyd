// src/pages/ReportIssue.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../../components/Alert";
import { Camera, MapPin, RefreshCcw } from "lucide-react";

function ReportIssue() {
  const { constituency } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null, accuracy: null });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showAlert, setShowAlert] = useState(null);

  // Auto-get location when page loads
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setShowAlert({ type: "danger", msg: "Your browser does not support location access." });
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoadingLocation(false);
      },
      (err) => {
        console.error("Location Error:", err);
        setShowAlert({
          type: "danger",
          msg: "Unable to fetch location. Please enable GPS and location permission.",
        });
        setTimeout(() => setShowAlert(null), 3000);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      getUserLocation(); // Refresh location once photo taken
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location.latitude || !location.longitude) {
    setShowAlert({
      type: "danger",
      msg: "⚠️ Location not detected! Turn on GPS & try again.",
    });
    return;
  }

  //  Block submission if GPS accuracy is low
  if (location.accuracy && location.accuracy > 40) {
    setShowAlert({
      type: "danger",
      msg: `⚠️ GPS Accuracy is low (${Math.round(location.accuracy)}m). Move to open area & retry.`,
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("constituency", constituency);
    if (image){ formData.append("image", image);}
    else{
        setShowAlert({
      type: "danger",
      msg: "📸 Image required! Please take or upload a photo of the issue to proceed.",
    });
    return;
    }
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);

    await axios.post(`${import.meta.env.VITE_API_URL}/api/issues`, formData, {
      headers: { "Content-Type": "multipart/form-data", token: localStorage.getItem("token") },
    });

    setShowAlert({ type: "success", msg: "Report Submitted ✅" });
    setTimeout(() => navigate(`/issues/constituency/${constituency}`), 2000);
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      console.error("Error reporting issue:", err);
      setShowAlert({ type: "danger", msg: "Failed to submit report." });
    }
    setTimeout(() => setShowAlert(null), 3000);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MapPin size={20} className="text-green-600" /> Report an Issue
        </h1>

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
          <label className="block text-sm font-semibold mb-2">
            Add Photo <br />
            <span className="text-xs text-red-400 italic">
              Make sure GPS & location permission is ON
            </span>
          </label>

          <label
            htmlFor="file-upload"
            className="flex flex-row items-center justify-center border-2 border-dashed border-green-500 rounded-lg h-40 cursor-pointer bg-green-50 hover:bg-green-100 transition"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center text-green-600 mt-4">
                <Camera size={36} />
                <span className="mt-2 font-medium">Tap to take or upload photo</span>
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
            <p className="text-sm text-gray-500 mt-2">📍 Detecting your location…</p>
          ) : location.latitude ? (
            <div className="mt-3 space-y-1">
              <p className="text-sm text-green-600 font-medium">
                ✅ Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
              {location.accuracy && (
  <>
    <p className="text-xs text-gray-500">
      Accuracy: ±{Math.round(location.accuracy)} meters
    </p>

    {location.accuracy > 40 ? (
      <>
        <p className="text-xs text-red-600">
          ⚠️ Accuracy is low. Step outside or enable high-accuracy mode.
        </p>
        <p className="text-xs text-blue-600 animate-pulse">
          🔄 Improving accuracy… please wait
        </p>
      </>
    ) : (
      <p className="text-xs text-green-600">
        ✅ Good accuracy! You can submit the report.
      </p>
    )}
  </>
)}


              <iframe
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=16&output=embed`}
                width="100%"
                height="200"
                className="rounded mt-2"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>

              <button
                type="button"
                className="flex items-center gap-1 text-xs text-blue-600 underline mt-1"
                onClick={getUserLocation}
              >
                <RefreshCcw size={12} /> Retry Location
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={getUserLocation}
              className="text-xs text-blue-600 underline mt-2 flex items-center gap-1"
            >
              <MapPin size={12} /> Detect Location
            </button>
          )}
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Issue Description</label>
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
