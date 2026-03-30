import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  // Check if token is expired by decoding the payload
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const isExpired = payload.exp * 1000 < Date.now()

    if (isExpired) {
      // Clear all stored data and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("role")
      return <Navigate to="/login" />
    }
  } catch (e) {
    // Token is malformed — clear and redirect
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("role")
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute