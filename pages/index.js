import { useState } from 'react';

export default function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);

  const dummyData = [
    { from: 'Stockholm', to: 'Berlin', time: '17h 30min', transfers: 3 },
    { from: 'Paris', to: 'Rome', time: '11h 15min', transfers: 0 },
    { from: 'Madrid', to: 'Amsterdam', time: '14h 45min', transfers: 2 },
    { from: 'Oslo', to: 'Copenhagen', time: '8h 10min', transfers: 1 },
    { from: 'Berlin', to: 'Prague', time: '4h 00min', transfers: 0 },
    { from: "Stockholm", to: "Copenhagen", duration: "5h", transfers: 0 },
{ from: "Berlin", to: "Amsterdam", duration: "6h", transfers: 1 },
{ from: "Paris", to: "Barcelona", duration: "6h30m", transfers: 1 },
{ from: "Copenhagen", to: "Hamburg", duration: "4h30m", transfers: 0 },
{ from: "Zurich", to: "Milan", duration: "3h45m", transfers: 0 },
{ from: "London", to: "Brussels", duration: "2h", transfers: 0 },
  ];

  const handleSearch = () => {
    const filtered = dummyData.filter(
      (route) =>
        route.from.toLowerCase().includes(from.toLowerCase()) &&
        route.to.toLowerCase().includes(to.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🚄 GoByTrain</h1>
      <p>Find your best train route across Europe.</p>

      <input
        type="text"
        placeholder="From..."
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <input
        type="text"
        placeholder="To..."
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: '2rem' }}>
        {results.length === 0 && <p>No routes found.</p>}
        {results.map((route, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <strong>
              {route.from} → {route.to}
            </strong>
            <br />
            Duration: {route.time}
            <br />
            Transfers: {route.transfers}
          </div>
        ))}
      </div>
    </div>
  );
}
