"use client";

type HeaderProps = {
  mobileOpen: boolean;
  onMenuToggle: () => void;
  language: "en" | "mr";
  onLanguageChange: (language: "en" | "mr") => void;
};

export default function Header({
  mobileOpen,
  onMenuToggle,
  language,
  onLanguageChange,
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
        {mobileOpen
          ? String.fromCharCode(0x2715)
          : String.fromCharCode(0x2630)}
      </button>

      {/* ==============================
          HEADER BRAND
      ============================== */}

      <div className="itdp-header-brand">
        <span className="itdp-header-logo">
          {String.fromCharCode(0x1f680)}
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
          HEADER ACTIONS
      ============================== */}

      <div className="itdp-header-actions">

        {/* LANGUAGE */}

        <div className="itdp-language-switcher">
          <button
            type="button"
            className={
              language === "en"
                ? "itdp-language-button active"
                : "itdp-language-button"
            }
            onClick={() => onLanguageChange("en")}
          >
            English
          </button>

          <button
            type="button"
            className={
              language === "mr"
                ? "itdp-language-button active"
                : "itdp-language-button"
            }
            onClick={() => onLanguageChange("mr")}
          >
            मराठी
          </button>
        </div>

        {/* LOGIN */}

        <button
          type="button"
          className="itdp-login-button"
          onClick={() => {
            console.log("Login clicked");
          }}
        >
          {String.fromCharCode(0x1f512)} Login
        </button>

        {/* FOUNDER */}

        <div className="itdp-founder">
          {String.fromCharCode(0x1f464)} Founder Sunil
        </div>

      </div>

    </header>
  );
}