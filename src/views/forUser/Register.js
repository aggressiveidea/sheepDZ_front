

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    cin: "",
    payslip: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.cin.trim()) {
      setError("CIN is required")
      return false
    }
    if (isNaN(Number(formData.cin))) {
      setError("CIN must be a valid number")
      return false
    }
    if (!formData.payslip.trim()) {
      setError("Payslip URL is required")
      return false
    }
    if (!formData.payslip.startsWith("http")) {
      setError("Payslip must be a valid URL starting with http://or https:///")
      return false
    }
    if (!formData.address.trim()) {
      setError("Address is required")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      console.log("Form data being submitted:", formData)
      const response = await register(formData)

      
      if (response && response.user) {
        console.log("Registration successful, user role:", response.user.role)

        
        if (response.user.role === "admin") {
          navigate("/admin/dashboard")
        } else {
          navigate("/dashboard")
        }
      } else {
        
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1 className="auth-title">GET STARTED NOW</h1>
          <p className="auth-subtitle">Welcome! Please enter your details.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
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
            <label htmlFor="cin" className="form-label">
              CIN (National ID Number) *
            </label>
            <input
              type="text"
              id="cin"
              name="cin"
              className="form-input"
              value={formData.cin}
              onChange={handleChange}
              placeholder="e.g., 12345678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payslip" className="form-label">
              Payslip URL *
            </label>
            <input
              type="url"
              id="payslip"
              name="payslip"
              className="form-input"
              value={formData.payslip}
              onChange={handleChange}
              placeholder="https://example.com/payslip.pdf"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your full address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password *
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="auth-footer">
            Do you have an account?
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
