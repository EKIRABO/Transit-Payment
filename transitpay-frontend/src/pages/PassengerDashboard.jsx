import PassengerLayout from "../components/PassengerLayout"
import { useNavigate } from "react-router-dom"
import WalletCard from "../components/WalletCard"
import QuickActions from "../components/QuickActions"
import RideCard from "../components/RideCard"
import { useEffect, useState } from "react"
import { getWalletByUser } from "../services/walletService"
import { getTransactions } from "../services/transactionService"
import { momoTopUp } from "../services/momoService"

function PassengerDashboard() {

  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpMethod, setTopUpMethod] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [loadingTopup, setLoadingTopup] = useState(false)
  const [topUpStatus, setTopUpStatus] = useState("")
  const navigate = useNavigate()

  const fetchWallet = async () => {
    try {
      const userId = localStorage.getItem("user_id")
      if (!userId) return
      const data = await getWalletByUser(userId)
      setBalance(data.balance)
    } catch (error) {
      console.error("fetchWallet error:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("user_id")
      if (!userId) { setLoading(false); return }
      const data = await getTransactions(userId)
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("fetchTransactions error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallet()
    fetchTransactions()
  }, [])

  const handleTopUp = async () => {
    if (!amount || Number(amount) < 500) {
      alert("Minimum top-up amount is RWF 500")
      return
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Enter a valid phone number")
      return
    }
    try {
      setLoadingTopup(true)
      const userId = localStorage.getItem("user_id")
      if (!userId) { alert("You are not logged in"); return }

      if (topUpMethod === "momo") {
        setTopUpStatus("Waiting for MoMo approval on your phone...")
        await momoTopUp(userId, phoneNumber, Number(amount))
      } else {
        alert("Airtel Money integration coming soon — use MoMo for now")
        return
      }

      await fetchWallet()
      await fetchTransactions()
      setAmount("")
      setPhoneNumber("")
      setShowTopUp(false)
      setTopUpMethod(null)
      setTopUpStatus("")
      alert("Top-up successful!")

    } catch (error) {
      alert(error.message)
    } finally {
      setLoadingTopup(false)
      setTopUpStatus("")
    }
  }

  return (
    <PassengerLayout>
      <div style={styles.wrapper}>
        <div style={styles.container}>

          <p style={styles.subtitle}>Welcome back</p>

          <WalletCard
            balance={loading ? 0 : balance}
            onTopUp={() => setShowTopUp(true)}
            onBook={() => navigate("/passenger/routes")}
          />

          <QuickActions
            onTopUp={() => setShowTopUp(true)}
            onHistory={() => navigate("/passenger/transactions")}
            onScan={() => navigate("/passenger/scan")}
          />

          {/* Top Up — method selector */}
          {showTopUp && !topUpMethod && (
            <div style={styles.topUpCard}>
              <p style={styles.topUpTitle}>Select Top-Up Method</p>
              <div style={styles.methodRow}>
                <button style={styles.methodBtn} onClick={() => setTopUpMethod("momo")}>
                  📱 MTN MoMo
                </button>
                <button style={styles.methodBtn} onClick={() => setTopUpMethod("airtel")}>
                  📲 Airtel Money
                </button>
              </div>
              <button style={styles.cancelBtn} onClick={() => setShowTopUp(false)}>
                Cancel
              </button>
            </div>
          )}

          {/* Top Up — details form */}
          {showTopUp && topUpMethod && (
            <div style={styles.topUpCard}>
              <p style={styles.topUpTitle}>
                {topUpMethod === "momo" ? "📱 MTN MoMo Top-Up" : "📲 Airtel Money Top-Up"}
              </p>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Phone Number</label>
                <input
                  type="tel"
                  placeholder={topUpMethod === "momo" ? "07X XXX XXXX" : "073 XXX XXXX"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={styles.input}
                  maxLength={12}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Amount (RWF)</label>
                <input
                  type="number"
                  placeholder="Min. RWF 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                />
              </div>
              {topUpMethod === "momo" && (
                <div style={styles.sandboxNote}>
                  🧪 Sandbox test number: <strong>46733123450</strong>
                </div>
              )}
              {topUpStatus && <p style={styles.statusMsg}>{topUpStatus}</p>}
              <div style={styles.topUpRow}>
                <button
                  onClick={handleTopUp}
                  style={loadingTopup ? { ...styles.topUpBtn, opacity: 0.7 } : styles.topUpBtn}
                  disabled={loadingTopup}
                >
                  {loadingTopup ? topUpStatus || "Processing..." : "Top Up"}
                </button>
                <button
                  style={styles.cancelBtn}
                  onClick={() => { setTopUpMethod(null); setPhoneNumber(""); setAmount("") }}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Rides</h3>
            <span style={styles.viewAll} onClick={() => navigate("/passenger/transactions")}>
              View All →
            </span>
          </div>

          {loading ? (
            <p style={styles.message}>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p style={styles.message}>No transactions yet</p>
          ) : (
            transactions.slice(0, 3).map((tx) => (
              <RideCard
                key={tx.id}
                route={tx.route_name || `Bus ${tx.bus_id}`}
                time={new Date(tx.created_at).toLocaleString()}
                price={tx.amount}
                status={tx.status}
              />
            ))
          )}

        </div>
      </div>
    </PassengerLayout>
  )
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", paddingTop: "40px", background: "#f8fafc", minHeight: "100vh" },
  container: { width: "420px", display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "40px" },
  subtitle: { color: "#6b7280", margin: 0 },
  topUpCard: { background: "white", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" },
  topUpTitle: { margin: 0, fontWeight: "700", fontSize: "15px", color: "#111827" },
  methodRow: { display: "flex", gap: "10px" },
  methodBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#f8fafc", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  cancelBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "13px", padding: "4px 0" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  inputLabel: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" },
  sandboxNote: { background: "#fef9c3", border: "1px solid #fde047", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#713f12" },
  statusMsg: { textAlign: "center", color: "#2563eb", fontSize: "13px", fontWeight: "600", margin: 0 },
  topUpRow: { display: "flex", gap: "10px", alignItems: "center" },
  topUpBtn: { flex: 1, background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" },
  sectionTitle: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" },
  viewAll: { color: "#2563eb", fontSize: "13px", cursor: "pointer", fontWeight: "500" },
  message: { color: "#6b7280", fontSize: "14px" }
}

export default PassengerDashboard