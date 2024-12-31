"use client";
import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import Image from "next/image";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [dataDropdown, setDataDropdown] = useState([]);
  const [dataYearDropdown, setDataYearDropdown] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("Select Client");
  const [selectedYearValue, setSelectedYearValue] = useState("Select Year");
  const [selectedText, setSelectedText] = useState("");
  const [sharedData, setSharedData] = useState([]);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    text: "",
  });

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
      //console.log(event.target.options[event.target.selectedIndex].text);
    }
  };

  const handleDownload = async (event) => {
    event.preventDefault();
    setLoading3(true); // Show spinner when the operation starts
    try {
      const response = await fetch(
        `/api/cchFileDownload?clientName=${selectedText}&fileID=${event.target.id}`
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
      setLoading3(false); // Hide spinner when the operation finishes
    }
  };

  const handleYearChange = async (event) => {
    const selectedYear = event.target.value;
    setSelectedYearValue(selectedYear);
    console.log("selectedYear:" + selectedYear);
  };

  const FetchTaxFolder = async () => {
    setLoading2(true); // Show spinner when the operation starts
    let query = `'${selectedYearValue}'|'${selectedValue}'|'${selectedText}'`;
    const taxDataResponse = await fetch(`/api/getTaxFolder?query=${query}`);
    if (taxDataResponse.ok) {
      const taxDataResult = await taxDataResponse.json();
      setSharedData(taxDataResult);
      //console.log("taxDataResult:" + taxDataResult);
    }
    setLoading2(false); // Hide spinner when the operation finishes
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const responseClient = await fetch(`/api/getCCHClientDetails`);
        // if (!responseClient.ok) throw new Error(await responseClient.text());
        // const dataClient = await responseClient.json();
        // console.log(dataClient.value);

        // const responseSalesForce = await fetch(`/api/getSalesForce`);
        // if (!responseSalesForce.ok)
        //   throw new Error(await responseSalesForce.text());
        // const dataResponseSalesForce = await responseSalesForce.json();

        const response = await fetch("/api/client");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();

        const dropdownData = [];
        const dropdownYearData = [];

        result.forEach((item) => {
          dropdownData.push({ value: item.id, label: item.friendlyName });
        });
        // dataClient.value.forEach((item) => {
        //   dropdownData.push({
        //     value: item.fields?.ClientID,
        //     label: item.fields?.ClientName,
        //   });
        // });

        // dataResponseSalesForce.records.forEach((item) => {
        //   const efmClientNumber = item.EFM_Client_Number__c
        //     ? parseInt(item.EFM_Client_Number__c, 10)
        //     : "N/A";
        //   let clinkedClientName = item.Name + " - " + efmClientNumber;
        //   dropdownData.push({
        //     value: item.EFM_Client_Number__c,
        //     label: clinkedClientName,
        //   });
        // });

        setDataDropdown(dropdownData);
        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year >= currentYear - 10; year--) {
          dropdownYearData.push({
            value: year.toString(),
            label: year.toString(),
          });
        }

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

  const getValueAfterHyphen = (str) => {
    const parts = str.split("-");
    return parts.length > 1 ? parts[1].trim() : "";
  };

  const cleanString = (str) => {
    return str.replace(/["\\]/g, "");
  };

  const handlePrint = async () => {
    if (selectedValue === "Select Client") {
      setError("Please select a value from the clients dropdown.");
    } else if (selectedYearValue === "Select Year") {
      setError("Please select a value from the years dropdown.");
    } else {
      try {
        setError("");
        setLoading1(true); // Show spinner when the operation starts

        let strClientID = getValueAfterHyphen(selectedText);

        let filterInfo = `TaxYear eq '${selectedYearValue}' and ClientID eq '${strClientID}'`;
        let query = `'${selectedYearValue}'|'${selectedValue}'|'${selectedText}'`;

        console.log("filterInfo:" + filterInfo);
        console.log("query:" + query);

        const response = await fetch(
          `/api/getAccessToken?filter=${filterInfo}&query=${query}`,
          {
            method: "GET",
          }
        );

        const result = await response.json();

        let outputResult = JSON.stringify(result);
        const splitString = outputResult.split("!");
        if (splitString.length > 1) {
          setData(cleanString(splitString[0]));
          let strClientType = splitString[1];
          let strTaxReturn = "";
          if (strClientType == "INDIVIDUAL") {
            strTaxReturn = "04_tax_returns";
          } else {
            strTaxReturn = "10_tax_returns";
          }

          let clinkedURL = "https://efm.clinked.app/groups/";

          let clientNameURL = selectedText
            .toLowerCase() // Convert to lowercase
            .replace(/ - /g, "___") // Replace space-hyphen-space with triple underscores
            .replace(/ /g, "_"); // Replace spaces with underscores

          let url =
            clinkedURL +
            clientNameURL +
            "/files/" +
            strTaxReturn +
            "-" +
            selectedYearValue;
          console.log("url:" + url);

          const formEmailData = {
            to: "thuraiit@gmail.com",
            subject: "Documents have been printed successfully",
            html: `Documents have been printed successfully. You can view it here: <a href="${url}" target="_blank">click here</a>`,
          };

          const responseEmail = await fetch("/api/sendEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formEmailData),
          });

          const resultEmail = await responseEmail.json();
          if (responseEmail.ok) {
            console.log("Email sent successfully!");
          } else {
            console.log(`Error: ${resultEmail.message}`);
          }
        } else {
          setData(result);
        }
        setLoading1(false); // Hide spinner when the operation finishes
        FetchTaxFolder();
      } catch (err) {
        setError("Failed to fetch data");
      }
    }
  };

  const handleFetch = async () => {
    /*const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Email sent successfully!");
    } else {
      console.log(`Error: ${result.message}`);
    }

    
    let url =
      "https://efm.clinked.app/groups/gebco_enterprises_llc___968/files/10_tax_returns-2024";

    const formEmailData = {
      to: "thuraiit@gmail.com",
      subject: "Documents have been printed successfully",
      html: `Documents have been printed successfully. You can view it here: <a href="${url}" target="_blank">click here</a>`,
    };

    const responseEmail = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEmailData),
    });

    const resultEmail = await responseEmail.json();
    if (responseEmail.ok) {
      console.log("Email sent successfully!");
    } else {
      console.log(`Error: ${resultEmail.message}`);
    }

*/

    if (selectedValue === "Select Client") {
      setError("Please select a value from the clients dropdown.");
    } else if (selectedYearValue === "Select Year") {
      setError("Please select a value from the years dropdown.");
    } else {
      setError("");
      FetchTaxFolder();
    }
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
                onClick={handlePrint}
                disabled={loading1}
                className="w-48 py-2.5 px-5 bg-pink-900 text-white font-bold focus:outline-none rounded-lg border border-gray-200 hover:bg-pink-700 focus:ring-4 focus:ring-gray-100"
              >
                {loading1 ? "Processing..." : "Print Files"}
              </button>

              <button
                onClick={handleFetch}
                disabled={loading2}
                className="w-48 py-2.5 px-5 bg-pink-900 text-white font-bold focus:outline-none rounded-lg border border-gray-200 hover:bg-pink-700 focus:ring-4 focus:ring-gray-100"
              >
                {loading2 ? "Processing..." : "Fetch Files"}
              </button>
            </div>
          </div>

          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {/* Spinner component */}
          {loading1 && <PuffLoader color="#0070f3" size={60} />}
          {loading2 && <PuffLoader color="#0070f3" size={60} />}
          {loading3 && <PuffLoader color="#0070f3" size={60} />}
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
