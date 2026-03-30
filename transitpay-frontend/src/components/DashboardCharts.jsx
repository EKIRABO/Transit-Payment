import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

const dailyData = [
  { day: "Mon", value: 42000 },
  { day: "Tue", value: 45000 },
  { day: "Wed", value: 39000 },
  { day: "Thu", value: 52000 },
  { day: "Fri", value: 48000 },
  { day: "Sat", value: 37000 },
  { day: "Sun", value: 34000 }
]

const revenueData = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 195000 },
  { month: "Mar", revenue: 215000 },
  { month: "Apr", revenue: 205000 },
  { month: "May", revenue: 240000 },
  { month: "Jun", revenue: 265000 }
]

function DashboardCharts() {

  return (

    <div style={styles.container}>


      <div style={styles.chartCard}>

        <h3>Daily Transactions</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

      </div>



      <div style={styles.chartCard}>

        <h3>Revenue Trend</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>

  )

}

const styles = {

  container: {
    display: "flex",
    gap: "20px",
    marginTop: "30px"
  },

  chartCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }

}

export default DashboardCharts