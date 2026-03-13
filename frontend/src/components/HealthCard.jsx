function HealthCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        minWidth: "220px",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "15px",
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          margin: "12px 0 0",
          color: "#0f172a",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default HealthCard;