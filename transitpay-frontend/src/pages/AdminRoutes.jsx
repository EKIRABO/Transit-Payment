import { useEffect, useState } from "react"
import { getRoutes } from "../services/adminService"
import AdminLayout from "./AdminLayout"

function AdminRoutes() {

  const [routes, setRoutes] = useState([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    start_location: "",
    end_location: "",
    fare: ""
  })

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getRoutes()
        setRoutes(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRoutes()
  }, [])

  const filteredRoutes = routes.filter((r) =>
    r.start_location.toLowerCase().includes(search.toLowerCase()) ||
    r.end_location.toLowerCase().includes(search.toLowerCase())
  )

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AdminLayout>

      <div style={styles.container}>

        <h2>Routes Management</h2>

        <div style={styles.topBar}>

          <input
            type="text"
            placeholder="Search routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <button
            style={styles.button}
            onClick={() => setShowForm(!showForm)}
          >
            + Add Route
          </button>

        </div>

        {showForm && (
          <div style={styles.formBox}>

            <input
              name="start_location"
              placeholder="Start Location"
              value={formData.start_location}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="end_location"
              placeholder="Destination"
              value={formData.end_location}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="fare"
              placeholder="Fare"
              value={formData.fare}
              onChange={handleChange}
              style={styles.input}
            />

            <button style={styles.button}>Save</button>

          </div>
        )}

       
        <div style={styles.tableBox}>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Route ID</th>
                <th style={styles.th}>Start Location</th>
                <th style={styles.th}>Destination</th>
                <th style={styles.th}>Fare</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredRoutes.map((route, index) => (

                <tr key={route.id} style={styles.row}>

                  <td style={styles.td}>R-00{index + 1}</td>
                  <td style={styles.td}>{route.start_location}</td>
                  <td style={styles.td}>{route.end_location}</td>
                  <td style={styles.td}>{route.fare} RWF</td>

                  <td style={styles.td}>
                    <span style={styles.active}>
                      Active
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  )
}

const styles = {

  container: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  search: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    width: "250px",
    outline: "none"
  },

  button: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500"
  },

  formBox: {
    display: "flex",
    gap: "10px",
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },

  tableBox: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    textAlign: "left",
    padding: "15px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb"
  },

  td: {
    padding: "15px",
    fontSize: "14px",
    color: "#111827"
  },

  row: {
    borderBottom: "1px solid #f3f4f6"
  },

  active: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500"
  }

}

export default AdminRoutes