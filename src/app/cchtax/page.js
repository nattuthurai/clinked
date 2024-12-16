"use client";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

      setLoading(true); // Show spinner when the operation starts
      let filterInfo = "TaxYear eq '2023'";
      const response = await fetch(`/api/getAccessToken?filter=${filterInfo}`, {
        method: "GET",
      });

      const result = await response.json();
      setData(result);
      setLoading(false); // Hide spinner when the operation finishes
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

      
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      {/* <h1>Upload a File</h1>
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
      </p> */}

      <h1>Upload files from CCH to Clinked</h1>
      <button onClick={handleAuth} disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#aaa" : "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          marginBottom: "1rem",
        }}
      >
        {loading ? "Processing..." : "Upload Files"}</button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      {error && <p style={{ color: "red" }}>{error}</p>}

       {/* Spinner component */}
       {loading && <PuffLoader color="#0070f3" size={60} />}
    </div>
  );
}
