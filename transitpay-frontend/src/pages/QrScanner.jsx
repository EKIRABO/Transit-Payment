import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import PassengerLayout from "../components/PassengerLayout"
import { Html5Qrcode } from "html5-qrcode"

function QRScanner() {

  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const [scanned, setScanned] = useState(false)
  const scannerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Start scanner when component mounts
    startScanner()

    // Cleanup on unmount
    return () => {
      stopScanner()
    }
  }, [])

  const startScanner = async () => {
    try {
      setError(null)
      setScanning(true)

      const html5QrCode = new Html5Qrcode("qr-reader")
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: "environment" }, // use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // QR code scanned successfully
          handleScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Scanning in progress — ignore frame errors
        }
      )

    } catch (err) {
      setError("Camera access denied. Please allow camera permission and try again.")
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (e) {
        // Already stopped
      }
    }
  }

  const handleScanSuccess = async (decodedText) => {
    if (scanned) return // prevent double scan
    setScanned(true)

    try {
      await stopScanner()
      setScanning(false)

      // Parse the QR data
      const qrData = JSON.parse(decodedText)

      // Validate it's a valid bus QR
      if (!qrData.bus_id || !qrData.fare || !qrData.route_name) {
        setError("Invalid QR code — this is not a TransitPay bus QR code")
        setScanned(false)
        return
      }

      // Navigate to payment with route info pre-filled
      navigate("/passenger/payment", {
        state: {
          routeId: qrData.route_id,
          busId: qrData.bus_id,
          routeName: qrData.route_name,
          fare: qrData.fare,
          from: qrData.from,
          to: qrData.to,
          plateNumber: qrData.plate_number,
          fromQR: true // flag so payment page knows it came from QR
        }
      })

    } catch (e) {
      setError("Could not read QR code. Make sure you're scanning a TransitPay QR code.")
      setScanned(false)
      startScanner()
    }
  }

  return (
    <PassengerLayout>

      <div style={styles.wrapper}>
        <div style={styles.container}>

          <button
            style={styles.backBtn}
            onClick={() => {
              stopScanner()
              navigate("/passenger-dashboard")
            }}
          >
            ← Back
          </button>

          <h2 style={styles.heading}>Scan Bus QR Code</h2>
          <p style={styles.subtitle}>Point your camera at the QR code on the bus</p>

          {/* Camera viewfinder */}
          <div style={styles.scannerWrapper}>
            <div id="qr-reader" style={styles.scanner} />
            {scanning && (
              <div style={styles.overlay}>
                <div style={styles.scanFrame} />
              </div>
            )}
          </div>

          {error && (
            <div style={styles.errorCard}>
              <p style={styles.errorText}>⚠️ {error}</p>
              <button
                style={styles.retryBtn}
                onClick={() => {
                  setError(null)
                  setScanned(false)
                  startScanner()
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {scanning && !error && (
            <p style={styles.hint}>
              🔍 Scanning... Hold your camera steady
            </p>
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

  subtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px"
  },

  scannerWrapper: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#111827"
  },

  scanner: {
    width: "100%"
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
  },

  scanFrame: {
    width: "220px",
    height: "220px",
    border: "3px solid #3b82f6",
    borderRadius: "12px",
    boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)"
  },

  hint: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
    margin: 0
  },

  errorCard: {
    background: "#fee2e2",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  },

  errorText: {
    margin: 0,
    color: "#991b1b",
    fontSize: "14px",
    textAlign: "center"
  },

  retryBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  }

}

export default QRScanner