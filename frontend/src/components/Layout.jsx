import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();

  const navLinkStyle = (path) => ({
    color: "#fff",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    background: location.pathname === path ? "#2563eb" : "transparent",
    fontWeight: 500,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      <nav
        style={{
          background: "#0f172a",
          color: "#fff",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Predictive Maintenance Platform
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/" style={navLinkStyle("/")}>
            Dashboard
          </Link>
          <Link to="/upload" style={navLinkStyle("/upload")}>
            Upload Data
          </Link>
          <Link to="/metrics" style={navLinkStyle("/metrics")}>
            Metrics
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;