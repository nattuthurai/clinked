"use client";
import { useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [batchItems, setBatchItems] = useState([]);

  const handleAuth = async () => {
    try {
      let filterInfo = "TaxYear eq '2023'";
      const response = await fetch(`/api/getAccessToken?filter=${filterInfo}`, {
        method: "GET",
      });

      //const result = await response.json();
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded_file";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // console.log("result" + result);

      //setData(result);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div>
      <h1>Authenticate with CCH Axcess API</h1>
      <button onClick={handleAuth}>Authenticate</button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
