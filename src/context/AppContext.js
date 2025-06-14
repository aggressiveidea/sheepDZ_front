

import { createContext, useContext, useState, useCallback } from "react"
import ApiService from "../services/Api"

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [centers, setCenters] = useState([])
  const [appointments, setAppointments] = useState([])
  const [sheep, setSheep] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  
  const [notifications, setNotifications] = useState([])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ApiService.getUsers()
      
      const usersData = Array.isArray(response) ? response : response.data || []
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message || "Failed to fetch users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCenters = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ApiService.getCenters()
      const centersData = Array.isArray(response) ? response : response.data || []
      setCenters(centersData)
    } catch (error) {
      console.error("Error fetching centers:", error)
      setError(error.message || "Failed to fetch centers")
      setCenters([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addCenter = useCallback(
    async (centerData) => {
      try {
        await ApiService.createCenter(centerData)
        fetchCenters() 
      } catch (error) {
        console.error("Error adding center:", error)
        throw error
      }
    },
    [fetchCenters],
  )

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ApiService.getAppointments()
      const appointmentsData = Array.isArray(response) ? response : response.data || []
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError(error.message || "Failed to fetch appointments")
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addAppointment = useCallback(
    async (appointmentData) => {
      try {
        await ApiService.createAppointment(appointmentData)
        fetchAppointments() 
      } catch (error) {
        console.error("Error adding appointment:", error)
        throw error
      }
    },
    [fetchAppointments],
  )

  const updateAppointment = useCallback(
    async (id, appointmentData) => {
      try {
        await ApiService.updateAppointment(id, appointmentData)
        fetchAppointments() 
      } catch (error) {
        console.error("Error updating appointment:", error)
        throw error
      }
    },
    [fetchAppointments],
  )

  const deleteAppointment = useCallback(
    async (id) => {
      try {
        await ApiService.deleteAppointment(id)
        fetchAppointments() 
      } catch (error) {
        console.error("Error deleting appointment:", error)
        throw error
      }
    },
    [fetchAppointments],
  )

  const fetchSheep = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ApiService.getSheep()
      const sheepData = Array.isArray(response) ? response : response.data || []
      setSheep(sheepData)
    } catch (error) {
      console.error("Error fetching sheep:", error)
      setError(error.message || "Failed to fetch sheep")
      setSheep([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addSheep = useCallback(
    async (sheepData) => {
      try {
        await ApiService.createSheep(sheepData)
        fetchSheep() 
      } catch (error) {
        console.error("Error adding sheep:", error)
        throw error
      }
    },
    [fetchSheep],
  )

  const updateSheep = useCallback(
    async (id, sheepData) => {
      try {
        await ApiService.updateSheep(id, sheepData)
        fetchSheep() 
      } catch (error) {
        console.error("Error updating sheep:", error)
        throw error
      }
    },
    [fetchSheep],
  )

  const deleteSheep = useCallback(
    async (id) => {
      try {
        await ApiService.deleteSheep(id)
        fetchSheep() 
      } catch (error) {
        console.error("Error deleting sheep:", error)
        throw error
      }
    },
    [fetchSheep],
  )

  
  const getUserById = useCallback(async (id) => {
    try {
      return await ApiService.getUserById(id)
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }, [])

  const getCenterById = useCallback(async (id) => {
    try {
      return await ApiService.getCenterById(id)
    } catch (error) {
      console.error("Error fetching center:", error)
      return null
    }
  }, [])

  
  const getNotifications = useCallback(() => {
    try {
      return ApiService.getNotifications()
    } catch (error) {
      console.error("Error getting notifications:", error)
      return []
    }
  }, [])

  const createBuyRequest = useCallback(async (buyRequestData) => {
    try {
      return await ApiService.createBuyRequest(buyRequestData)
    } catch (error) {
      console.error("Error creating buy request:", error)
      throw error
    }
  }, [])

  const updateNotificationStatus = useCallback(async (notificationId, status, response = null) => {
    try {
      return await ApiService.updateNotificationStatus(notificationId, status, response)
    } catch (error) {
      console.error("Error updating notification:", error)
      throw error
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      return await ApiService.deleteNotification(notificationId)
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }, [])

  const value = {
    users,
    centers,
    appointments,
    sheep,
    notifications,
    loading,
    error,
    fetchUsers,
    fetchCenters,
    fetchAppointments,
    fetchSheep,
    addCenter,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addSheep,
    updateSheep,
    deleteSheep,
    getUserById,
    getCenterById,
    getNotifications,
    createBuyRequest,
    updateNotificationStatus,
    deleteNotification,
    setUsers,
    setCenters,
    setAppointments,
    setSheep,
    setNotifications,
    setError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
