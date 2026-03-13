function MachineTable({ machines }) {
  const getStatusColor = (status) => {
    if (status === "Critical") return "#dc2626";
    if (status === "Warning") return "#d97706";
    return "#16a34a";
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginTop: "20px",
      }}
    >
      <h2>Machine Predictions</h2>
      <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th align="left">Machine</th>
            <th align="left">Risk Score</th>
            <th align="left">Status</th>
            <th align="left">Prediction</th>
            <th align="left">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td>Machine-{index + 1}</td>
              <td>{machine.risk_score}</td>
              <td style={{ color: getStatusColor(machine.health_status), fontWeight: "bold" }}>
                {machine.health_status}
              </td>
              <td>{machine.failure_prediction === 1 ? "Failure Risk" : "Healthy"}</td>
              <td>{machine.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MachineTable;