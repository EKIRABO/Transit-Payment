import { Link, useLocation, useNavigate } from "react-router-dom"

function AdminLayout({ children }) {

  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("role")
      navigate("/login")
    }
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/admin-dashboard") return "Dashboard"
    if (path === "/admin/transactions") return "Transactions"
    if (path === "/admin/routes") return "Routes"
    if (path === "/admin/buses") return "Buses"
    if (path === "/admin/users") return "Users"
    if (path === "/admin/qr-codes") return "QR Codes"
    return "Dashboard"
  }

  const navItems = [
    { path: "/admin-dashboard", label: "📊 Dashboard" },
    { path: "/admin/transactions", label: "💳 Transactions" },
    { path: "/admin/routes", label: "🗺️ Routes" },
    { path: "/admin/buses", label: "🚌 Buses" },
    { path: "/admin/users", label: "👥 Users" },
    { path: "/admin/qr-codes", label: "⬛ QR Codes" }
  ]

  return (
    <div style={styles.container}>

      <aside style={styles.sidebar}>

        <h2 style={styles.logo}>TransitPay</h2>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={isActive(item.path) ? styles.active : styles.link}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout at bottom of sidebar */}
        <div style={styles.sidebarBottom}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>

      </aside>

      <main style={styles.main}>

        <div style={styles.topbar}>
          <div>
            <h2 style={styles.pageTitle}>{getPageTitle()}</h2>
            <p style={styles.subtitle}>Welcome back, Admin</p>
          </div>
          <input placeholder="Search..." style={styles.search} />
        </div>

        {children}

      </main>

    </div>
  )
}

const styles = {

  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif"
  },

  sidebar: {
    width: "220px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column"
  },

  logo: {
    marginBottom: "30px",
    color: "white"
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1
  },

  link: {
    color: "#94a3b8",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "background 0.15s"
  },

  active: {
    background: "#1e293b",
    color: "white",
    padding: "10px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px"
  },

  sidebarBottom: {
    borderTop: "1px solid #1e293b",
    paddingTop: "16px",
    marginTop: "16px"
  },

  logoutBtn: {
    width: "100%",
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left"
  },

  main: {
    flex: 1,
    background: "#f8fafc",
    padding: "30px",
    overflowY: "auto"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },

  pageTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827"
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px"
  },

  search: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "220px",
    outline: "none"
  }

}

export default AdminLayout