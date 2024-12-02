"use client";
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AuditTrail() {
  const [data, setData] = useState(null);
  const [sharedData, setSharedData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [dataDropdown, setDataDropdown] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("Select User");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

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

  useEffect(() => {
    // Fetch initial dropdown data
    const fetchData = async () => {
      try {
        const response = await fetch("/api/client");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();
        setDataDropdown(
          result.map((item) => ({ value: item.id, label: item.friendlyName }))
        );
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeUser = (event) => {
    setSelectedMember(event.target.value);
  };

  const handleChange = async (event) => {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error on submission

    try {
      // Fetch shared folder data for the selected group
      const sharedDataResponse = await fetch(
        `/api/getSharedFolder?groupId=${selectedValue}`
      );
      if (sharedDataResponse.ok) {
        const sharedDataResult = await sharedDataResponse.json();
        //console.log(sharedDataResult);
        setSharedData(sharedDataResult);
        setLoadData(true);
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-white-100 py-4 px-6 border-b">
        <div className="shrink-0">
          <img className="w-{20},h-{10} " src="logo.jpg" alt="Your Company" />
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>

          <input type="text" placeholder="Search" className="border:none" />
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {/* Placeholder for user icon */}
            <span className="text-sm font-bold">SK</span>
          </div>
        </div>
      </header>
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 border-r">
          <ul className="space-y-4 py-6 px-4">
            <li className="flex items-center space-x-2">
              <span>📊</span>
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>👤</span>
              <span>Clients</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>👥</span>
              <span>Members</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>🔔</span>
              <span>Activity</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>🛠</span>
              <span>Tasks</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>🗨</span>
              <span>Reachouts</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>📈</span>
              <span>Audit Trail</span>
            </li>
          </ul>
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-6">
          <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
          <div className="bg-white p-6 rounded-md shadow-md space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-bg font-bold">Date Range</label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium">
                    Start date
                  </label>
                  <div className="border border-black p-2.5 rounded-md">
                    <ReactDatePicker
                      selected={selectedStartDate}
                      onChange={(date) => setSelectedStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium">End date</label>
                  <div className="border border-black p-2.5 rounded-md">
                    <ReactDatePicker
                      selected={selectedEndDate}
                      onChange={(date) => setSelectedEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdowns */}
            {/* {["Clients", "Users"].map((label) => (
              <div key={label} className="flex items-center space-x-4 mt-2">
                <label className="block text-bg font-bold">{label}</label>
                <select className="w-half border px-3 py-1 mt-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300">
                  <option>${label.toLowerCase()}</option>
                </select>
              </div>
            ))} */}
            <div className="flex items-center space-x-4 mt-2">
              <label className="block text-bg font-bold">Clients:</label>

              <select
                id="dropdown"
                value={selectedValue}
                onChange={handleChange}
                className="w-half border px-3 py-1 mt-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Client</option>
                {dataDropdown.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4 mt-2">
              <label className="block text-bg font-bold">Users:</label>
              <select
                id="dropdown"
                value={selectedMember}
                onChange={handleChangeUser}
                className="w-half border px-3 py-1 mt-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-half justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Show result
              </button>
              <button
                type="submit"
                className="flex w-half justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset
              </button>
            </div>
          </div>
          <br />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
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
                </tr>
              </thead>

              <tbody>
                {sharedData?.items?.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: item.id % 2 === 0 ? "#fff" : "#f6f6f6",
                      border: "1px solid #ddd",
                      //display:isWithinRange(item.lastModified,selectedStartDate,selectedEndDate)==true?"table-row":"none" || isUploadedBy(item.uploaded?.name) == true? "table-row": "none",
                      //display:isWithinRange(item.lastModified,selectedStartDate,selectedEndDate)==true?"table-row":"none",
                      //display:isUploadedBy(item.uploaded?.name) == true? "table-row": "none",
                    }}
                  >
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.friendlyName || "N/A"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatSize(item.size) || "N/A"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.uploaded?.name || "Unknown"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatDate(item.lastModified)}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* <tbody>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                </tr>

              </tbody> */}
            </table>
          </div>
        </main>
      </div>
         
    </div>
  );
}
