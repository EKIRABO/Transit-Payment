import { useNavigate } from "react-router-dom"

function PassengerLayout({ children }) {

  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("role")
      navigate("/login")
    }
  }

  return (
    <div style={styles.page}>

      {/* Top navigation bar */}
      <div style={styles.topbar}>
        <span style={styles.brand} onClick={() => navigate("/passenger-dashboard")}>
          🚌 TransitPay
        </span>
        <div style={styles.topbarRight}>
          <button
            style={styles.profileBtn}
            onClick={() => navigate("/passenger/profile")}
          >
            👤 Profile
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.container}>
        {children}
      </div>

    </div>
  )
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc"
  },

  topbar: {
    background: "white",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 10
  },

  brand: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#2563eb",
    cursor: "pointer"
  },

  topbarRight: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },

  profileBtn: {
    background: "#eff6ff",
    border: "none",
    color: "#2563eb",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
  },

  logoutBtn: {
    background: "transparent",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px"
  },

  container: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px"
  }

}

export default PassengerLayout