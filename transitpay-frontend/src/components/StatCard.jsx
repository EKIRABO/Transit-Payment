function StatCard({ title, value }) {

  return (

    <div style={styles.card}>

      <h3>{title}</h3>

      <h2>{value}</h2>

    </div>

  )

}

const styles = {

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "200px"
  }

}

export default StatCard