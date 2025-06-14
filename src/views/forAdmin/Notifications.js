

import { useEffect, useState } from "react"
import { useApp } from "../../context/AppContext"
import Modal from "../../components/Modal"
import { Bell, Check, X, User, WheatIcon as Sheep, Clock } from "lucide-react"

const Notifications = () => {
  const { getNotifications, updateNotificationStatus, deleteNotification, addAppointment, centers, fetchCenters } =
    useApp()
  const [notifications, setNotifications] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [appointmentData, setAppointmentData] = useState({
    date: "",
    pointDeVenteId: "",
    notes: "",
  })

  useEffect(() => {
    loadNotifications()
    fetchCenters()
  }, [])

  const loadNotifications = () => {
    const notifs = getNotifications()
    setNotifications(notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const handleApprove = (notification) => {
    setSelectedNotification(notification)
    setAppointmentData({
      date: "",
      pointDeVenteId: "",
      notes: `Appointment for sheep purchase - Sheep #${notification.sheepId}`,
    })
    setShowAppointmentModal(true)
    setError("")
    setSuccess("")
  }

  const handleReject = async (notification) => {
    if (window.confirm("Are you sure you want to reject this buy request?")) {
      setLoading(true)
      setError("")
      try {
        await updateNotificationStatus(notification.id, "rejected", "Buy request rejected by admin")
        loadNotifications()
        setSuccess("Buy request rejected successfully")
        setTimeout(() => setSuccess(""), 3000)
      } catch (error) {
        console.error("Error rejecting notification:", error)
        setError("Failed to reject notification")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCreateAppointment = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      
      const appointmentPayload = {
        userId: selectedNotification.userId,
        pointDeVenteId: appointmentData.pointDeVenteId,
        date: new Date(appointmentData.date).toISOString(),
        status: "confirmed",
        notes: appointmentData.notes,
      }

      await addAppointment(appointmentPayload)

      
      await updateNotificationStatus(
        selectedNotification.id,
        "approved",
        `Appointment scheduled for ${new Date(appointmentData.date).toLocaleString()}`,
      )

      setShowAppointmentModal(false)
      setSelectedNotification(null)
      loadNotifications()
      setSuccess("Appointment created successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error creating appointment:", error)
      setError("Failed to create appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setLoading(true)
      setError("")
      try {
        await deleteNotification(notificationId)
        loadNotifications()
        setSuccess("Notification deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
      } catch (error) {
        console.error("Error deleting notification:", error)
        setError("Failed to delete notification")
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Pending</span>
      case "approved":
        return <span className="status-badge completed">Approved</span>
      case "rejected":
        return <span className="status-badge failed">Rejected</span>
      default:
        return <span className="status-badge pending">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const closeModals = () => {
    setShowDetailsModal(false)
    setShowAppointmentModal(false)
    setSelectedNotification(null)
    setError("")
    setSuccess("")
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-info">
          <Bell className="header-icon" />
          <div>
            <h2 className="page-title">Notifications</h2>
            <p className="page-subtitle">Manage buy requests and user notifications</p>
          </div>
        </div>
        <div className="notifications-stats">
          <div className="stat-item">
            <span className="stat-number">{notifications.filter((n) => n.status === "pending").length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{notifications.filter((n) => n.status === "approved").length}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={`notification-card ${notification.status}`}>
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-type">
                    <Sheep className="notification-icon" />
                    <span className="notification-title">Buy Request</span>
                  </div>
                  {getStatusBadge(notification.status)}
                </div>

                <div className="notification-body">
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-details">
                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span>{notification.userName}</span>
                    </div>
                    <div className="detail-item">
                      <Sheep className="detail-icon" />
                      <span>
                        Sheep #{notification.sheepId} - {notification.sheepInfo?.race} - {notification.sheepInfo?.price}
                        DH
                      </span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="notification-actions">
                  <button
                    className="btn-details"
                    onClick={() => {
                      setSelectedNotification(notification)
                      setShowDetailsModal(true)
                    }}
                  >
                    View Details
                  </button>

                  {notification.status === "pending" && (
                    <>
                      <button className="btn-approve" onClick={() => handleApprove(notification)} disabled={loading}>
                        <Check size={16} />
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(notification)} disabled={loading}>
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  <button className="btn-delete" onClick={() => handleDelete(notification.id)} disabled={loading}>
                    <X size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <h3>No notifications</h3>
            <p>No buy requests or notifications at the moment.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <Modal isOpen={showDetailsModal} onClose={closeModals} title="Notification Details">
          {selectedNotification && (
            <div className="notification-details-modal">
              <div className="details-section">
                <h4>User Information</h4>
                <p>
                  <strong>Name:</strong> {selectedNotification.userName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedNotification.userEmail}
                </p>
              </div>

              <div className="details-section">
                <h4>Sheep Information</h4>
                <p>
                  <strong>ID:</strong> {selectedNotification.sheepId}
                </p>
                <p>
                  <strong>Race:</strong> {selectedNotification.sheepInfo?.race}
                </p>
                <p>
                  <strong>Weight:</strong> {selectedNotification.sheepInfo?.weight}kg
                </p>
                <p>
                  <strong>Age:</strong> {selectedNotification.sheepInfo?.age} years
                </p>
                <p>
                  <strong>Price:</strong> {selectedNotification.sheepInfo?.price}DH
                </p>
                <p>
                  <strong>Origin:</strong> {selectedNotification.sheepInfo?.origin}
                </p>
              </div>

              <div className="details-section">
                <h4>Request Information</h4>
                <p>
                  <strong>Status:</strong> {getStatusBadge(selectedNotification.status)}
                </p>
                <p>
                  <strong>Requested At:</strong> {formatDate(selectedNotification.createdAt)}
                </p>
                {selectedNotification.adminResponse && (
                  <p>
                    <strong>Admin Response:</strong> {selectedNotification.adminResponse}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Create Appointment Modal */}
      {showAppointmentModal && (
        <Modal isOpen={showAppointmentModal} onClose={closeModals} title="Create Appointment">
          <form onSubmit={handleCreateAppointment} className="appointment-form">
            <div className="form-group">
              <label className="form-label">Appointment Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Point of Sale</label>
              <select
                className="form-input"
                value={appointmentData.pointDeVenteId}
                onChange={(e) => setAppointmentData({ ...appointmentData, pointDeVenteId: e.target.value })}
                required
              >
                <option value="">Select point of sale</option>
                {centers.map((center) => (
                  <option key={center._id || center.id} value={center._id || center.id}>
                    {center.name} - {center.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows="3"
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                placeholder="Additional notes for the appointment..."
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={closeModals}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Appointment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Notifications

