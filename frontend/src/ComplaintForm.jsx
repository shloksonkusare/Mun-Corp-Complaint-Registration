import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ComplaintForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /* ---------------- LOCATION ---------------- */

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => alert("Location access denied ❌")
    );
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- CAMERA ---------------- */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      setCameraOn(true);
    } catch (err) {
      alert("Unable to access camera ❌");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured.jpg", {
        type: "image/jpeg",
      });

      setImage(file);
      setPreview(URL.createObjectURL(blob));
    });

    stopCamera();
  };

  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOn]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !latitude || !longitude) {
      alert("Image and location are required!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/complaint",
        formData
      );

      setResponseData(res.data);

      setDescription("");
      setImage(null);
      setPreview(null);
      setLatitude(null);
      setLongitude(null);
    } catch (err) {
      alert("Error submitting complaint ❌");
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏙 Municipal Complaint Portal</h2>

        {!responseData ? (
          <form onSubmit={handleSubmit}>

            {/* IMAGE SECTION */}
            <div style={styles.section}>
              <label style={styles.label}>📷 Capture or Upload Image</label>

              <button
                type="button"
                onClick={startCamera}
                style={styles.secondaryButton}
              >
                Open Camera
              </button>

              {cameraOn && (
                <div style={{ marginTop: 10 }}>
                  <video ref={videoRef} autoPlay style={styles.video} />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    style={styles.primaryButton}
                  >
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.input}
              />

              {preview && (
                <img src={preview} alt="Preview" style={styles.preview} />
              )}
            </div>

            {/* DESCRIPTION */}
            <div style={styles.section}>
              <label style={styles.label}>📝 Description</label>
              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
              />
            </div>

            {/* LOCATION */}
            <div style={styles.section}>
              <button
                type="button"
                onClick={getLocation}
                style={styles.secondaryButton}
              >
                📍 Capture Location
              </button>

              {latitude && longitude && (
                <p style={styles.successText}>
                  Location captured successfully ✅
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        ) : (
          <div style={styles.successBox}>
            <h3 style={{ color: "#2f855a" }}>
              🎉 Complaint Registered Successfully
            </h3>
            <p><strong>ID:</strong> {responseData.complaint_id}</p>
            <p><strong>Department:</strong> {responseData.predicted_department}</p>
            <p style={{ fontSize: 14 }}>{responseData.address}</p>

            <button
              style={styles.primaryButton}
              onClick={() => setResponseData(null)}
            >
              File Another Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "22px",
    fontWeight: "600",
  },
  section: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "600",
    display: "block",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    marginTop: "10px",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  video: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  preview: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },
  primaryButton: {
    width: "100%",
    padding: "12px",
    background: "#4c51bf",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    marginTop: "10px",
  },
  secondaryButton: {
    width: "100%",
    padding: "10px",
    background: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
  cancelButton: {
    width: "100%",
    padding: "10px",
    background: "#e53e3e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "5px",
  },
  successBox: {
    textAlign: "center",
  },
  successText: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#2f855a",
  },
};

export default ComplaintForm;
