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

      console.log("1");
      //const result = await response.json();
      console.log("2");
      const blob = await response.blob();
      console.log("3");
      const downloadUrl = window.URL.createObjectURL(blob);
      console.log("4");
      const link = document.createElement("a");
      console.log("5");
      link.href = downloadUrl;
      console.log("6");
      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers.get("Content-Disposition");
      console.log("7");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded_file";
      console.log("8");
      link.download = fileName;
      console.log("9");
      document.body.appendChild(link);
      console.log("10");
      link.click();
      console.log("11");
      link.remove();
      console.log("12");

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
