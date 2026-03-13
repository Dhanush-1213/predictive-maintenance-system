import { useState } from "react";
import API from "../services/api";
import HealthCard from "../components/HealthCard";
import MachineTable from "../components/MachineTable";
import AlertCard from "../components/AlertCard";
import SensorChart from "../components/SensorChart";

function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleData = [
    {
      Air_temperature_K: 300,
      Process_temperature_K: 310,
      Rotational_speed_rpm: 1500,
      Torque_Nm: 45,
      Tool_wear_min: 120,
    },
    {
      Air_temperature_K: 306,
      Process_temperature_K: 315,
      Rotational_speed_rpm: 1350,
      Torque_Nm: 58,
      Tool_wear_min: 220,
    },
    {
      Air_temperature_K: 302,
      Process_temperature_K: 311,
      Rotational_speed_rpm: 1420,
      Torque_Nm: 52,
      Tool_wear_min: 180,
    },
    {
      Air_temperature_K: 308,
      Process_temperature_K: 316,
      Rotational_speed_rpm: 1300,
      Torque_Nm: 60,
      Tool_wear_min: 240,
    },
  ];

  const runPredictions = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        sampleData.map((item) => API.post("/predict", item))
      );
      setMachines(results.map((res) => res.data));
    } catch (error) {
      console.error("Prediction error:", error);
    }
    setLoading(false);
  };

  const healthyCount = machines.filter((m) => m.health_status === "Healthy").length;
  const warningCount = machines.filter((m) => m.health_status === "Warning").length;
  const criticalCount = machines.filter((m) => m.health_status === "Critical").length;

  const alerts = machines.filter(
    (m) => m.health_status === "Warning" || m.health_status === "Critical"
  );

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "8px", color: "#0f172a" }}>
          Dashboard
        </h1>
        <p style={{ color: "#64748b", margin: 0 }}>
          Monitor machine health, review failure risk, and inspect maintenance alerts.
        </p>
      </div>

      <button
        onClick={runPredictions}
        style={{
          padding: "12px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "24px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Running..." : "Run Sample Predictions"}
      </button>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <HealthCard title="Total Machines" value={machines.length} />
        <HealthCard title="Healthy" value={healthyCount} />
        <HealthCard title="Warning" value={warningCount} />
        <HealthCard title="Critical" value={criticalCount} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <SensorChart machines={machines} />

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Recent Alerts</h2>
          {alerts.length === 0 ? (
            <p style={{ color: "#64748b" }}>No alerts yet. Run predictions first.</p>
          ) : (
            alerts.map((machine, index) => (
              <AlertCard key={index} machine={machine} index={index} />
            ))
          )}
        </div>
      </div>

      <MachineTable machines={machines} />
    </div>
  );
}

export default Dashboard;