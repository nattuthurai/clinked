"use client";
import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dataDropdown, setDataDropdown] = useState([]);
  const [dataYearDropdown, setDataYearDropdown] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("Select Client");
  const [selectedYearValue, setSelectedYearValue] = useState("Select Year");
  const [selectedText, setSelectedText] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = async (event) => {
    const selectedGroupId = event.target.value;
    setSelectedValue(selectedGroupId);
    if (event.target && event.target.options) {
      setSelectedText(event.target.options[event.target.selectedIndex].text);
    }
  };

  const handleYearChange = async (event) => {
    const selectedYear = event.target.value;
    setSelectedYearValue(selectedYear);
    console.log("selectedYear:" + selectedYear);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseClient = await fetch(`/api/getCCHClientDetails`);
        if (!responseClient.ok) throw new Error(await responseClient.text());
        const dataClient = await responseClient.json();
        console.log(dataClient.value);

        const dropdownData = [];
        const dropdownYearData = [];

        dataClient.value.forEach((item) => {
          //console.log("ClientID:"+item.fields?.ClientID);
          //console.log("ClientName:"+item.fields?.ClientName);
          //console.log("ClientType:"+item.fields?.ClientType);
          //console.log("Year:"+item.fields?.Year);

          dropdownData.push({
            value: item.fields?.ClientID,
            label: item.fields?.ClientName,
          });
        });

        setDataDropdown(dropdownData);

        dropdownYearData.push(
          {
            value: "2020",
            label: "2020",
          },
          {
            value: "2021",
            label: "2021",
          },
          {
            value: "2022",
            label: "2022",
          },
          {
            value: "2023",
            label: "2023",
          },
          {
            value: "2024",
            label: "2024",
          }
        );

        setDataYearDropdown(dropdownYearData);
      } catch (error) {
      } finally {
      }
    };
    fetchData();
  }, []);

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
      //let filterInfo = "TaxYear eq '2023'";
      let filterInfo = `TaxYear eq '${selectedYearValue}' and ClientID eq '${selectedValue}'`;
      let query = `'${selectedYearValue}'|'${selectedValue}'|'${selectedText}'`;
      const response = await fetch(
        `/api/getAccessToken?filter=${filterInfo}&query=${query}`,
        {
          method: "GET",
        }
      );

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
    <div
      className="container"
      style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}
    >

      <div>
        <label className="block text-sm font-medium mb-1">Clients :</label>{" "}
        <select
          id="option"
          value={selectedValue}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Select Client</option>
          {dataDropdown.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Year :</label>{" "}
        <select
          id="dropdownYear"
          value={selectedYearValue}
          onChange={handleYearChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Select Year</option>
          {dataYearDropdown.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAuth}
        disabled={loading}
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
        {loading ? "Processing..." : "Print Files"}
      </button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Spinner component */}
      {loading && <PuffLoader color="#0070f3" size={60} />}
    </div>
  );
}
