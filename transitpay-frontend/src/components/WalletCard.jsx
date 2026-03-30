function WalletCard({ balance, onTopUp, onBook }) {
  return (
    <div style={styles.card}>

      <div style={styles.topRow}>
        <span style={styles.walletIcon}>💳</span>
        <p style={styles.label}>Wallet Balance</p>
      </div>

      <h2 style={styles.amount}>
        RWF {Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </h2>

      <p style={styles.sub}>Available for rides</p>

      <div style={styles.actions}>
        <button style={styles.primary} onClick={onTopUp}>
          + Top Up
        </button>

        <button style={styles.secondary} onClick={onBook}>
          🚌 Book Ride
        </button>
      </div>

    </div>
  )
}

const styles = {

  card: {
    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 25px rgba(0,0,0,0.1)"
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px"
  },

  walletIcon: {
    fontSize: "16px"
  },

  label: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.9
  },

  amount: {
    margin: "10px 0 4px 0",
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },

  sub: {
    margin: 0,
    fontSize: "13px",
    opacity: 0.8
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "18px"
  },

  primary: {
    flex: 1,
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },

  secondary: {
    flex: 1,
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.5)",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px"
  }

}

export default WalletCard