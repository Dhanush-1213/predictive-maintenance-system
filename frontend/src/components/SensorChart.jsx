import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SensorChart({ machines }) {
  const chartData = machines.map((machine, index) => ({
    name: `M-${index + 1}`,
    risk: machine.risk_score,
  }));

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
      <h2>Failure Risk by Machine</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="risk" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SensorChart;