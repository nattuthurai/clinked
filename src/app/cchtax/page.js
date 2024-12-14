'use client';
import { useState } from 'react';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    try {
      const response = await fetch('/api/getAccessToken', {
        method: 'POST',
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  return (
    <div>
      <h1>Authenticate with CCH Axcess API</h1>
      <button onClick={handleAuth}>Authenticate</button>

      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
