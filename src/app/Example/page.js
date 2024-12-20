"use client";
import React from 'react';
import { useState } from 'react';

const page = () => {

    const [selectedText, setSelectedText] = useState('');

    const handleChange = (e) => {
      setSelectedText(e.target.options[e.target.selectedIndex].text);
    };

  return (
    <div>
    <label htmlFor="options">Choose an option:</label>
    <select id="options" onChange={handleChange}>
      <option value="" disabled>Select an option</option>
      <option value="1">Option A</option>
      <option value="2">Option B</option>
      <option value="3">Option C</option>
    </select>

    <p>You selected: {selectedText}</p>
  </div>
  )
}

export default page
