

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Eye, EyeOff } from "lucide-react"

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.address || "",
    cin: user?.cin || "",
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await updateUserProfile(formData)
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Error updating profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      
      setMessage("Password changed successfully!")
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setMessage("Error changing password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">{user?.name?.charAt(0) || "U"}</div>
        </div>
        <h2 className="profile-title">Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3 className="section-title">Personal Information</h3>

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">CIN</label>
              <input
                type="text"
                name="cin"
                className="form-input"
                value={formData.cin}
                onChange={handleProfileChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Updating..." : "Update Data"}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Change Password</h3>

          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label className="form-label">Old password</label>
              <div className="password-input-container">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  className="form-input"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Changing..." : "Change password"}
            </button>
          </form>
        </div>

        {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}
      </div>
    </div>
  )
}

export default Profile
