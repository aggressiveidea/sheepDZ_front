import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Verify token validity
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [token])

  const verifyToken = async () => {
    try {
      // You might want to add a verify endpoint to your backend
      const userData = JSON.parse(localStorage.getItem("user"))
      if (userData) {
        setUser(userData)
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5555/api/auth/login", {
        email,
        password,
      })

      if (response.data.success) {
        const { token, user } = response.data.data
        setToken(token)
        setUser(user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        return { success: true }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("http://localhost:5555/api/auth/register", userData)

      if (response.data.success) {
        const { token, user } = response.data.data
        setToken(token)
        setUser(user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        return { success: true }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
