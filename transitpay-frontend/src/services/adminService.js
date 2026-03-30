const BASE_URL = "http://localhost:8000/admin"

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
})

export const getRoutes = async () => {
  const res = await fetch(`${BASE_URL}/routes`, { headers: authHeaders() })
  return res.json()
}

export const getBuses = async () => {
  const res = await fetch(`${BASE_URL}/buses`, { headers: authHeaders() })
  return res.json()
}

export const getPayments = async () => {
  const res = await fetch("http://localhost:8000/payment", { headers: authHeaders() })
  return res.json()
}

export const getUsers = async () => {
  const res = await fetch("http://localhost:8000/users", { headers: authHeaders() })
  return res.json()
}

export const updateUserStatus = async (userId, status) => {
  const res = await fetch(`http://localhost:8000/users/${userId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to update user status")
  return data
}

export const deleteUser = async (userId) => {
  const res = await fetch(`http://localhost:8000/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to delete user")
  return data
}

export const getUserWallet = async (userId) => {
  const res = await fetch(`http://localhost:8000/wallets/${userId}`, {
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to fetch wallet")
  return data
}

export const adjustUserWallet = async (userId, amount, type) => {
  const res = await fetch(`http://localhost:8000/wallets/adjust`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ user_id: userId, amount, type })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to adjust wallet")
  return data
}