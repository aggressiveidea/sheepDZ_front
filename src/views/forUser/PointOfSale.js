

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useApp } from "../../context/AppContext"
import Modal from "../../components/Modal"
import { Plus, MapPin, Cloud, Edit, Trash2, MoreVertical } from "lucide-react"

const PointOfSale = () => {
  const { user } = useAuth()
  const { centers, fetchCenters, addCenter } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    weather: "",
    location: "",
  })

  
  const isAdmin = user?.role === "admin"

  
  const farmImages = [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1592982736920-1b0d8b3c8c2c?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=250&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=250&fit=crop&crop=center",
  ]

  
  const getCenterImage = (centerId, centerName) => {
    const index = centerId ? centerId.length % farmImages.length : centerName.length % farmImages.length
    return farmImages[index]
  }

  useEffect(() => {
    fetchCenters()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addCenter(formData)
      setShowAddModal(false)
      setFormData({ name: "", weather: "", location: "" })
    } catch (error) {
      console.error("Error adding center:", error)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      
      console.log("Updating center:", selectedCenter.id, formData)
      setShowEditModal(false)
      setSelectedCenter(null)
      setFormData({ name: "", weather: "", location: "" })
    } catch (error) {
      console.error("Error updating center:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEdit = (center) => {
    setSelectedCenter(center)
    setFormData({
      name: center.name,
      weather: center.weather,
      location: center.location,
    })
    setShowEditModal(true)
    setActiveDropdown(null)
  }

  const handleDelete = (center) => {
    if (window.confirm(`Are you sure you want to delete ${center.name}?`)) {
      
      console.log("Deleting center:", center.id)
    }
    setActiveDropdown(null)
  }

  const toggleDropdown = (centerId) => {
    setActiveDropdown(activeDropdown === centerId ? null : centerId)
  }

  
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="point-of-sale-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Points of Sale</h1>
            <p className="page-subtitle">Manage your distribution centers and sales locations</p>
          </div>
          {isAdmin && (
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Point of Sale
            </button>
          )}
        </div>
      </div>

      <div className="centers-grid">
        {centers.map((center) => (
          <div key={center.id || center._id} className="center-card">
            <div className="center-image">
              <img
                src={getCenterImage(center.id || center._id, center.name)}
                alt={`${center.name} - Agricultural Center`}
                onError={(e) => {
                  
                  e.target.src =
                    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop&crop=center"
                }}
              />
              {isAdmin && (
                <div className="center-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(center.id || center._id)
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeDropdown === (center.id || center._id) && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item edit" onClick={() => handleEdit(center)}>
                        <Edit size={14} />
                        Edit Center
                      </button>
                      <button className="dropdown-item delete" onClick={() => handleDelete(center)}>
                        <Trash2 size={14} />
                        Delete Center
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="center-content">
              <div className="center-header">
                <h3 className="center-name">{center.name}</h3>
              </div>

              <div className="center-details">
                <div className="center-detail">
                  <Cloud className="detail-icon" />
                  <span className="detail-text">{center.weather}</span>
                </div>
                <div className="center-detail">
                  <MapPin className="detail-icon" />
                  <span className="detail-text">{center.location}</span>
                </div>
              </div>

              <div className="center-footer">
                <div className="center-status">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {centers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <MapPin size={48} />
          </div>
          <h3>No Points of Sale</h3>
          <p>
            {isAdmin
              ? "No points of sale found. Add your first one to get started!"
              : "No points of sale available at the moment."}
          </p>
        </div>
      )}

      {/* Add Modal - Admin Only */}
      {isAdmin && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add a Point of Sale">
          <form onSubmit={handleSubmit} className="center-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter center name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weather</label>
              <input
                type="text"
                name="weather"
                className="form-input"
                value={formData.weather}
                onChange={handleChange}
                placeholder="e.g., Sunny, Rainy, Cloudy"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter full address"
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Add Point of Sale
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Modal - Admin Only */}
      {isAdmin && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedCenter(null)
            setFormData({ name: "", weather: "", location: "" })
          }}
          title="Edit Point of Sale"
        >
          <form onSubmit={handleEditSubmit} className="center-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter center name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weather</label>
              <input
                type="text"
                name="weather"
                className="form-input"
                value={formData.weather}
                onChange={handleChange}
                placeholder="e.g., Sunny, Rainy, Cloudy"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter full address"
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Update Point of Sale
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default PointOfSale
