

import { createContext, useContext, useState, useEffect } from "react"
import ApiService from "../services/Api"

const AuthContext = createContext()

// Demo account data
const DEMO_ACCOUNTS = {
  user: {
    id: "demo-user-001",
    name: "John",
    lastName: "Doe",
    email: "demo.user@example.com",
    cin: "12345678",
    payslip: "https://example.com/demo-payslip.pdf",
    address: "123 Demo Street, Demo City, DC 12345",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  admin: {
    id: "demo-admin-001",
    name: "Jane",
    lastName: "Smith",
    email: "demo.admin@example.com",
    cin: "87654321",
    payslip: "https://example.com/admin-payslip.pdf",
    address: "456 Admin Avenue, Admin City, AC 54321",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40"
  }
}

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    const userRole = localStorage.getItem("userRole")

    if (token && userData) {
      const parsedUser = JSON.parse(userData)
      // Ensure role is available
      if (!parsedUser.role && userRole) {
        parsedUser.role = userRole
      }
      setUser(parsedUser)
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials)

      if (response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      }

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const demoLogin = async (accountType) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const demoUser = DEMO_ACCOUNTS[accountType]
      if (!demoUser) {
        throw new Error("Invalid demo account type")
      }

      // Generate a demo token
      const demoToken = `demo-token-${accountType}-${Date.now()}`
      
      // Set user state
      setUser(demoUser)
      setIsAuthenticated(true)

      // Store in localStorage (simulating real auth flow)
      localStorage.setItem("authToken", demoToken)
      localStorage.setItem("user", JSON.stringify(demoUser))
      localStorage.setItem("userRole", demoUser.role)

      // Update API service token if it exists
      if (ApiService.token !== undefined) {
        ApiService.token = demoToken
      }

      return {
        success: true,
        user: demoUser,
        token: demoToken,
        message: `Logged in as demo ${accountType}`
      }
    } catch (error) {
      console.error("Demo login error:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData)

      // If registration includes login (token + user), set auth state
      if (response.token && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)

        // Store auth data
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        localStorage.setItem("userRole", response.user.role)

        // Update API service token
        ApiService.token = response.token
      }

      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    ApiService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUserProfile = async (userData) => {
    try {
      const response = await ApiService.updateUser(user._id || user.id, userData)

      if (response.user) {
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
        localStorage.setItem("userRole", response.user.role)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  // Helper functions
  const isAdmin = () => {
    return user?.role === "admin" || ApiService.isAdmin()
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const isDemoAccount = () => {
    const token = localStorage.getItem("authToken")
    return token && token.startsWith("demo-token-")
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    demoLogin,
    register,
    logout,
    updateUserProfile,
    isAdmin,
    hasRole,
    isDemoAccount,
    demoAccounts: DEMO_ACCOUNTS,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
