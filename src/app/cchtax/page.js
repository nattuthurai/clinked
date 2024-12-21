"use client";
import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import Image from "next/image";

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
  const [sharedData, setSharedData] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Helper function to format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  // Convert `lastModified` from epoch to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"; // Handle undefined timestamps
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const convertToTimestamp = (dateStr) => {
    try {
      const date = new Date(dateStr); // Parse the date string
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return date.getTime(); // Get the timestamp in milliseconds
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleChange = async (event) => {
    const selectedGroupId = event.target.value;
    setSelectedValue(selectedGroupId);
    if (event.target && event.target.options) {
      setSelectedText(event.target.options[event.target.selectedIndex].text);
    }
  };

  const handleDownload = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/fileDownload?groupID=${selectedValue}&fileID=${event.target.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to download the file");
      }

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
    } catch (err) {
      //setError(err.message);
      console.error("Error downloading file:", err);
    } finally {
    }
  };

  const handleYearChange = async (event) => {
    const selectedYear = event.target.value;
    setSelectedYearValue(selectedYear);
    console.log("selectedYear:" + selectedYear);
  };

  const FetchTaxFolder = async () => {
    setLoading(true); // Show spinner when the operation starts
    let query = `'${selectedYearValue}'|'${selectedValue}'|'${selectedText}'`;
    const taxDataResponse = await fetch(`/api/getTaxFolder?query=${query}`);
    if (taxDataResponse.ok) {
      const taxDataResult = await taxDataResponse.json();
      setSharedData(taxDataResult);
      console.log("taxDataResult:" + taxDataResult);
    }
    setLoading(false); // Hide spinner when the operation finishes
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
      setLoading(false); // Hide spinner when the operation finishes
      FetchTaxFolder();
      setData(result);

      // console.log("result" + result);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  const handleFetch = async () => {
    FetchTaxFolder();
  };

  return (
    <main className="flex-1 bg-gray-100 min-h-screen ">
      <div className=" mx-auto py-8 p-4 px-4">
        <div className="bg-gray-50 p-6 w-full  rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold   mb-1">
                Clients :
              </label>{" "}
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
              <label className="block text-sm font-bold mb-1">Year :</label>{" "}
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
            <div className="col-span-2 flex justify-center gap-4 mt-4">
              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-48 py-2.5 px-5 bg-pink-900 text-white font-bold focus:outline-none rounded-lg border border-gray-200 hover:bg-pink-700 focus:ring-4 focus:ring-gray-100"
              >
                {loading ? "Processing..." : "Print Files"}
              </button>

              <button
                onClick={handleFetch}
                className="w-48 py-2.5 px-5 bg-pink-900 text-white font-bold focus:outline-none rounded-lg border border-gray-200 hover:bg-pink-700 focus:ring-4 focus:ring-gray-100"
              >
                {loading ? "Processing..." : "Fetch Files"}
              </button>
            </div>
          </div>

          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {/* Spinner component */}
          {loading && <PuffLoader color="#0070f3" size={60} />}
        </div>
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left text-sm">
              {sharedData.length > 0 && (
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      File Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Size (Bytes)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Download
                    </th>
                  </tr>
                </thead>
              )}

              <tbody>
                {sharedData &&
                  sharedData?.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: item.id % 2 === 0 ? "#fff" : "#f6f6f6",
                        border: "1px solid #ddd",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {item.fileName || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {formatSize(item.size) || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src="/download.png"
                          alt="Download"
                          width={24}
                          height={24}
                          id={item.id}
                          onClick={handleDownload}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
