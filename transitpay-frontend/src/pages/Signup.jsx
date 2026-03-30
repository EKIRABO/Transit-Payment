import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup } from "../services/AuthService"

function Signup() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {

    e.preventDefault()

    if (!name || !email || !password) {
      alert("Please fill all required fields")
      return
    }

    if (!email.includes("@")) {
      alert("Enter a valid email")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    try {

      setLoading(true)

      const user = await signup({
        name,
        email,
        password,
        phone
      })

      console.log("User created:", user)

     
      setName("")
      setEmail("")
      setPassword("")
      setPhone("")

     
      alert("Account created successfully ")

   
      navigate("/login")

    } catch (error) {

      alert(error.message || "Signup failed")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1>TransitPay</h1>
        <p style={styles.subtitle}>Create your account</p>

        <form onSubmit={handleSignup} style={styles.form}>

          <input
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

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
    background: "#f1f5f9"
  },

  card: {
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  },

  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },

  footer: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#6b7280"
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold"
  }

}

export default Signup