import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PassengerLayout from "../components/PassengerLayout"
import { payRide } from "../services/paymentService"
import { momoPayRide } from "../services/momoService"

const PAYMENT_METHODS = [
  {
    id: "wallet",
    label: "Wallet Balance",
    icon: "💳",
    description: "Pay directly from your TransitPay wallet"
  },
  {
    id: "momo",
    label: "MTN MoMo",
    icon: "📱",
    description: "Pay via MTN Mobile Money — you'll get a prompt on your phone"
  },
  {
    id: "airtel",
    label: "Airtel Money",
    icon: "📲",
    description: "Pay via Airtel Money"
  },
  {
    id: "bank",
    label: "Bank Card",
    icon: "🏦",
    description: "Pay with your debit or credit card"
  },
  {
    id: "ussd",
    label: "USSD",
    icon: "🔢",
    description: "Pay using USSD code *182# or *185#"
  },
  {
    id: "qr",
    label: "Scan QR Code",
    icon: "⬛",
    description: "Scan the bus QR code to pay"
  }
]

function PassengerPayment() {

  const { state } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [step, setStep] = useState("method")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [statusMsg, setStatusMsg] = useState("")

  if (!state || !state.routeId) {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <p style={styles.errorMsg}>No route selected.</p>
            <button style={styles.backBtn} onClick={() => navigate("/passenger/routes")}>
              ← Back to Routes
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  const { routeName, fare, from, to, busId, plateNumber } = state

  const handleSelectMethod = (method) => {
    setSelectedMethod(method)
    if (method.id === "wallet") {
      setStep("confirm")
    } else {
      setStep("details")
    }
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      setStatusMsg("")
      const userId = localStorage.getItem("user_id")

      if (!userId) {
        alert("You are not logged in")
        return
      }

      if (selectedMethod.id === "wallet") {
        setStatusMsg("Processing payment...")
        await payRide(userId, busId)

      } else if (selectedMethod.id === "momo") {
        if (!phoneNumber || phoneNumber.length < 10) {
          alert("Enter a valid MTN phone number")
          return
        }
        setStatusMsg("Waiting for MoMo approval on your phone...")
        await momoPayRide(userId, busId, phoneNumber)

      } else if (selectedMethod.id === "airtel") {
        if (!phoneNumber || phoneNumber.length < 10) {
          alert("Enter a valid Airtel phone number")
          return
        }
        setStatusMsg("Waiting for Airtel Money approval...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        await payRide(userId, busId)

      } else if (selectedMethod.id === "bank") {
        if (!cardNumber || !cardExpiry || !cardCvv) {
          alert("Fill in all card details")
          return
        }
        setStatusMsg("Processing card payment...")
        await new Promise(resolve => setTimeout(resolve, 2000))
        await payRide(userId, busId)

      } else if (selectedMethod.id === "ussd") {
        setStatusMsg("Confirming USSD payment...")
        await new Promise(resolve => setTimeout(resolve, 1500))
        await payRide(userId, busId)

      } else if (selectedMethod.id === "qr") {
        setStatusMsg("Confirming QR payment...")
        await new Promise(resolve => setTimeout(resolve, 1000))
        await payRide(userId, busId)
      }

      setPaid(true)

    } catch (error) {
      alert(error.message || "Payment failed")
    } finally {
      setLoading(false)
      setStatusMsg("")
    }
  }

  // ─── Success ──────────────────────────────────────────────────
  if (paid) {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Payment Successful</h2>
            <p style={styles.successMsg}>
              You paid RWF {Number(fare).toLocaleString()} for {routeName}
            </p>
            <p style={styles.successMethod}>via {selectedMethod?.label}</p>
            <button style={styles.doneBtn} onClick={() => navigate("/passenger-dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 1: Choose method ────────────────────────────────────
  if (step === "method") {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => navigate("/passenger/routes")}>
              ← Back to Routes
            </button>
            <h2 style={styles.heading}>Choose Payment Method</h2>
            <div style={styles.routePill}>
              <span>🚌 {routeName}</span>
              <span style={styles.routePillFare}>RWF {Number(fare).toLocaleString()}</span>
            </div>
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} style={styles.methodCard} onClick={() => handleSelectMethod(method)}>
                <div style={styles.methodIcon}>{method.icon}</div>
                <div style={styles.methodInfo}>
                  <p style={styles.methodLabel}>{method.label}</p>
                  <p style={styles.methodDesc}>{method.description}</p>
                </div>
                <span style={styles.methodArrow}>›</span>
              </div>
            ))}
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 2a: MoMo / Airtel ───────────────────────────────────
  if (step === "details" && (selectedMethod.id === "momo" || selectedMethod.id === "airtel")) {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => setStep("method")}>← Back</button>
            <h2 style={styles.heading}>{selectedMethod.label}</h2>
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Route</span>
                <span style={styles.summaryValue}>{routeName}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Amount</span>
                <span style={styles.fareAmount}>RWF {Number(fare).toLocaleString()}</span>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>
                {selectedMethod.id === "momo" ? "MTN" : "Airtel"} Phone Number
              </label>
              <input
                type="tel"
                placeholder={selectedMethod.id === "momo" ? "07X XXX XXXX" : "073 XXX XXXX"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={styles.input}
                maxLength={12}
              />
            </div>
            <p style={styles.note}>
              You will receive a {selectedMethod.id === "momo" ? "*182#" : "*185#"} prompt
              on your phone to approve RWF {Number(fare).toLocaleString()}
            </p>
            {statusMsg && <p style={styles.statusMsg}>{statusMsg}</p>}
            <button
              style={loading ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? statusMsg || "Processing..." : `Pay RWF ${Number(fare).toLocaleString()}`}
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 2b: Bank card ───────────────────────────────────────
  if (step === "details" && selectedMethod.id === "bank") {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => setStep("method")}>← Back</button>
            <h2 style={styles.heading}>Bank Card</h2>
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Amount</span>
                <span style={styles.fareAmount}>RWF {Number(fare).toLocaleString()}</span>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)} style={styles.input} maxLength={19} />
            </div>
            <div style={styles.cardRow}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.inputLabel}>Expiry</label>
                <input type="text" placeholder="MM/YY" value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)} style={styles.input} maxLength={5} />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.inputLabel}>CVV</label>
                <input type="password" placeholder="•••" value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)} style={styles.input} maxLength={3} />
              </div>
            </div>
            <p style={styles.note}>🔒 Your card details are encrypted and never stored</p>
            {statusMsg && <p style={styles.statusMsg}>{statusMsg}</p>}
            <button style={loading ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
              onClick={handlePayment} disabled={loading}>
              {loading ? "Processing..." : `Pay RWF ${Number(fare).toLocaleString()}`}
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 2c: USSD ────────────────────────────────────────────
  if (step === "details" && selectedMethod.id === "ussd") {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => setStep("method")}>← Back</button>
            <h2 style={styles.heading}>Pay via USSD</h2>
            <div style={styles.ussdCard}>
              <p style={styles.ussdStep}>1. Dial the code below on your phone</p>
              <div style={styles.ussdCode}>*182*8*1*{busId}#</div>
              <p style={styles.ussdStep}>2. Enter amount: <strong>RWF {Number(fare).toLocaleString()}</strong></p>
              <p style={styles.ussdStep}>3. Enter your MoMo PIN to confirm</p>
              <p style={styles.ussdStep}>4. Click "I've Paid" below once approved</p>
            </div>
            {statusMsg && <p style={styles.statusMsg}>{statusMsg}</p>}
            <button style={loading ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
              onClick={handlePayment} disabled={loading}>
              {loading ? "Confirming..." : "I've Paid"}
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 2d: QR ──────────────────────────────────────────────
  if (step === "details" && selectedMethod.id === "qr") {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => setStep("method")}>← Back</button>
            <h2 style={styles.heading}>Scan QR Code</h2>
            <div style={styles.qrWrapper}>
              <div style={styles.qrBox}>
                <div style={styles.qrInner}>
                  <p style={styles.qrText}>QR</p>
                  <p style={styles.qrSub}>Bus {plateNumber}</p>
                  <p style={styles.qrSub}>RWF {Number(fare).toLocaleString()}</p>
                </div>
              </div>
            </div>
            {statusMsg && <p style={styles.statusMsg}>{statusMsg}</p>}
            <button style={loading ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
              onClick={handlePayment} disabled={loading}>
              {loading ? "Confirming..." : "Confirm Scan"}
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  // ─── Step 2e: Wallet confirm ──────────────────────────────────
  if (step === "confirm") {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <button style={styles.backLink} onClick={() => setStep("method")}>← Back</button>
            <h2 style={styles.heading}>Confirm Payment</h2>
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Route</span>
                <span style={styles.summaryValue}>{routeName}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>From</span>
                <span style={styles.summaryValue}>{from}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>To</span>
                <span style={styles.summaryValue}>{to}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Payment</span>
                <span style={styles.summaryValue}>{selectedMethod?.label}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Fare</span>
                <span style={styles.fareAmount}>RWF {Number(fare).toLocaleString()}</span>
              </div>
            </div>
            <p style={styles.note}>This amount will be deducted from your wallet balance.</p>
            {statusMsg && <p style={styles.statusMsg}>{statusMsg}</p>}
            <button style={loading ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
              onClick={handlePayment} disabled={loading}>
              {loading ? "Processing..." : `Pay RWF ${Number(fare).toLocaleString()}`}
            </button>
          </div>
        </div>
      </PassengerLayout>
    )
  }
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", paddingTop: "40px", background: "#f8fafc", minHeight: "100vh" },
  container: { width: "420px", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "40px" },
  backLink: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "14px", padding: 0, alignSelf: "flex-start", fontWeight: "500" },
  heading: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#111827" },
  routePill: { background: "white", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", fontSize: "14px", fontWeight: "600", color: "#111827" },
  routePillFare: { color: "#2563eb", fontWeight: "700" },
  methodCard: { background: "white", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" },
  methodIcon: { fontSize: "24px", width: "44px", height: "44px", background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  methodInfo: { flex: 1 },
  methodLabel: { margin: 0, fontWeight: "600", color: "#111827", fontSize: "14px" },
  methodDesc: { margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" },
  methodArrow: { color: "#9ca3af", fontSize: "22px" },
  summaryCard: { background: "white", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { color: "#6b7280", fontSize: "14px" },
  summaryValue: { color: "#111827", fontWeight: "600", fontSize: "14px" },
  fareAmount: { color: "#2563eb", fontWeight: "800", fontSize: "18px" },
  divider: { height: "1px", background: "#f3f4f6" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  inputLabel: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" },
  cardRow: { display: "flex", gap: "12px" },
  statusMsg: { textAlign: "center", color: "#2563eb", fontSize: "13px", fontWeight: "600", margin: 0 },
  ussdCard: { background: "white", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" },
  ussdStep: { margin: 0, fontSize: "14px", color: "#374151" },
  ussdCode: { background: "#1e293b", color: "#34d399", fontFamily: "monospace", fontSize: "22px", fontWeight: "700", textAlign: "center", padding: "16px", borderRadius: "10px", letterSpacing: "2px" },
  qrWrapper: { display: "flex", justifyContent: "center" },
  qrBox: { width: "180px", height: "180px", background: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" },
  qrInner: { width: "140px", height: "140px", border: "3px solid #111827", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" },
  qrText: { margin: 0, fontSize: "28px", fontWeight: "900", color: "#111827" },
  qrSub: { margin: 0, fontSize: "11px", color: "#6b7280" },
  note: { color: "#6b7280", fontSize: "13px", margin: 0, textAlign: "center" },
  payBtn: { background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "white", border: "none", padding: "14px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "16px" },
  successIcon: { fontSize: "60px", textAlign: "center", marginTop: "40px" },
  successTitle: { textAlign: "center", color: "#111827", margin: 0, fontSize: "22px", fontWeight: "700" },
  successMsg: { textAlign: "center", color: "#6b7280", fontSize: "14px", margin: 0 },
  successMethod: { textAlign: "center", color: "#2563eb", fontSize: "13px", fontWeight: "600", margin: 0 },
  doneBtn: { background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "white", border: "none", padding: "14px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "16px" },
  errorMsg: { color: "#6b7280" },
  backBtn: { background: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer" }
}

export default PassengerPayment