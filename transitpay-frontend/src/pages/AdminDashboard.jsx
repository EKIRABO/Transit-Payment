import { useEffect, useState } from "react"
import { getRoutes, getBuses, getPayments } from "../services/adminService"
import AdminLayout from "./AdminLayout"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts"

function AdminDashboard() {

  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {

    const fetchData = async () => {
      try {

        const [routesData, busesData, paymentsData] = await Promise.all([
          getRoutes(),
          getBuses(),
          getPayments()
        ])

        setRoutes(routesData)
        setBuses(busesData)
        setPayments(paymentsData)

      } catch (error) {
        console.error(error)
      }
    }

    fetchData()

  }, [])

  // ✅ FIXED: ordered daily transactions
  const transactionsData = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => {
    const total = payments
      .filter(p => {
        const d = new Date(p.created_at).toLocaleDateString("en-US", { weekday: "short" })
        return d === day
      })
      .reduce((sum, p) => sum + Number(p.amount), 0)

    return { day, amount: total }
  })

  // ✅ FIXED: ordered monthly revenue
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const revenueData = months.map(month => {
    const total = payments
      .filter(p => {
        const m = new Date(p.created_at).toLocaleDateString("en-US", { month: "short" })
        return m === month
      })
      .reduce((sum, p) => sum + Number(p.amount), 0)

    return { month, value: total }
  }).filter(item => item.value > 0)

  // ✅ total revenue
  const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  return (
    <AdminLayout>

      <div style={styles.container}>

        <div style={styles.cards}>

          <div style={styles.card}>
            <h4>Total Routes</h4>
            <h2>{routes.length}</h2>
          </div>

          <div style={styles.card}>
            <h4>Total Buses</h4>
            <h2>{buses.length}</h2>
          </div>

          <div style={styles.card}>
            <h4>Total Revenue</h4>
            <h2>{totalRevenue} RWF</h2>
          </div>

          <div style={styles.card}>
            <h4>Total Transactions</h4>
            <h2>{payments.length}</h2>
          </div>

        </div>

        <div style={styles.charts}>

          <div style={styles.chartBox}>
            <h3>Daily Transactions</h3>

            <BarChart width={500} height={300} data={transactionsData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </div>

          <div style={styles.chartBox}>
            <h3>Revenue Trend</h3>

            <LineChart width={500} height={300} data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" />
              <Line type="monotone" dataKey="value" stroke="#10b981" />
            </LineChart>
          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

const styles = {

  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  charts: {
    display: "flex",
    gap: "30px"
  },

  chartBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }

}

export default AdminDashboard