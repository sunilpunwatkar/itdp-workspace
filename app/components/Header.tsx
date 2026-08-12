"use client";

type HeaderProps = {
  mobileOpen: boolean;
  onMenuToggle: () => void;
};

export default function Header({
  mobileOpen,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="itdp-header">

      {/* ==============================
          MOBILE MENU BUTTON
      ============================== */}

      <button
        type="button"
        className="itdp-mobile-menu-button"
        onClick={onMenuToggle}
        aria-label={
          mobileOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* ==============================
          HEADER BRAND
      ============================== */}

      <div className="itdp-header-brand">
        <span className="itdp-header-logo">
          🚀
        </span>

        <div>
          <h2 className="itdp-header-title">
            ITDP Decision Workspace
          </h2>

          <small className="itdp-header-subtitle">
            India's Trading Decision Platform
          </small>
        </div>
      </div>

      {/* ==============================
          FOUNDER
      ============================== */}

      <div className="itdp-founder">
        👤 Founder Sunil
      </div>

    </header>
  );
}