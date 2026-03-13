import { useState } from "react";
import API from "../services/api";

function UploadData() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadCSV = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/predict-batch", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.predictions);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "20px", color: "#0f172a" }}>Upload Sensor Data</h1>
        <p style={{ color: "#64748b", margin: 0 }}>
          Upload a CSV file to run batch predictions on machine sensor data.
        </p>
      </div>

      <div
        style={{
          background: "#83afdb",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <input type="file" accept=".csv" onChange={handleFileChange} />

        <button
          onClick={uploadCSV}
          style={{
            marginLeft: "12px",
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Upload & Predict
        </button>
      </div>

      {results.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Batch Predictions</h2>

          <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th align="left">Row</th>
                <th align="left">Risk Score</th>
                <th align="left">Status</th>
                <th align="left">Prediction</th>
              </tr>
            </thead>

            <tbody>
              {results.map((row) => (
                <tr key={row.row_id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td>{row.row_id}</td>
                  <td>{row.risk_score}</td>
                  <td>{row.health_status}</td>
                  <td>{row.failure_prediction === 1 ? "Failure Risk" : "Healthy"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UploadData;