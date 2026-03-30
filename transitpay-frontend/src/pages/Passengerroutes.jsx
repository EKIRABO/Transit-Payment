import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PassengerLayout from "../components/PassengerLayout"
import { getRoutesWithBuses } from "../services/routeService"

function PassengerRoutes() {

  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getRoutesWithBuses()
        setRoutes(data)
      } catch (error) {
        console.error("Failed to fetch routes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [])

  const handleSelectRoute = (route) => {
    
    navigate("/passenger/payment", {
      state: {
        routeId: route.route_id,
        busId: route.bus_id,         
        routeName: route.route_name,
        fare: route.fare,
        from: route.start_location,
        to: route.end_location,
        plateNumber: route.plate_number
      }
    })
  }

  return (
    <PassengerLayout>

      <div style={styles.wrapper}>
        <div style={styles.container}>

          <button
            onClick={() => navigate("/passenger-dashboard")}
            style={styles.backBtn}
          >
            ← Back
          </button>

          <h2 style={styles.heading}>Available Routes</h2>

          {loading ? (
            <p style={styles.message}>Loading routes...</p>
          ) : routes.length === 0 ? (
            <p style={styles.message}>No routes available</p>
          ) : (
            routes.map((route) => (
              <div key={route.route_id} style={styles.card}>

                <div style={styles.cardTop}>
                  <span style={styles.routeName}>{route.route_name}</span>
                  <span style={styles.fare}>
                    RWF {Number(route.fare).toLocaleString()}
                  </span>
                </div>

                <div style={styles.cardMid}>
                  <span style={styles.location}>
                    📍 {route.start_location} → {route.end_location}
                  </span>
                </div>

                {route.plate_number && (
                  <div style={styles.busTag}>
                    🚌 Bus {route.plate_number}
                  </div>
                )}

                <button
                  onClick={() => handleSelectRoute(route)}
                  style={route.bus_id ? styles.selectBtn : styles.selectBtnDisabled}
                  disabled={!route.bus_id}
                >
                  {route.bus_id ? "Select Route" : "No Bus Assigned"}
                </button>

              </div>
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
    color: "#111827",
    fontSize: "22px",
    fontWeight: "700"
  },

  message: {
    color: "#6b7280",
    fontSize: "14px"
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  routeName: {
    fontWeight: "700",
    color: "#111827",
    fontSize: "15px"
  },

  fare: {
    fontWeight: "700",
    color: "#2563eb",
    fontSize: "15px"
  },

  cardMid: {
    color: "#6b7280",
    fontSize: "13px"
  },

  location: {
    color: "#6b7280"
  },

  busTag: {
    fontSize: "12px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "999px",
    alignSelf: "flex-start"
  },

  selectBtn: {
    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },

  selectBtnDisabled: {
    background: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "not-allowed",
    fontWeight: "600",
    fontSize: "14px"
  }

}

export default PassengerRoutes