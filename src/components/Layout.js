"use client"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Home,
  Users,
  Calendar,
  CreditCard,
  MapPin,
  User,
  LogOut,
  WheatIcon as Sheep,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Base menu items that both users and admins can access
  const baseMenuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", adminOnly: false },
    { icon: Sheep, label: "Sheeps", path: "/sheeps", adminOnly: false },
    { icon: MapPin, label: "Point of sale", path: "/point-of-sale", adminOnly: false },
    { icon: Calendar, label: "Appointments", path: "/appointments", adminOnly: false },
    { icon: CreditCard, label: "Payment", path: "/payment", adminOnly: false },
  ]

  // Admin-only menu items
  const adminMenuItems = [
    { icon: BarChart3, label: "Admin statistics", path: "/admin/dashboard", adminOnly: true },
    { icon: Users, label: "Users Management", path: "/users", adminOnly: true },
    { icon: Bell, label: "Notifications", path: "/notifications", adminOnly: true },
  
  ]

  // Combine menu items based on user role
  const menuItems = user?.role === "admin" ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems

  const getPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname)
    if (currentItem) {
      return currentItem.label
    }

    // Handle profile page
    if (location.pathname === "/profile") {
      return "Profile"
    }

    return "Dashboard"
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Sheep className="logo-icon" />
            <span className="logo-text">Sheepfy</span>
          </div>
          {user?.role === "admin" && (
            <div className="admin-badge">
              <span className="admin-text">Admin Panel</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.adminOnly && <span className="admin-indicator">★</span>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="profile-nav-btn" onClick={() => navigate("/profile")}>
            <User className="nav-icon" />
            <span className="nav-label">Profile</span>
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">{getPageTitle()}</h1>
              {user?.role === "admin" && <span className="role-badge admin">Admin</span>}
            </div>
            <div className="user-profile">
              <button className="profile-btn" onClick={() => navigate("/profile")}>
                <User className="profile-icon" />
                <div className="profile-info">
                  <span className="profile-name">{user?.firstName || user?.name || "User"}</span>
                  <span className="profile-role">{user?.role || "user"}</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  )
}

export default Layout
