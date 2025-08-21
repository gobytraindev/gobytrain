export default function Home() {
  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        🚄 GoByTrain
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#555" }}>
        Find your best train route across Europe.
      </p>
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <input type="text" placeholder="From..." style={inputStyle} />
        <input type="text" placeholder="To..." style={inputStyle} />
        <button style={buttonStyle}>Search</button>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "1rem"
};

const buttonStyle = {
  padding: "0.5rem 1.2rem",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#0070f3",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer"
};
