function QuickActions({ onTopUp, onHistory, onScan }) {
  return (
    <div style={styles.container}>

      <div style={styles.card} onClick={onTopUp}>
        <div style={styles.icon}>➕</div>
        <span style={styles.label}>Top Up</span>
      </div>

      <div style={styles.card} onClick={onHistory}>
        <div style={{ ...styles.icon, background: "#ecfdf5" }}>🕘</div>
        <span style={styles.label}>History</span>
      </div>

      <div style={styles.card} onClick={onScan}>
        <div style={{ ...styles.icon, background: "#faf5ff" }}>📷</div>
        <span style={styles.label}>Scan QR</span>
      </div>

    </div>
  )
}

const styles = {

  container: {
    display: "flex",
    gap: "12px"
  },

  card: {
    flex: 1,
    background: "white",
    padding: "18px 10px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },

  icon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  },

  label: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500"
  }

}

export default QuickActions