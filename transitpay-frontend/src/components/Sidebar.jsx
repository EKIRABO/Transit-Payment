import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <div style={styles.sidebar}>

      <h2 style={styles.logo}>TransitPay</h2>

      <nav style={styles.nav}>

        <NavLink to="/admin" style={styles.link}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/routes" style={styles.link}>
          Routes
        </NavLink>

        <NavLink to="/admin/buses" style={styles.link}>
          Buses
        </NavLink>

        <NavLink to="/admin/transactions" style={styles.link}>
          Transactions
        </NavLink>

        <NavLink to="/" style={styles.logout}>
          Logout
        </NavLink>

      </nav>

    </div>
  )
}

const styles = {

  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#f8fafc",
    padding: "25px",
    borderRight: "1px solid #e5e7eb"
  },

  logo: {
    marginBottom: "40px"
  },

  nav: {
  display: "flex",
  flexDirection: "column",
  gap: "22px"
},

link: {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: "8px",
  color: "#374151",
  fontWeight: "500",
  transition: "0.2s"
},

  logout: {
    marginTop: "40px",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "8px",
    color: "#ef4444",
    fontWeight: "500"
  }

}

export default Sidebar