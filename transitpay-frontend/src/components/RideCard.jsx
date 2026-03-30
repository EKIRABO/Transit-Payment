function RideCard({ route, time, price, status }) {

  const statusStyle = status === "ride_payment" || status === "completed"
    ? styles.statusCompleted
    : status === "failed"
    ? styles.statusFailed
    : styles.statusPending

  const statusLabel = status === "ride_payment"
    ? "Completed"
    : status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown"

  return (
    <div style={styles.card}>

      <div style={styles.left}>

        <div style={styles.icon}>🚌</div>

        <div>
          <p style={styles.route}>{route}</p>
          <p style={styles.meta}>{time}</p>
        </div>

      </div>

      <div style={styles.right}>
        <p style={styles.price}>RWF {Number(price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        <span style={statusStyle}>{statusLabel}</span>
      </div>

    </div>
  )
}

const styles = {

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  icon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0
  },

  route: {
    margin: 0,
    fontWeight: "600",
    color: "#111827",
    fontSize: "14px"
  },

  meta: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    color: "#6b7280"
  },

  right: {
    textAlign: "right",
    flexShrink: 0
  },

  price: {
    margin: "0 0 4px 0",
    fontWeight: "700",
    fontSize: "14px",
    color: "#111827"
  },

  statusCompleted: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "600",
    display: "inline-block"
  },

  statusFailed: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "600",
    display: "inline-block"
  },

  statusPending: {
    background: "#fef9c3",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "600",
    display: "inline-block"
  }

}

export default RideCard