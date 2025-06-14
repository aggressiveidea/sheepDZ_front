"use client"

import { createContext, useContext, useState, useEffect } from "react"
import ApiService from "../services/Api"

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

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
