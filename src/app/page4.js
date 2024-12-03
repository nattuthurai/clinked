"use client";

import React, { useState, useEffect } from "react";
import { extractIdAndFriendlyName } from "../utils/extractData";
import { getUsersByGroupId } from "@/utils/getUsersByGroup";
import DropdownWithSearch from "./components/DropdownWithSearch";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      <label>Select Start Date: </label>
      <div className="border border-black p-2.5 rounded-md">
        <ReactDatePicker
          selected={selectedStartDate}
          onChange={(date) => setSelectedStartDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <br />
      <label>Select End Date: </label>
      <div className="border border-black p-2.5 rounded-md">
        <ReactDatePicker
          selected={selectedEndDate}
          onChange={(date) => setSelectedEndDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <br />
      <label htmlFor="dropdown">
        <b>Clients:</b>{" "}
      </label>
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
            Select Client
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
      <br />
      <br />
      <label htmlFor="dropdown">
        <b>Users:</b>{" "}
      </label>
      &nbsp;&nbsp;
      <select
        id="dropdown"
        value={selectedMember}
        onChange={handleChangeUser}
        style={dropdownStyles}
        onFocus={(e) =>
          (e.target.style.borderColor = dropdownHoverFocusStyles.borderColor)
        }
        onBlur={(e) => (e.target.style.borderColor = "")}
      >
        <option value="" style={optionStyles}>
          Select User
        </option>
        {members.map((member) => (
          <option
            key={member.id}
            value={member.name}
            style={optionStyles}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                dropdownOptionHoverStyles.backgroundColor)
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
          >
            {member.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button
        type="submit"
        onClick={handleSubmit}
        style={{
          backgroundColor: "#0070f3", // Primary color (blue)
          color: "#fff", // White text
          border: "none", // No border
          padding: "10px 20px", // Space inside the button
          borderRadius: "8px", // Rounded corners
          fontSize: "16px", // Font size
          fontWeight: "bold", // Bold text
          cursor: "pointer", // Pointer cursor on hover
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth hover effect
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")} // Darker blue on hover
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#0070f3")} // Reset to original color
        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")} // Click effect (shrink)
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")} // Reset after click
      >
        {" "}
        Submit
      </button>
      {/* /<h1>Groups</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>   */}
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
        </table>
      ) : (
        !loading && <p>No data available.</p>
      )}
      {/* /<h1>Client Shared Folder</h1>
      <pre>{JSON.stringify(sharedData, null, 2)}</pre> */}
    </div>
  );
}
