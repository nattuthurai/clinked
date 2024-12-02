"use client";

import React, { useState, useEffect } from "react";
import { extractIdAndFriendlyName } from "../utils/extractData";
import { getUsersByGroupId } from "@/utils/getUsersByGroup";
import DropdownWithSearch from "./components/DropdownWithSearch";
import Select from "react-select";

export default function Home() {
  const [data, setData] = useState(null);
  const [sharedData, setSharedData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [dataDropdown, setDataDropdown] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

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
    const fetchData = async () => {
      try {
        const response = await fetch("/api/client");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const result = await response.json();
        const simplifiedData = extractIdAndFriendlyName(result);
        setDataDropdown(simplifiedData);
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
    //setSelectedOption(selected);
    setSelectedValue(event.target.value);
    console.log(selectedValue);

    //alert(event.target.value);

    const responseUser = await fetch(
      `/api/users?groupId=${event.target.value}`
    );
    if (!responseUser.ok) {
      throw new Error(`HTTP error! status: ${responseUser.status}`);
    }
    const resultUser = await responseUser.json();

    //console.log(resultUser);


    const extractedMembers = resultUser.memberDetails.map(member => ({
      userId: member.user.id,
      userName: member.user.name,
    }));

    setMembers(extractedMembers);

    console.log(extractedMembers);

    const response = await fetch(
      `/api/getSharedFolder?groupId=${event.target.value}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();


    setSharedData(result);
    //console.log(result);

    setLoading(true);
    setLoadData(true);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const dropdownStyles = {
    fontSize: "16px",
    padding: "10px 15px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    appearance: "none",
    outline: "none",
    transition: "border-color 0.3s ease-in-out",
    position: "relative",
  };

  const optionStyles = {
    padding: "10px",
    backgroundColor: "#fff",
    color: "#333",
    transition: "background-color 0.2s ease-in-out",
  };

  const dropdownHoverFocusStyles = {
    borderColor: "#0070f3", // Light blue border on hover/focus
  };

  const dropdownOptionHoverStyles = {
    backgroundColor: "#f0f0f0", // Highlight option on hover
  };

  return (
    <div>
      <label htmlFor="dropdown">
        <b>Clients:</b>{" "}
      </label>
      {/* <select id="dropdown" value={selectedValue} onChange={handleChange}>
        <option value="">-- Select --</option>
        {dataDropdown.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>   */}

      <select
        id="dropdown"
        value={selectedValue}
        onChange={handleChange}
        style={dropdownStyles}
        onFocus={(e) =>
          (e.target.style.borderColor = dropdownHoverFocusStyles.borderColor)
        }
        onBlur={(e) => (e.target.style.borderColor = "")}
      >
        <option value="" style={optionStyles}>
          -- Select --
        </option>
        {dataDropdown.map((item) => (
          <option
            key={item.value}
            value={item.value}
            style={optionStyles}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                dropdownOptionHoverStyles.backgroundColor)
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
          >
            {item.label}
          </option>
        ))}
      </select>

      <br/>

      <h2>Select Users</h2>
      <select value={selectedMember} onChange={handleChangeUser}>
        <option value="">-- Select a Member --</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      {/* <label htmlFor="dropdown">
        <b>Clients:</b>{" "}
      </label> */}
      {/* <DropdownWithSearch options={dataDropdown} /> */}
      {/* <Select
        options={dataDropdown}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Select an option..."
        isSearchable
      /> */}
       {/* /<h1>Groups</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>   */}
      <br />
      <h1>
        <b>Shared Folder Files</b>
      </h1>
      <br />
      {loadData ? (
        <table
          border="1"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "20px",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            textAlign: "left",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                File Name
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Size (Bytes)
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Uploaded By
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Last Modified
              </th>
            </tr>
          </thead>
          <tbody>
            {sharedData.items.map((item) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: item.id % 2 === 0 ? "#fff" : "#f6f6f6",
                  border: "1px solid #ddd",
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
        </table>
      ) : (
        !loading && <p>No data available.</p>
      )}
      {/* /<h1>Client Shared Folder</h1>
      <pre>{JSON.stringify(sharedData, null, 2)}</pre> */}
    </div>
  );
}
