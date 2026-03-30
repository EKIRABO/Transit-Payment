import { useEffect, useState } from "react"
import {
  getUsers,
  updateUserStatus,
  deleteUser,
  getUserWallet,
  adjustUserWallet
} from "../services/adminService"
import AdminLayout from "./AdminLayout"

function AdminUsers() {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [wallets, setWallets] = useState({})
  const [adjusting, setAdjusting] = useState(null)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [adjustType, setAdjustType] = useState("add")
  const [loadingAction, setLoadingAction] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      const userList = Array.isArray(data) ? data : []
      setUsers(userList)
      const walletData = {}
      await Promise.all(userList.map(async (user) => {
        try {
          const wallet = await getUserWallet(user.id)
          walletData[user.id] = wallet?.balance ?? "N/A"
        } catch { walletData[user.id] = "N/A" }
      }))
      setWallets(walletData)
    } catch (error) { console.error(error) }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    if (!window.confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Activate'} ${user.name}?`)) return
    try {
      setLoadingAction(user.id)
      await updateUserStatus(user.id, newStatus)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    } catch (error) { alert(error.message) }
    finally { setLoadingAction(null) }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return
    try {
      setLoadingAction(user.id)
      await deleteUser(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (error) { alert(error.message) }
    finally { setLoadingAction(null) }
  }

  const handleAdjustWallet = async (userId) => {
    if (!adjustAmount || Number(adjustAmount) <= 0) { alert("Enter a valid amount"); return }
    try {
      setLoadingAction(userId)
      await adjustUserWallet(userId, Number(adjustAmount), adjustType)
      const wallet = await getUserWallet(userId)
      setWallets(prev => ({ ...prev, [userId]: wallet?.balance ?? "N/A" }))
      setAdjusting(null)
      setAdjustAmount("")
    } catch (error) { alert(error.message) }
    finally { setLoadingAction(null) }
  }

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Users Management</h2>
          <span style={styles.count}>{filteredUsers.length} users</span>
        </div>
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={styles.search} />
        <div style={styles.cardBox}>
          {filteredUsers.length === 0 ? <p style={styles.empty}>No users found</p> : (
            filteredUsers.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.left}>
                  <div style={{ ...styles.avatar, background: user.status === 'suspended' ? '#ef4444' : '#3b82f6' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.nameRow}>
                      <h4 style={styles.name}>{user.name}</h4>
                      <span style={user.role === 'admin' ? styles.badgeAdmin : styles.badgePassenger}>{user.role}</span>
                      <span style={user.status === 'suspended' ? styles.badgeSuspended : styles.badgeActive}>{user.status || 'active'}</span>
                    </div>
                    <p style={styles.email}>{user.email}</p>
                    <p style={styles.wallet}>💳 Wallet: <strong>{wallets[user.id] !== undefined && wallets[user.id] !== "N/A" ? `RWF ${Number(wallets[user.id]).toLocaleString()}` : "No wallet"}</strong></p>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button style={styles.btnAdjust} onClick={() => setAdjusting(adjusting === user.id ? null : user.id)}>💰 Adjust Wallet</button>
                  <button style={user.status === 'suspended' ? styles.btnActivate : styles.btnSuspend}
                    onClick={() => handleToggleStatus(user)} disabled={loadingAction === user.id}>
                    {loadingAction === user.id ? "..." : user.status === 'suspended' ? "✅ Activate" : "⛔ Suspend"}
                  </button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(user)} disabled={loadingAction === user.id}>
                    {loadingAction === user.id ? "..." : "🗑️ Delete"}
                  </button>
                </div>
                {adjusting === user.id && (
                  <div style={styles.adjustPanel}>
                    <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)} style={styles.select}>
                      <option value="add">Add funds</option>
                      <option value="deduct">Deduct funds</option>
                    </select>
                    <input type="number" placeholder="Amount (RWF)" value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)} style={styles.adjustInput} />
                    <button style={styles.btnConfirm} onClick={() => handleAdjustWallet(user.id)} disabled={loadingAction === user.id}>
                      {loadingAction === user.id ? "..." : "Confirm"}
                    </button>
                    <button style={styles.btnCancel} onClick={() => { setAdjusting(null); setAdjustAmount("") }}>Cancel</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px" },
  headerRow: { display: "flex", alignItems: "center", gap: "12px" },
  title: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#111827" },
  count: { background: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "999px", fontSize: "13px", fontWeight: "600" },
  search: { padding: "12px 15px", borderRadius: "10px", border: "1px solid #e5e7eb", width: "300px", outline: "none", fontSize: "14px" },
  cardBox: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px" },
  empty: { color: "#6b7280", fontSize: "14px" },
  userCard: { display: "flex", flexDirection: "column", gap: "10px", padding: "16px", borderRadius: "10px", background: "#f9fafb", border: "1px solid #f3f4f6" },
  left: { display: "flex", alignItems: "flex-start", gap: "14px" },
  avatar: { width: "42px", height: "42px", borderRadius: "50%", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "16px", flexShrink: 0 },
  nameRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  name: { margin: 0, fontSize: "15px", fontWeight: "600", color: "#111827" },
  email: { margin: "4px 0 0 0", color: "#6b7280", fontSize: "13px" },
  wallet: { margin: "4px 0 0 0", fontSize: "13px", color: "#374151" },
  badgeAdmin: { background: "#fef9c3", color: "#854d0e", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" },
  badgePassenger: { background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" },
  badgeActive: { background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" },
  badgeSuspended: { background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  btnAdjust: { padding: "7px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#374151" },
  btnSuspend: { padding: "7px 12px", borderRadius: "8px", border: "none", background: "#fef3c7", color: "#92400e", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  btnActivate: { padding: "7px 12px", borderRadius: "8px", border: "none", background: "#dcfce7", color: "#166534", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  btnDelete: { padding: "7px 12px", borderRadius: "8px", border: "none", background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  adjustPanel: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" },
  select: { padding: "8px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none" },
  adjustInput: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", outline: "none", width: "140px" },
  btnConfirm: { padding: "8px 14px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  btnCancel: { padding: "8px 14px", borderRadius: "8px", border: "none", background: "#f3f4f6", color: "#374151", cursor: "pointer", fontSize: "13px" }
}

export default AdminUsers