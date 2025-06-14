"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useApp } from "../../context/AppContext"
import Modal from "../../components/Modal"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import ApiService from "../../services/Api"

const Appointments = () => {
  const { user } = useAuth()
  const { appointments, fetchAppointments, addAppointment, updateAppointment, deleteAppointment } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    userId: "", // Changed from clientId to userId to match backend
    pointDeVenteId: "",
    status: "pending",
    reason: "",
    notes: "",
  })

  const [availableUsers, setAvailableUsers] = useState([])
  const [availableCenters, setAvailableCenters] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Check if user is admin
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Fetch users and centers for dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (isAdmin) {
        setLoadingData(true)
        try {
          const [usersResponse, centersResponse] = await Promise.all([ApiService.getUsers(), ApiService.getCenters()])

          const usersData = Array.isArray(usersResponse) ? usersResponse : usersResponse.data || []
          const centersData = Array.isArray(centersResponse) ? centersResponse : centersResponse.data || []

          setAvailableUsers(usersData)
          setAvailableCenters(centersData)
        } catch (error) {
          console.error("Error fetching dropdown data:", error)
        } finally {
          setLoadingData(false)
        }
      }
    }

    fetchDropdownData()
  }, [isAdmin])

  // Helper function to safely extract display values
  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === "object") {
      // Handle user object
      if (value.firstName && value.lastName) {
        return `${value.firstName} ${value.lastName}`
      }
      if (value.email) {
        return value.email
      }
      if (value._id || value.id) {
        return value._id || value.id
      }
      return "N/A"
    }
    return String(value)
  }

  // Helper function to get user display
  const getUserDisplay = (userObj) => {
    if (!userObj) return "N/A"
    if (typeof userObj === "object") {
      if (userObj.firstName && userObj.lastName) {
        return `${userObj.firstName} ${userObj.lastName}`
      }
      if (userObj.email) {
        return userObj.email
      }
      return userObj._id || userObj.id || "Unknown User"
    }
    return String(userObj)
  }

  // Helper function to get point of sale display
  const getPointOfSaleDisplay = (pos) => {
    if (!pos) return "N/A"
    if (typeof pos === "object") {
      return pos.name || pos._id || pos.id || "Unknown Center"
    }
    return String(pos)
  }

  // Helper function to format date
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A"
    try {
      const date = new Date(dateValue)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    } catch (error) {
      return String(dateValue)
    }
  }

  // Helper function to format datetime-local input
  const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) return ""
    try {
      const date = new Date(dateValue)
      return date.toISOString().slice(0, 16)
    } catch (error) {
      return ""
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase()
    const userDisplay = getUserDisplay(appointment.user || appointment.userId || appointment.clientId).toLowerCase()
    const pointDisplay = getPointOfSaleDisplay(appointment.pointOfSale || appointment.pointDeVenteId).toLowerCase()

    return userDisplay.includes(searchLower) || pointDisplay.includes(searchLower)
  })

  const handleAddAppointment = () => {
    setFormData({
      date: "",
      userId: "", // Changed from clientId to userId
      pointDeVenteId: "",
      status: "pending",
      reason: "",
      notes: "",
    })
    setShowAddModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)

    // Extract IDs from objects if needed
    const userId = appointment.user?._id || appointment.user?.id || appointment.userId || appointment.clientId || ""
    const pointDeVenteId =
      appointment.pointOfSale?._id || appointment.pointOfSale?.id || appointment.pointDeVenteId || ""

    setFormData({
      date: formatDateTimeLocal(appointment.date),
      userId: String(userId), // Changed from clientId to userId
      pointDeVenteId: String(pointDeVenteId),
      status: appointment.status || "pending",
      reason: appointment.reason || "",
      notes: appointment.notes || "",
    })
    setShowEditModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate required fields
      if (!formData.date || !formData.userId || !formData.pointDeVenteId) {
        alert("Please fill in all required fields")
        return
      }

      // Create appointment data that matches backend model exactly
      const appointmentData = {
        userId: formData.userId, // This matches the backend model
        pointDeVenteId: formData.pointDeVenteId, // This matches the backend model
        date: new Date(formData.date).toISOString(), // Ensure proper date format
        status: formData.status,
      }

      // Only include optional fields if they have values
      if (formData.reason && formData.reason.trim()) {
        appointmentData.reason = formData.reason.trim()
      }
      if (formData.notes && formData.notes.trim()) {
        appointmentData.notes = formData.notes.trim()
      }

      console.log("Sending appointment data:", appointmentData) // Debug log

      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id || selectedAppointment._id, appointmentData)
        setShowEditModal(false)
      } else {
        await addAppointment(appointmentData)
        setShowAddModal(false)
      }
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Error saving appointment:", error)
      alert("Error saving appointment: " + error.message)
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id)
      } catch (error) {
        console.error("Error deleting appointment:", error)
        alert("Error deleting appointment: " + error.message)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedAppointment(null)
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="header-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by User or Point of Sale..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="userId">Sort by Client</option>
          </select>

          {/* Only show Add button for admins */}
          {isAdmin && (
            <button className="btn-add" onClick={handleAddAppointment}>
              <Plus size={20} />
              Add Appointment
            </button>
          )}
        </div>
      </div>

      <div className="appointments-table">
        <div className={`table-header ${isAdmin ? "admin-view" : ""}`}>
          <div className="table-cell">Client</div>
          <div className="table-cell">Point of Sale</div>
          <div className="table-cell">Date</div>
          <div className="table-cell">Status</div>
          {isAdmin && <div className="table-cell">Actions</div>}
        </div>

        {filteredAppointments.map((appointment) => (
          <div key={appointment.id || appointment._id} className={`table-row ${isAdmin ? "admin-view" : ""}`}>
            <div className="table-cell">
              {getUserDisplay(appointment.user || appointment.userId || appointment.clientId)}
            </div>
            <div className="table-cell">
              {getPointOfSaleDisplay(appointment.pointOfSale || appointment.pointDeVenteId)}
            </div>
            <div className="table-cell">{formatDate(appointment.date)}</div>
            <div className="table-cell">
              <span className={`status-badge ${appointment.status || "pending"}`}>
                {(appointment.status || "pending").toUpperCase()}
              </span>
            </div>
            {isAdmin && (
              <div className="table-cell">
                <div className="table-actions">
                  <button className="btn-edit-small" onClick={() => handleEditAppointment(appointment)}>
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleDeleteAppointment(appointment.id || appointment._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="empty-state">
          <p>{isAdmin ? "No appointments found. Add your first one!" : "No appointments available at the moment."}</p>
        </div>
      )}

      {/* Add Appointment Modal - Admin Only */}
      {isAdmin && (
        <Modal isOpen={showAddModal} onClose={closeModals} title="Add an Appointment">
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input
                type="datetime-local"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client *</label>
              <select
                name="userId" // Changed from clientId to userId
                className="form-input"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={loadingData}
              >
                <option value="">{loadingData ? "Loading users..." : "Select a client"}</option>
                {availableUsers.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName} (${user.email})`
                      : user.email || `User ${user._id || user.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Point of Sale *</label>
              <select
                name="pointDeVenteId"
                className="form-input"
                value={formData.pointDeVenteId}
                onChange={handleChange}
                required
                disabled={loadingData}
              >
                <option value="">{loadingData ? "Loading centers..." : "Select a point of sale"}</option>
                {availableCenters.map((center) => (
                  <option key={center._id || center.id} value={center._id || center.id}>
                    {center.name} - {center.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason</label>
              <input
                type="text"
                name="reason"
                className="form-input"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for appointment (optional)"
                maxLength="500"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                className="form-input"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
                maxLength="1000"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">
              Add Appointment
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Appointment Modal - Admin Only */}
      {isAdmin && (
        <Modal isOpen={showEditModal} onClose={closeModals} title="Edit Appointment">
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input
                type="datetime-local"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client *</label>
              <select
                name="userId" // Changed from clientId to userId
                className="form-input"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={loadingData}
              >
                <option value="">{loadingData ? "Loading users..." : "Select a client"}</option>
                {availableUsers.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName} (${user.email})`
                      : user.email || `User ${user._id || user.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Point of Sale *</label>
              <select
                name="pointDeVenteId"
                className="form-input"
                value={formData.pointDeVenteId}
                onChange={handleChange}
                required
                disabled={loadingData}
              >
                <option value="">{loadingData ? "Loading centers..." : "Select a point of sale"}</option>
                {availableCenters.map((center) => (
                  <option key={center._id || center.id} value={center._id || center.id}>
                    {center.name} - {center.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason</label>
              <input
                type="text"
                name="reason"
                className="form-input"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for appointment (optional)"
                maxLength="500"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                className="form-input"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
                maxLength="1000"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">
              Update Appointment
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Appointments
