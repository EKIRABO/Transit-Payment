import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PassengerLayout from "../components/PassengerLayout"
import RideCard from "../components/RideCard"
import { getTransactions } from "../services/transactionService"

function PassengerTransactions() {

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem("user_id")
        if (!userId) {
          console.warn("No user_id in localStorage")
          setLoading(false)
          return
        }
        const data = await getTransactions(userId)
        setTransactions(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <PassengerLayout>

      <div style={styles.wrapper}>
        <div style={styles.container}>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/passenger-dashboard")}
          >
            ← Back
          </button>

          <h2 style={styles.heading}>Transaction History</h2>

          {loading ? (
            <p style={styles.message}>Loading...</p>
          ) : transactions.length === 0 ? (
            <p style={styles.message}>No transactions yet</p>
          ) : (
            transactions.map((tx) => (
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

  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  container: {
    width: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingBottom: "40px"
  },

  backBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
    alignSelf: "flex-start",
    fontWeight: "500"
  },

  heading: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827"
  },

  message: {
    color: "#6b7280",
    fontSize: "14px"
  }

}

export default PassengerTransactions