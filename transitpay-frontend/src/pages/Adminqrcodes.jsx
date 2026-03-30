import { useEffect, useState } from "react"

function AdminQRCodes() {

  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const res = await fetch("http://localhost:8000/qr/all-buses")
        const data = await res.json()
        setBuses(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch QR codes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchQRCodes()
  }, [])

  const handlePrint = (bus) => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Bus ${bus.plate_number}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            h2 { color: #111827; }
            p { color: #6b7280; font-size: 14px; }
            img { margin: 20px auto; display: block; }
          </style>
        </head>
        <body>
          <h2>Bus ${bus.plate_number}</h2>
          <p>${bus.route_name}</p>
          <img src="${bus.qr_image}" width="250" />
          <p>Scan to pay for your ride</p>
          <p><strong>TransitPay</strong></p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div style={styles.wrapper}>

      <div style={styles.header}>
        <h2 style={styles.title}>Bus QR Codes</h2>
        <p style={styles.subtitle}>Print and attach these to each bus</p>
      </div>

      {loading ? (
        <p style={styles.message}>Loading QR codes...</p>
      ) : buses.length === 0 ? (
        <p style={styles.message}>No buses with assigned routes found</p>
      ) : (
        <div style={styles.grid}>
          {buses.map((bus) => (
            <div key={bus.bus_id} style={styles.card}>

              <div style={styles.cardHeader}>
                <span style={styles.plate}>🚌 {bus.plate_number}</span>
                <span style={styles.route}>{bus.route_name}</span>
              </div>

              <img
                src={bus.qr_image}
                alt={`QR for bus ${bus.plate_number}`}
                style={styles.qrImage}
              />

              <button
                style={styles.printBtn}
                onClick={() => handlePrint(bus)}
              >
                🖨️ Print QR
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

const styles = {

  wrapper: {
    padding: "32px",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  header: {
    marginBottom: "24px"
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827"
  },

  subtitle: {
    margin: "4px 0 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },

  message: {
    color: "#6b7280"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
  },

  cardHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px"
  },

  plate: {
    fontWeight: "700",
    color: "#111827",
    fontSize: "15px"
  },

  route: {
    color: "#6b7280",
    fontSize: "13px"
  },

  qrImage: {
    width: "180px",
    height: "180px",
    borderRadius: "8px"
  },

  printBtn: {
    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%"
  }

}

export default AdminQRCodes