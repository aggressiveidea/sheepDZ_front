import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/sidebare.css"

const Sidebar = ({ userType = "user" }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const userMenuItems = [
    { path: "/user/dashboard", label: "Home", icon: "🏠" },
    { path: "/user/sheeps", label: "Sheeps", icon: "🐑" },
    { path: "/user/appointments", label: "Appointments", icon: "📅" },
    { path: "/user/payment", label: "Payment", icon: "💳" },
  ]

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/sheeps", label: "Sheeps", icon: "🐑" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/appointments", label: "Appointments", icon: "📅" },
    { path: "/admin/points-of-sale", label: "Point of sale", icon: "🏪" },
  ]

  const menuItems = userType === "admin" ? adminMenuItems : userMenuItems

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🐑</span>
          <span className="logo-text">Sheepfy</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar