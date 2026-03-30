import { useEffect, useState } from "react"
import { getBuses } from "../services/adminService"
import AdminLayout from "./AdminLayout"

function AdminBuses() {

  const [buses, setBuses] = useState([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    plate_number: "",
    route_id: "",
    capacity: ""
  })

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await getBuses()
        setBuses(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBuses()
  }, [])

  
  const filteredBuses = buses.filter((b) =>
    b.plate_number.toLowerCase().includes(search.toLowerCase())
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

        <h2>Buses Management</h2>

      
        <div style={styles.topBar}>

          <input
            type="text"
            placeholder="Search buses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <button
            style={styles.button}
            onClick={() => setShowForm(!showForm)}
          >
            + Add Bus
          </button>

        </div>

       
        {showForm && (
          <div style={styles.formBox}>

            <input
              name="plate_number"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="route_id"
              placeholder="Route ID"
              value={formData.route_id}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
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
                <th style={styles.th}>Bus ID</th>
                <th style={styles.th}>Plate Number</th>
                <th style={styles.th}>Route ID</th>
                <th style={styles.th}>Capacity</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredBuses.map((bus, index) => (

                <tr key={bus.id} style={styles.row}>

                  <td style={styles.td}>B-00{index + 1}</td>
                  <td style={styles.td}>{bus.plate_number}</td>
                  <td style={styles.td}>{bus.route_id}</td>
                  <td style={styles.td}>{bus.capacity} seats</td>

                  <td style={styles.td}>
                    <span style={styles.active}>Active</span>
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

export default AdminBuses