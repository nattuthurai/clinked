// app/page.js
'use client';

import { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function Home() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = async (date) => {
    setLoading(true);
    setError(null);

    const formattedDate = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`/api/audit?dateStart=${formattedDate}`,{
        headers: {
          Authorization: `Bearer ${process.env.API_SECRET}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch audit data');
      }

      const data = await response.json();
      setAuditData(data?.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);


  return (
    <div style={{ padding: '20px' }}>
      <h1>Audit Log</h1>
      <div className='mb-4 flex items-center'>
        <label>Select Date: </label>
        <div className='border border-black p-2.5 rounded-md'>
          <ReactDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {auditData.length > 0 ? (
        <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((item,index) => {
              const {name,email,username } = item?.user || {};
              return (
                <tr key={index}>
                  <td className='text-center'>{username}</td>
                  <td className='text-center'>{name}</td>
                  <td className='text-center'>{email}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        !loading && <p>No data available for the selected date.</p>
      )}
    </div>
  );
}
