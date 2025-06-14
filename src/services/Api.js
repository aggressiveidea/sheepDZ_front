// API service for handling all backend communications
class ApiService {
  constructor() {
    this.baseURL = "http://localhost:5555/api"
    this.token = localStorage.getItem("authToken")
  }

  // Set authorization header
  getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    }
  }

  // Update token when it changes
  updateToken() {
    this.token = localStorage.getItem("authToken")
  }

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      // Always get fresh token
      this.updateToken()

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error Response:", errorData)
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Handle the response structure from your backend
    const authData = response.data || response

    if (authData.token && authData.user) {
      this.token = authData.token
      localStorage.setItem("authToken", authData.token)
      localStorage.setItem("user", JSON.stringify(authData.user))
      localStorage.setItem("userRole", authData.user.role)
    }

    return authData
  }

  async register(userData) {
    // Validate required fields
    if (!userData.cin || isNaN(Number(userData.cin))) {
      throw new Error("CIN must be a valid number")
    }

    if (!userData.payslip || !userData.payslip.startsWith("http")) {
      throw new Error("Payslip must be a valid URL")
    }

    if (!userData.address || !userData.address.trim()) {
      throw new Error("Address is required")
    }

    // Transform frontend data to match backend schema
    const backendData = {
      email: userData.email?.trim(),
      password: userData.password,
      firstName: userData.name?.trim(),
      lastName: userData.lastName?.trim(),
      num_nat: Number(userData.cin),
      address: userData.address?.trim(),
      receiptUrl: userData.payslip?.trim(),
      role: userData.role || "user",
    }

    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(backendData),
    })

    return response.data || response
  }

  async logout() {
    this.token = null
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("userRole")
  }

  // Get current user info
  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  // Get current user role
  getCurrentUserRole() {
    return localStorage.getItem("userRole") || "user"
  }

  // Check if user is admin
  isAdmin() {
    return this.getCurrentUserRole() === "admin"
  }

  // User methods - Fixed to match your backend routes (/api/user)
  async getUsers() {
    return await this.request("/user/all")
  }

  async getUserById(id) {
    return await this.request(`/user/${id}`)
  }

  async updateUser(id, userData) {
    return await this.request(`/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id) {
    return await this.request(`/user/${id}`, {
      method: "DELETE",
    })
  }

  // Distribution Centers methods
  async getCenters() {
    return await this.request("/center/all")
  }

  async getCenterById(id) {
    return await this.request(`/center/${id}`)
  }

  async createCenter(centerData) {
    const backendData = {
      name: centerData.name,
      location: centerData.location,
      weather: centerData.weather,
    }

    return await this.request("/center", {
      method: "POST",
      body: JSON.stringify(backendData),
    })
  }

  async updateCenter(id, centerData) {
    const backendData = {
      name: centerData.name,
      location: centerData.location,
      weather: centerData.weather,
    }

    return await this.request(`/center/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
  }

  async deleteCenter(id) {
    return await this.request(`/center/${id}`, {
      method: "DELETE",
    })
  }

  // Sheep methods
  async getSheep() {
    try {
      const response = await this.request("/sheep/all")
      // Transform backend data to match frontend expectations
      const sheepData = Array.isArray(response) ? response : response.data || []
      return sheepData.map((sheep) => ({
        ...sheep,
        id: sheep._id || sheep.id,
        image: sheep.imageUrl || sheep.image, // Map imageUrl to image
      }))
    } catch (error) {
      console.error("Error fetching sheep:", error)
      return []
    }
  }

  async getSheepById(id) {
    const response = await this.request(`/sheep/${id}`)
    const sheep = response.data || response
    return {
      ...sheep,
      id: sheep._id || sheep.id,
      image: sheep.imageUrl || sheep.image, // Map imageUrl to image
    }
  }

  async createSheep(sheepData) {
    const backendData = {
      price: Number.parseFloat(sheepData.price),
      race: sheepData.race,
      origin: sheepData.origin,
      weight: Number.parseFloat(sheepData.weight),
      age: Number.parseInt(sheepData.age),
      health: sheepData.health || "good",
      imageUrl: sheepData.image || sheepData.imageUrl,
    }

    const response = await this.request("/sheep", {
      method: "POST",
      body: JSON.stringify(backendData),
    })

    // Transform response to match frontend expectations
    const sheep = response.data || response
    return {
      ...sheep,
      id: sheep._id || sheep.id,
      image: sheep.imageUrl || sheep.image,
    }
  }

  async updateSheep(id, sheepData) {
    const backendData = {
      price: Number.parseFloat(sheepData.price),
      race: sheepData.race,
      origin: sheepData.origin,
      weight: Number.parseFloat(sheepData.weight),
      age: Number.parseInt(sheepData.age),
      health: sheepData.health || "good",
      imageUrl: sheepData.image || sheepData.imageUrl,
    }

    const response = await this.request(`/sheep/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })

    // Transform response to match frontend expectations
    const sheep = response.data || response
    return {
      ...sheep,
      id: sheep._id || sheep.id,
      image: sheep.imageUrl || sheep.image,
    }
  }

  async deleteSheep(id) {
    return await this.request(`/sheep/${id}`, {
      method: "DELETE",
    })
  }

  // Appointments (RDV) methods - Fixed to match backend model exactly
  async getAppointments() {
    return await this.request("/rdv")
  }

  async getAppointmentById(id) {
    return await this.request(`/rdv/${id}`)
  }

  async createAppointment(appointmentData) {
    // Create data that matches the ClientRDV model exactly
    const backendData = {
      userId: appointmentData.userId, // This matches the model field name
      pointDeVenteId: appointmentData.pointDeVenteId, // This matches the model field name
      date: appointmentData.date, // Should already be ISO string
      status: appointmentData.status || "pending",
    }

    // Only include optional fields if they exist in your model
    if (appointmentData.reason) {
      backendData.reason = appointmentData.reason
    }
    if (appointmentData.notes) {
      backendData.notes = appointmentData.notes
    }

    console.log("API sending appointment data:", backendData) // Debug log

    return await this.request("/rdv", {
      method: "POST",
      body: JSON.stringify(backendData),
    })
  }

  async updateAppointment(id, appointmentData) {
    // Create data that matches the ClientRDV model exactly
    const backendData = {
      userId: appointmentData.userId, // This matches the model field name
      pointDeVenteId: appointmentData.pointDeVenteId, // This matches the model field name
      date: appointmentData.date, // Should already be ISO string
      status: appointmentData.status || "pending",
    }

    // Only include optional fields if they exist in your model
    if (appointmentData.reason) {
      backendData.reason = appointmentData.reason
    }
    if (appointmentData.notes) {
      backendData.notes = appointmentData.notes
    }

    return await this.request(`/rdv/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
  }

  async deleteAppointment(id) {
    return await this.request(`/rdv/${id}`, {
      method: "DELETE",
    })
  }

  // Notification methods for buy requests
  async createBuyRequest(buyRequestData) {
    const notification = {
      id: Date.now(),
      type: "buy_request",
      userId: buyRequestData.userId,
      userName: buyRequestData.userName,
      userEmail: buyRequestData.userEmail,
      sheepId: buyRequestData.sheepId,
      sheepInfo: buyRequestData.sheepInfo,
      message: `${buyRequestData.userName} wants to buy Sheep #${buyRequestData.sheepId}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...buyRequestData,
    }

    const notifications = this.getNotifications()
    notifications.push(notification)
    localStorage.setItem("admin_notifications", JSON.stringify(notifications))

    return notification
  }

  getNotifications() {
    const notifs = localStorage.getItem("admin_notifications")
    return notifs ? JSON.parse(notifs) : []
  }

  async updateNotificationStatus(notificationId, status, response = null) {
    const notifications = this.getNotifications()
    const notificationIndex = notifications.findIndex((n) => n.id === notificationId)

    if (notificationIndex !== -1) {
      notifications[notificationIndex].status = status
      notifications[notificationIndex].adminResponse = response
      notifications[notificationIndex].updatedAt = new Date().toISOString()

      localStorage.setItem("admin_notifications", JSON.stringify(notifications))
      return notifications[notificationIndex]
    }

    throw new Error("Notification not found")
  }

  async deleteNotification(notificationId) {
    const notifications = this.getNotifications()
    const filteredNotifications = notifications.filter((n) => n.id !== notificationId)
    localStorage.setItem("admin_notifications", JSON.stringify(filteredNotifications))
    return true
  }
}

export default new ApiService()

