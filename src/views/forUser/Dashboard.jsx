import Sidebar from "../../components/sideBar"
import Header from "../../components/Header"
import "../../styles/Dashboard.css"

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar userType="user" />
      <div className="main-content">
        <Header title="Home" />
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to Sheepfy</h2>
            <p>Manage your sheep, appointments, and payments all in one place.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🐑</div>
              <div className="stat-info">
                <h3>My Sheep</h3>
                <p className="stat-number">12</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Appointments</h3>
                <p className="stat-number">3</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💳</div>
              <div className="stat-info">
                <h3>Payments</h3>
                <p className="stat-number">$1,250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
