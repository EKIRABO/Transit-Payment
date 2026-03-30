function Topbar() {
  return (
    <div style={styles.topbar}>

      <div style={styles.left}>
        <h3>Dashboard</h3>
      </div>

      <div style={styles.right}>

        <input
          placeholder="Search..."
          style={styles.search}
        />

        <span style={styles.icon}>🔔</span>

        <span style={styles.profile}>👤</span>

      </div>

    </div>
  )
}

const styles = {

  topbar: {
    height: "60px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px"
  },

  left: {
    fontWeight: "600"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  search: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  },

  icon: {
    fontSize: "18px",
    cursor: "pointer"
  },

  profile: {
    fontSize: "20px",
    cursor: "pointer"
  }

}

export default Topbar