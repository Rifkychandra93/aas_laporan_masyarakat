import { Bell, History, User } from "lucide-react";
import logo from "../../assets/logo1.png";

const DashboardNavbar = () => {
  return (
    <nav
      style={{
        height: 76,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: 92,
            height: 92,
            objectFit: "contain",
            marginRight: "-2rem",
          }}
        />

        <h1
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Report<span style={{ color: "#5b9cf6" }}>.in</span>
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button className="dash-btn">
          <Bell size={18} />
        </button>

        <button className="dash-btn">
          <History size={18} />
        </button>

        <button className="dash-btn">
          <User size={18} />
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;