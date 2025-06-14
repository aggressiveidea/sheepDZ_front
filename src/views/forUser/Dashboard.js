

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useApp } from "../../context/AppContext"
import SheepCard from "../../components/SheepCard"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const { sheep, fetchSheep } = useApp()
  const [recommendedSheep, setRecommendedSheep] = useState([])

  
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetchSheep()
  }, [])

  useEffect(() => {
    
    setRecommendedSheep(sheep.slice(0, 3))
  }, [sheep])

  const mockDocumentStatus = {
    cin: true,
    payslip: true,
  }

  const mockPaymentStatus = "pending"
  const mockAppointmentStatus = "confirmed"

  const handleBuySheep = (sheep) => {
    console.log("Buying sheep:", sheep)
    alert(`Purchasing sheep #${sheep.id} for ${sheep.price}DH`)
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div className="welcome-card">
          <h2 className="welcome-title">
            Welcome back, {user?.firstName || user?.name || "User"}
            {isAdmin && <span className="admin-indicator"> (Admin)</span>}
          </h2>
          <p className="welcome-subtitle">
            {isAdmin ? "Manage your sheep platform efficiently" : "Ready to purchase your sheep today?"}
          </p>
        </div>
      </div>

      {/* Show status section only for regular users */}
      {!isAdmin && (
        <>
          <div className="status-section">
            <div className="status-grid">
              <div className="status-card">
                <div className="status-icon">
                  {mockPaymentStatus === "completed" ? (
                    <CheckCircle className="icon-success" />
                  ) : (
                    <Clock className="icon-warning" />
                  )}
                </div>
                <div className="status-content">
                  <h3 className="status-title">Payment pending</h3>
                  <p className="status-description">Your payment is being processed</p>
                </div>
              </div>

              <div className="status-card">
                <div className="status-icon">
                  {mockAppointmentStatus === "confirmed" ? (
                    <CheckCircle className="icon-success" />
                  ) : (
                    <AlertCircle className="icon-error" />
                  )}
                </div>
                <div className="status-content">
                  <h3 className="status-title">Appointment Confirmed</h3>
                  <p className="status-description">Your appointment is scheduled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="document-verification">
            <h3 className="section-title">Document Verification Status</h3>
            <div className="verification-grid">
              <div className={`verification-item ${mockDocumentStatus.cin ? "verified" : "pending"}`}>
                <CheckCircle className="verification-icon" />
                <span className="verification-label">CIN</span>
              </div>
              <div className={`verification-item ${mockDocumentStatus.payslip ? "verified" : "pending"}`}>
                <CheckCircle className="verification-icon" />
                <span className="verification-label">Payslip</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="recommended-section">
        <div className="section-header">
          <h3 className="section-title">{isAdmin ? "Recent Sheep" : "Recommended for You"}</h3>
        </div>

        <div className="sheep-grid">
          {recommendedSheep.map((sheepItem) => (
            <SheepCard
              key={sheepItem.id}
              sheep={sheepItem}
              onView={(sheep) => console.log("View sheep:", sheep)}
              onBuy={!isAdmin ? handleBuySheep : null}
              showActions={true}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        {recommendedSheep.length > 0 && (
          <div className="section-footer">
            <button className="btn-see-more">See more</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
