import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PassengerLayout from "../components/PassengerLayout"

function PassengerProfile() {

  const navigate = useNavigate()
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [savingPassword, setSavingPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const userId = localStorage.getItem("user_id")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || ""
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const res = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update profile")
      setSuccessMsg("Profile updated successfully")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Fill in all password fields")
      return
    }
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match")
      return
    }
    if (passwords.new.length < 6) {
      alert("New password must be at least 6 characters")
      return
    }
    try {
      setSavingPassword(true)
      const res = await fetch(`http://localhost:8000/users/${userId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to change password")
      setSuccessMsg("Password changed successfully")
      setPasswords({ current: "", new: "", confirm: "" })
      setChangingPassword(false)
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (error) {
      alert(error.message)
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <PassengerLayout>
        <div style={styles.wrapper}>
          <div style={styles.container}>
            <p style={styles.message}>Loading profile...</p>
          </div>
        </div>
      </PassengerLayout>
    )
  }

  return (
    <PassengerLayout>
      <div style={styles.wrapper}>
        <div style={styles.container}>

          <button style={styles.backBtn} onClick={() => navigate("/passenger-dashboard")}>
            ← Back
          </button>

          <h2 style={styles.heading}>My Profile</h2>

          {successMsg && (
            <div style={styles.successBanner}>✅ {successMsg}</div>
          )}

          {/* Avatar */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={styles.avatarName}>{profile.name}</p>
              <p style={styles.avatarEmail}>{profile.email}</p>
            </div>
          </div>

          {/* Profile form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Personal Information</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={styles.input}
                placeholder="07X XXX XXXX"
              />
            </div>

            <button
              style={saving ? { ...styles.saveBtn, opacity: 0.7 } : styles.saveBtn}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Password change */}
          <div style={styles.card}>
            <div style={styles.passwordHeader}>
              <h3 style={styles.cardTitle}>Password</h3>
              <button
                style={styles.toggleBtn}
                onClick={() => setChangingPassword(!changingPassword)}
              >
                {changingPassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {changingPassword && (
              <div style={styles.passwordForm}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    style={styles.input}
                    placeholder="••••••••"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    style={styles.input}
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    style={styles.input}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  style={savingPassword ? { ...styles.saveBtn, opacity: 0.7 } : styles.saveBtn}
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div style={styles.dangerCard}>
            <h3 style={styles.dangerTitle}>Account</h3>
            <p style={styles.dangerText}>
              Logging out will clear your session. Your wallet and transaction history will be saved.
            </p>
            <button
              style={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user_id")
                localStorage.removeItem("role")
                navigate("/login")
              }}
            >
              🚪 Log Out
            </button>
          </div>

        </div>
      </div>
    </PassengerLayout>
  )
}

const styles = {
  wrapper: { display: "flex", justifyContent: "center", paddingTop: "20px", background: "#f8fafc", minHeight: "100vh" },
  container: { width: "420px", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "40px" },
  backBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "14px", padding: 0, alignSelf: "flex-start", fontWeight: "500" },
  heading: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#111827" },
  message: { color: "#6b7280" },
  successBanner: { background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: "500" },
  avatarSection: { display: "flex", alignItems: "center", gap: "16px" },
  avatar: { width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", flexShrink: 0 },
  avatarName: { margin: 0, fontWeight: "700", fontSize: "16px", color: "#111827" },
  avatarEmail: { margin: "2px 0 0 0", fontSize: "13px", color: "#6b7280" },
  card: { background: "white", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" },
  cardTitle: { margin: 0, fontSize: "15px", fontWeight: "700", color: "#111827" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" },
  saveBtn: { background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  passwordHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  toggleBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  passwordForm: { display: "flex", flexDirection: "column", gap: "14px" },
  dangerCard: { background: "white", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)", border: "1px solid #fee2e2" },
  dangerTitle: { margin: 0, fontSize: "15px", fontWeight: "700", color: "#991b1b" },
  dangerText: { margin: 0, fontSize: "13px", color: "#6b7280" },
  logoutBtn: { background: "#fee2e2", color: "#991b1b", border: "none", padding: "10px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }
}

export default PassengerProfile