"use client";
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function AuditTrail() {
  const [data, setData] = useState(null);
  const [sharedData, setSharedData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [dataDropdown, setDataDropdown] = useState([]);

  const [dataClientMapping, setDataClientMapping] = useState([]);
  const [dataClientName, setDataClientName] = useState([]);

  const [dataDropdownTaxPreparer, setDataDropdownTaxPreparer] = useState([]);
  const [dataDropdownTaxReviewer, setDataDropdownTaxReviewer] = useState([]);
  const [dataDropdownAccountManager, setDataDropdownAccountManager] = useState(
    []
  );
  const [
    dataDropdownAccountRepresentative,
    setDataDropdownAccountRepresentative,
  ] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedValue, setSelectedValue] = useState("Select Client");
  const [selectedValueTaxPreparer, setSelectedValueTaxPreparer] = useState(
    "Select Tax Preparer"
  );
  const [selectedValueTaxReviewer, setSelectedValueTaxReviewer] = useState(
    "Select Tax Reviewer"
  );
  const [selectedValueAccountManager, setSelectedValueAccountManager] =
    useState("Select Account Manager");
  const [
    selectedValueAccountRepresentative,
    setSelectedValueAccountRepresentative,
  ] = useState("Select Account Representative");

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("Select User");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [userName, setUserName] = useState("");

  const isWithinRange = (inputDate, startDate, endDate) => {
    const date = new Date(inputDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isUploadedBy = (userName) => {
    let returnValue = false;
    if (selectedMember == "Select User") {
      returnValue = true;
    } else if (userName == selectedMember) {
      returnValue = true;
    }
    return returnValue;
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

  const addUniqueDropdown = (dropdown, inc, item) => {
    const newEntry = { value: inc, label: item };

    // Check if the entry already exists in the array
    const exists = dropdown.some((entry) => entry.label === newEntry.label);

    if (!exists) {
      dropdown.push(newEntry);
    }

    return dropdown;
  };

  let filterItems = (mainData, name, stDate, endDate) => {
    return mainData.items.filter((item) => {
      const nameMatches = name ? item.uploaded.name === name : true;
      const dateMatches =
        stDate && endDate
          ? stDate < item.lastModified && endDate > item.lastModified
          : true;
      return nameMatches && dateMatches;
    });
  };

  useEffect(() => {
    //console.log("selectedValueTaxPreparer:" + selectedValueTaxPreparer);

    const filteredItems = dataClientMapping.filter((item) => {
      return (
        item.TaxPreparer.toLowerCase().includes(
          selectedValueTaxPreparer.toLowerCase()
        ) &&
        item.TaxReviewer.toLowerCase().includes(
          selectedValueTaxReviewer.toLowerCase()
        ) &&
        item.AccountManager.toLowerCase().includes(
          selectedValueAccountManager.toLowerCase()
        ) &&
        item.AccountRepresentative.toLowerCase().includes(
          selectedValueAccountRepresentative.toLowerCase()
        )
      );
    });

    // filteredItems.forEach((item) => {
    //   console.log(
    //     `TaxPreparer: ${item.TaxPreparer}, TaxReviewer: ${item.TaxReviewer}, AccountManager: ${item.AccountManager}, AccountRepresentative: ${item.AccountRepresentative}, ClientName: ${item.ClientName}`
    //   );
    // });

    const dropdownData = [];
    dataClientName.forEach((item) => {
      const filteredDataItems = filteredItems.filter(
        (itemClient) => itemClient.ClientName === item.friendlyName
      );

      if (filteredDataItems.length == 1) {
        //console.log(item.friendlyName.trim());
        dropdownData.push({ value: item.id, label: item.friendlyName });
      }
    });

    setDataDropdown(dropdownData);
  }, [
    selectedValueTaxPreparer,
    selectedValueTaxReviewer,
    selectedValueAccountManager,
    selectedValueAccountRepresentative,
  ]);

  useEffect(() => {
    // Fetch initial dropdown data
    const fetchData = async () => {
      try {
        const storedName = localStorage.getItem("UserName");
        //console.log("storedName"+storedName);
        setUserName(storedName);

        const responseClient = await fetch(`/api/getSharePointClientName`);
        if (!responseClient.ok) throw new Error(await responseClient.text());
        const dataClient = await responseClient.json();
        //console.log(dataClient.value);

        const response = await fetch("/api/client");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();

        setDataClientName(result);

        //setDataDropdown(
        //  result.map((item) => ({ value: item.id, label: item.friendlyName }))
        //);

        const dropdownDataTaxPreparer = [];
        const dropdownDataTaxReviewer = [];
        const dropdownDataAccountManager = [];
        const dropdownDataAccountRepresentative = [];

        const ConstructClientMapping = [];

        let inc = 1;
        dataClient.value.forEach((item) => {
          //dropdownDataTaxPreparer.push({ value: inc, label: item.fields?.TaxPreparer });
          //dropdownDataTaxReviewer.push({ value: inc, label: item.fields?.TaxReviewer });
          //dropdownDataAccountManager.push({ value: inc, label: item.fields?.AccountManager });
          //dropdownDataAccountRepresentative.push({ value: inc, label: item.fields?.AccountRepresentative });

          addUniqueDropdown(
            dropdownDataTaxPreparer,
            inc,
            item.fields?.TaxPreparer
          );
          addUniqueDropdown(
            dropdownDataTaxReviewer,
            inc,
            item.fields?.TaxReviewer
          );
          addUniqueDropdown(
            dropdownDataAccountManager,
            inc,
            item.fields?.AccountManager
          );
          addUniqueDropdown(
            dropdownDataAccountRepresentative,
            inc,
            item.fields?.AccountRepresentative
          );
          inc++;

          ConstructClientMapping.push({
            ClientName: item.fields?.ClientName,
            AccountManager: item.fields?.AccountManager,
            AccountRepresentative: item.fields?.AccountRepresentative,
            TaxPreparer: item.fields?.TaxPreparer,
            TaxReviewer: item.fields?.TaxReviewer,
          });
        });

        setDataClientMapping(ConstructClientMapping);

        //console.log("DataClientMapping" + dataClientMapping);
        //console.log(dropdownDataTaxPreparer);
        //console.log(dropdownDataTaxReviewer);
        //console.log(dropdownDataAccountManager);
        //console.log(dropdownDataAccountRepresentative);

        const dropdownData = [];
        result.forEach((item) => {
          //console.log("userName"+storedName+"item.friendlyName"+item.friendlyName);
          // const filteredItems = dataClient.value.filter(
          //   (itemClient) =>
          //     itemClient.fields?.TaxAssessorName === storedName &&
          //     itemClient.fields?.ClientName === item.friendlyName
          // );
          //if (filteredItems.length == 1) {
          //console.log(item.friendlyName.trim());
          dropdownData.push({ value: item.id, label: item.friendlyName });
          //}
        });

        setDataDropdown(dropdownData);
        setDataDropdownTaxPreparer(dropdownDataTaxPreparer);
        setDataDropdownTaxReviewer(dropdownDataTaxReviewer);
        setDataDropdownAccountManager(dropdownDataAccountManager);
        setDataDropdownAccountRepresentative(dropdownDataAccountRepresentative);

        setData(result);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeUser = (event) => {
    setSelectedMember(event.target.value);
  };

  const handleChange1 = (event) => {
    event.preventDefault();
    setSelectedValueTaxPreparer(event.target.value);
  };

  const handleChange2 = (event) => {
    event.preventDefault();
    setSelectedValueTaxReviewer(event.target.value);
  };

  const handleChange3 = (event) => {
    event.preventDefault();
    setSelectedValueAccountManager(event.target.value);
  };

  const handleChange4 = (event) => {
    event.preventDefault();
    setSelectedValueAccountRepresentative(event.target.value);
  };

  const handleReset = () => {
    setSelectedValue("Select Client");
    setSelectedMember("Select User");
    setError("");

    setSelectedValueTaxPreparer("Select Tax Preparer");
    setSelectedValueTaxReviewer("Select Tax Reviewer");
    setSelectedValueAccountManager("Select Account Manager");
    setSelectedValueAccountRepresentative("Select Account Representative");

    const today = new Date().toISOString().split("T")[0];
    setSelectedStartDate(today);
    setSelectedEndDate(today);
    setMembers([]);
    setSharedData([]);
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

  const handleChange = async (event) => {
    if (event.target.value != "") {
      setError("");
    }

    const selectedGroupId = event.target.value;
    setSelectedValue(selectedGroupId);
    setSelectedMember("Select User"); // Reset member dropdown
    setSharedData([]); // Clear shared folder data
    setMembers([]); // Clear members list
    setLoading(true);

    try {
      // Fetch members for the selected group
      const membersResponse = await fetch(
        `/api/users?groupId=${selectedGroupId}`
      );
      if (!membersResponse.ok) {
        throw new Error(
          `Failed to fetch members: ${membersResponse.statusText}`
        );
      }
      const membersResult = await membersResponse.json();
      const extractedMembers = membersResult.memberDetails.map((member) => ({
        id: member.user.id,
        name: member.user.name,
      }));
      setMembers(extractedMembers);
      setLoadData(false);

      //console.log("loadData:" + loadData);
    } catch (err) {
      //setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log("selectedValue:"+selectedValue);
    if (selectedValue === "Select Client") {
      setError("Please select a value from the clients dropdown.");
    } else {
      try {
        // Fetch shared folder data for the selected group
        //console.log("selectedValue:" + selectedValue);
        setError("");
        const sharedDataResponse = await fetch(
          `/api/getSharedFolder?groupId=${selectedValue}`
        );
        if (sharedDataResponse.ok) {
          const sharedDataResult = await sharedDataResponse.json();
          //console.log("sharedDataResult:");
          //setSharedData(sharedDataResult);

          //------------------------------------------------------------------------------------------------------
          let strStartDate = selectedStartDate;
          let strEndDate = selectedEndDate;
          let memeberName = null;

          const startDate = convertToTimestamp(strStartDate);
          const endDate = convertToTimestamp(strEndDate);

          if (selectedMember != "Select User") {
            memeberName = selectedMember;
          }

          const filteredItems = filterItems(
            sharedDataResult,
            memeberName,
            startDate,
            endDate
          );

          //console.log(filteredItems.length);
          if (filteredItems.length == 0) {
            setError("Search criteria don't have data");
            console.log(filteredItems.length);
          }
          setSharedData(filteredItems);
          //------------------------------------------------------------------------------------------------------

          setLoadData(true);
        } else {
          console.log("else ok");
        }
      } catch (err) {
        //setError(err.message);
        console.log(err.message);
      }
    }
  };

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen ">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {/* <aside className=" bg-gray-200 border-r w-64  ">
          <ul className="space-y-4 py-6 px-4 ">
            <li className="flex items-center space-x-2 ">
              <span>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                  />
                </svg>
              </span>
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2 	">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </span>
              <span>Clients</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </span>
              <span>Members</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </span>
              <span>Activity</span>
            </li>
            <li className="flex items-center space-x-2 text-sm">
              <span>Tools</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </span>
              <span>Tasks</span>
            </li>
            <li className="flex items-center space-x-2 text-sm">
              <span>Communication </span>
            </li>
            <li className="flex items-center space-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                  />
                </svg>
              </span>
              <span>Reachouts</span>
            </li>
            <li className="flex items-center space-x-2 text-sm">
              <span>Intelligence </span>
            </li>
            <li className="flex items-center space-x-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </span>
              <span>Audit Trail</span>
            </li>
          </ul>
        </aside> */}

        {/* Main Section */}
        <main className="flex-1 bg-gray-100 min-h-screen ">
          <div className=" mx-auto py-8 p-4 px-4">
            <div className="bg-gray-50 p-6 w-full rounded-lg shadow-md">
              <h2 className="text-2xl  font-bold mb-4 text-center">
                Audit Trail Report
              </h2>

              {/* Date Range */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date :
                  </label>
                  <div className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
                    <ReactDatePicker
                      selected={selectedStartDate}
                      onChange={(date) => setSelectedStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date :{" "}
                  </label>
                  {/* <div className="border border-black p-2.5 rounded-md"> */}
                  <div className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
                    <ReactDatePicker
                      selected={selectedEndDate}
                      onChange={(date) => setSelectedEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium pr-2">
                    Tax Preparer :
                  </label>{" "}
                  <select
                    id="dropdownTaxPreparer"
                    value={selectedValueTaxPreparer}
                    onChange={handleChange1}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Tax Preparer</option>
                    {Array.isArray(dataDropdownTaxPreparer) &&
                      dataDropdownTaxPreparer.map((item) => (
                        <option key={item.label} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium pr-2">
                    Tax Reviewer :
                  </label>
                  <select
                    id="dropdownTaxReviewer"
                    value={selectedValueTaxReviewer}
                    onChange={handleChange2}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Tax Reviewer</option>
                    {Array.isArray(dataDropdownTaxReviewer) &&
                      dataDropdownTaxReviewer.map((item) => (
                        <option key={item.label} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Manager :
                  </label>{" "}
                  <select
                    id="dropdownAccountManager"
                    value={selectedValueAccountManager}
                    onChange={handleChange3}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Account Manager</option>
                    {Array.isArray(dataDropdownAccountManager) &&
                      dataDropdownAccountManager.map((item) => (
                        <option key={item.label} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Account Representative :
                  </label>
                  <select
                    id="dropdown"
                    value={selectedValueAccountRepresentative}
                    onChange={handleChange4}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Account Representative</option>
                    {Array.isArray(dataDropdownAccountRepresentative) &&
                      dataDropdownAccountRepresentative.map((item) => (
                        <option key={item.label} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Clients :
                  </label>{" "}
                  <select
                    id="dropdown"
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
                  <label className="block text-sm font-medium mb-1">
                    Users :
                  </label>
                  <select
                    id="dropdown"
                    value={selectedMember}
                    onChange={handleChangeUser}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select User</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </div>
              <div className="flex justify-between   mt-6">
                {" "}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-1/6 mx-auto  p-2 bg-pink-900 text-white font-bold py-2 px-4 rounded-lg   hover:bg-pink-700 mr-2"
                >
                  Show result
                </button>
                <button
                  type="submit"
                  onClick={handleReset}
                  className="w-1/6 mx-auto bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 ml-2"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white mt-1 ml-4 mr-4 p-6 rounded-lg shadow-md">
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
                        Uploaded By
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Last Modified
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
                          backgroundColor:
                            item.id % 2 === 0 ? "#fff" : "#f6f6f6",
                          border: "1px solid #ddd",
                        }}
                      >
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {item.friendlyName || "N/A"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {formatSize(item.size) || "N/A"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {item.uploaded?.name || "Unknown"}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {formatDate(item.lastModified)}
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
        </main>
      </div>
    </div>
  );
}
