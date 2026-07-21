export default function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #334155",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "30px" }}>🚀</span>

        <div>
          <h2 style={{ margin: 0 }}>ITDP Decision Workspace</h2>
          <small style={{ color: "#94a3b8" }}>
            India's Trading Decision Platform
          </small>
        </div>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "10px 18px",
          borderRadius: "8px",
        }}
      >
        👤 Founder Sunil
      </div>
    </header>
  );
}