import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/authService"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    try {

      setLoading(true)

      const data = await login(email, password)

      console.log("Login response:", data)

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("user_id", data.user.id)

      if (data.user.role === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/passenger-dashboard")
      }

    } catch (error) {

      alert(error.message || "Login failed")

    } finally {

      setLoading(false)

    }

  }

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>TransitPay</h1>
        <p style={styles.subtitle}>Smart Transit Payment System</p>

        <form onSubmit={handleLogin} style={styles.form}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Sign up
            </Link>
          </p>

        </form>

      </div>

    </div>
  )
}

const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  },

  footer: {
    marginTop: "10px",
    fontSize: "14px",
    textAlign: "center"
  },

  link: {
    color: "#2563eb",
    fontWeight: "bold"
  }

}

export default Login