type SidebarProps = {
  onMenuClick: (page: string) => void;
};

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const menuItems = [
    { name: "📈 Stock Analysis", page: "stock" },
    { name: "📰 Market News", page: "marketnews" },
    { name: "🤖 AI Decision Engine", page: "ai" },
    { name: "💼 Portfolio", page: "portfolio" },
    { name: "📊 Analytics", page: "analytics" },
    { name: "⚙️ Settings", page: "settings" },
  ];

  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        padding: "20px",
        borderRight: "1px solid #334155",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      <h3 style={{ marginBottom: "25px" }}>Dashboard</h3>

      {menuItems.map((item) => (
        <div
          key={item.page}
          onClick={() => onMenuClick(item.page)}
          style={{
            padding: "12px",
            marginBottom: "10px",
            background: "#1e293b",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {item.name}
        </div>
      ))}
    </aside>
  );
}