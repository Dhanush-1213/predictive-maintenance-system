function AlertCard({ machine, index }) {
  const isCritical = machine.health_status === "Critical";
  const bg = isCritical ? "#fee2e2" : "#fef3c7";
  const border = isCritical ? "#dc2626" : "#d97706";

  return (
    <div
      style={{
        background: bg,
        borderLeft: `6px solid ${border}`,
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "12px",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0" }}>Machine-{index + 1}</h4>
      <p style={{ margin: "4px 0" }}>
        <strong>Status:</strong> {machine.health_status}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Risk Score:</strong> {machine.risk_score}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>Recommendation:</strong> {machine.recommendation}
      </p>
    </div>
  );
}

export default AlertCard;