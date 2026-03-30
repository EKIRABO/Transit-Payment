import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

function Layout({ children }) {

  return (

    <div style={styles.container}>

      <Sidebar />

      <div style={styles.content}>

        <Topbar />

        <div style={styles.pageContent}>
          {children}
        </div>

      </div>

    </div>

  )

}

const styles = {

  container: {
    display: "flex"
  },

  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
    height: "100vh"
  },

  pageContent: {
    padding: "30px",
    overflow: "auto"
  }

}

export default Layout