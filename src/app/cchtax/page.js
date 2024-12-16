"use client";
import { useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const [batchItems, setBatchItems] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle the file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");

      const response = await fetch("/api/fileUpload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      setUploadStatus(
        `File uploaded successfully! Response: ${JSON.stringify(result)}`
      );
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  const handleAuth = async () => {
    try {
      let filterInfo = "TaxYear eq '2023'";
      const response = await fetch(`/api/getAccessToken?filter=${filterInfo}`, {
        method: "GET",
      });

      const result = await response.json();

      /*const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded_file";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();*/

      // console.log("result" + result);

      setData(result);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Upload a File</h1>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />
      <br />
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
      <p style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {uploadStatus}
      </p>

      <h1>Authenticate with CCH Axcess API</h1>
      <button onClick={handleAuth} style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}>Authenticate</button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
