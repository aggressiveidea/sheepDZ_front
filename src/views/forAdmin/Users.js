

import { useEffect, useState } from "react"
import { useApp } from "../../context/AppContext"
import { Search, MoreVertical, Edit, Trash2, X } from "lucide-react"
import ApiService from "../../services/Api"

const Users = () => {
  const { users, fetchUsers } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    num_nat: "",
    address: "",
    receiptUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterBy === "all") return matchesSearch
    return matchesSearch && user.role === filterBy
  })

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "user",
      num_nat: user.num_nat || "",
      address: user.address || "",
      receiptUrl: user.receiptUrl || "",
    })
    setShowEditModal(true)
    setActiveDropdown(null)
    setError("")
    setSuccess("")
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
    setActiveDropdown(null)
    setError("")
    setSuccess("")
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await ApiService.updateUser(selectedUser.id || selectedUser._id, editFormData)
      setSuccess("User updated successfully!")
      setShowEditModal(false)
      fetchUsers() 
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    setError("")

    try {
      await ApiService.deleteUser(selectedUser.id || selectedUser._id)
      setSuccess("User deleted successfully!")
      setShowDeleteModal(false)
      fetchUsers() 
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.message || "Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    })
  }

  const toggleDropdown = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId)
  }

  const closeModals = () => {
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedUser(null)
    setError("")
    setSuccess("")
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="filter-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Users</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="users-table">
        <div className="table-header">
          <div className="table-cell">Name</div>
          <div className="table-cell">Email</div>
          <div className="table-cell">Role</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Actions</div>
        </div>

        {filteredUsers.map((user) => (
          <div key={user.id || user._id} className="table-row">
            <div className="table-cell">
              <div className="user-info">
                <div className="user-avatar">
                  {(user.firstName?.charAt(0) || user.name?.charAt(0) || "U").toUpperCase()}
                </div>
                <span className="user-name">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || "Unknown User"}
                </span>
              </div>
            </div>
            <div className="table-cell">{user.email}</div>
            <div className="table-cell">
              <span className={`role-badge ${user.role}`}>{user.role || "user"}</span>
            </div>
            <div className="table-cell">
              <span className={`status-badge ${user.status || "active"}`}>{user.status || "active"}</span>
            </div>
            <div className="table-cell">
              <div className="action-dropdown">
                <button className="action-btn" onClick={() => toggleDropdown(user.id || user._id)}>
                  <MoreVertical size={16} />
                </button>
                {activeDropdown === (user.id || user._id) && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item edit" onClick={() => handleEditClick(user)}>
                      <Edit size={14} />
                      Edit User
                    </button>
                    <button className="dropdown-item delete" onClick={() => handleDeleteClick(user)}>
                      <Trash2 size={14} />
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>No users found matching your criteria.</p>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select id="role" name="role" value={editFormData.role} onChange={handleInputChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="num_nat">National ID</label>
                  <input
                    type="number"
                    id="num_nat"
                    name="num_nat"
                    value={editFormData.num_nat}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="receiptUrl">Receipt URL</label>
                <input
                  type="url"
                  id="receiptUrl"
                  name="receiptUrl"
                  value={editFormData.receiptUrl}
                  onChange={handleInputChange}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button className="close-btn" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>
            <div className="delete-content">
              <p>Are you sure you want to delete this user?</p>
              <div className="user-details">
                <strong>
                  {selectedUser?.firstName && selectedUser?.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : selectedUser?.name || "Unknown User"}
                </strong>
                <br />
                <span>{selectedUser?.email}</span>
              </div>
              <p className="warning">This action cannot be undone.</p>

              {error && <div className="form-error">{error}</div>}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModals}>
                  Cancel
                </button>
                <button className="delete-confirm-btn" onClick={handleDeleteConfirm} disabled={loading}>
                  {loading ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
