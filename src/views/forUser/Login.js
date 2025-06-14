

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { WheatIcon as Sheep, Eye, EyeOff, User, Shield, Play } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(null)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const { login, demoLogin, demoAccounts } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await login(formData)

      
      if (response.user.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (accountType) => {
    setDemoLoading(accountType)
    setError("")

    try {
      const response = await demoLogin(accountType)
      
      
      if (response.user.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      setError(`Demo login failed: ${error.message}`)
    } finally {
      setDemoLoading(null)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Sheep className="logo-icon" />
          </div>
          <h1 className="auth-title">WELCOME BACK</h1>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        </div>

        {/* Demo Login Section */}
        <div className="demo-section">
          <div className="demo-header">
            <Play size={16} />
            <span>Try Demo Accounts</span>
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-button demo-user"
              onClick={() => handleDemoLogin('user')}
              disabled={demoLoading !== null || loading}
            >
              <User size={18} />
              <div className="demo-info">
                <span className="demo-title">Demo User</span>
                <span className="demo-subtitle">{demoAccounts.user.name} {demoAccounts.user.lastName}</span>
              </div>
              {demoLoading === 'user' && <div className="demo-spinner" />}
            </button>
            
            <button
              type="button"
              className="demo-button demo-admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={demoLoading !== null || loading}
            >
              <Shield size={18} />
              <div className="demo-info">
                <span className="demo-title">Demo Admin</span>
                <span className="demo-subtitle">{demoAccounts.admin.name} {demoAccounts.admin.lastName}</span>
              </div>
              {demoLoading === 'admin' && <div className="demo-spinner" />}
            </button>
          </div>
        </div>

        <div className="divider">
          <span>or continue with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span className="checkbox-text">Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading || demoLoading !== null}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="auth-footer">
            Don't have an account?
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
