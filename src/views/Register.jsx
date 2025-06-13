"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Auth.css"

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    num_nat: "",
    receiptUrl: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard")
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (isNaN(Number(formData.num_nat))) {
      setError("CIN must be a valid number")
      setLoading(false)
      return
    }

    const { confirmPassword, ...rest } = formData

    const registrationData = {
      ...rest,
      num_nat: Number(rest.num_nat),
    }

    const result = await register(registrationData)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <Link to="/login" className="auth-tab">
          Login User
        </Link>
        <span className="auth-tab active">Sign up</span>
      </div>

      <div className="auth-content">
        <div className="auth-panel register-panel">
          <div className="auth-form-container">
            <h2 className="auth-title">GET STARTED NOW</h2>
            <p className="auth-subtitle">Welcome! Please enter your details</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>CIN</label>
                <input
                  type="number"
                  name="num_nat"
                  value={formData.num_nat}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Payslip</label>
                <div className="file-input-container">
                  <input
                    type="url"
                    name="receiptUrl"
                    value={formData.receiptUrl}
                    onChange={handleChange}
                    placeholder="Enter receipt URL"
                    required
                    className="form-input"
                  />
                  <span className="file-icon">📎</span>
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </button>

              <p className="auth-footer">
                Do you have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
