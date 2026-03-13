import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Metrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await API.get("/metrics");
        setMetrics(res.data);
      } catch (error) {
        console.error("Failed to load metrics:", error);
      }
    };

    loadMetrics();
  }, []);

  if (!metrics) {
    return <p style={{ padding: "30px" }}>Loading metrics...</p>;
  }

  const featureData = metrics.feature_importance
    ? Object.entries(metrics.feature_importance).map(([name, value]) => ({
        name,
        importance: Number((value * 100).toFixed(2)),
      }))
    : [];

  return (
    <div style={{ padding: "30px", background: "#83afdb", minHeight: "100vh" }}>
      <h1>Model Performance Metrics</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <MetricCard title="Accuracy" value={metrics.accuracy} />
        <MetricCard title="Precision" value={metrics.precision} />
        <MetricCard title="Recall" value={metrics.recall} />
        <MetricCard title="F1 Score" value={metrics.f1_score} />
        <MetricCard title="ROC-AUC" value={metrics.roc_auc} />
      </div>

      <div
        style={{
          background: "#fff",
          marginTop: "30px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Feature Importance</h2>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={featureData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={180} />
              <Tooltip />
              <Bar dataKey="importance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          marginTop: "30px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Confusion Matrix</h2>
        <img
          src={`http://127.0.0.1:8000${metrics.confusion_matrix_image}`}
          alt="Confusion Matrix"
          style={{
            maxWidth: "100%",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value.toFixed(3)}</p>
    </div>
  );
}

export default Metrics;