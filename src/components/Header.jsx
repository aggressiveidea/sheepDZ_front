import { useAuth } from "../context/AuthContext"
import "../styles/Header.css"

const Header = ({ title }) => {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        <div className="header-user">
          <div className="user-avatar">{user?.firstName?.charAt(0) || "U"}</div>
          <span className="user-name">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
