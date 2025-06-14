"use client"

import { useEffect, useState } from "react"
import { useApp } from "../../context/AppContext"
import { Users, Calendar, MapPin, TrendingUp } from "lucide-react"

const AdminDashboard = () => {
  const { sheep, appointments, users, centers, fetchSheep, fetchAppointments, fetchUsers, fetchCenters } = useApp()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalSheeps: 0,
    totalPointsOfSale: 0,
  })

  useEffect(() => {
    fetchSheep()
    fetchAppointments()
    fetchUsers()
    fetchCenters()
  }, [])

  useEffect(() => {
    setStats({
      totalUsers: users.length || 1234,
      totalAppointments: appointments.length || 45,
      totalSheeps: sheep.length || 12778,
      totalPointsOfSale: centers.length || 557,
    })
  }, [sheep, appointments, users, centers])

  const mockChartData = {
    sheepPurchases: [
      { month: "Jan", value: 65 },
      { month: "Feb", value: 59 },
      { month: "Mar", value: 80 },
      { month: "Apr", value: 81 },
      { month: "May", value: 56 },
      { month: "Jun", value: 95 },
    ],
    appointmentsPerCenter: [
      { center: "Centre Settat", appointments: 25 },
      { center: "Centre Alger", appointments: 20 },
      { center: "Centre Rabat", appointments: 15 },
      { center: "Centre Casa", appointments: 10 },
    ],
  }

  const recentActivity = [
    { id: 1, type: "user", message: "New user registered", time: "2 min ago", user: "Ali Alami" },
    { id: 2, type: "appointment", message: "Appointment scheduled", time: "5 min ago", user: "Sara" },
  ]

  const pendingApprovals = [{ id: 1, type: "document", message: "Document verification", count: 12 }]

  const centerCapacity = [
    { name: "Centre Settat", capacity: 94, scheduled: 40, usage: "89%", status: "good" },
    { name: "Centre Alger", capacity: 200, scheduled: 45, usage: "17.5%", status: "good" },
    { name: "Centre Alger", capacity: 1, scheduled: 364, usage: "36%", status: "critical" },
  ]

  return (
    <div className="admin-dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUsers}</h3>
            <p className="stat-label">Total Users</p>
            <span className="stat-change">+5.4% from last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalAppointments}</h3>
            <p className="stat-label">Appointments</p>
            <span className="stat-change">+2.1% from last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sheeps">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalSheeps}</h3>
            <p className="stat-label">Total Sheeps</p>
            <span className="stat-change">+12.5% from last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon points">
            <MapPin size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalPointsOfSale}</h3>
            <p className="stat-label">Points of sale</p>
            <span className="stat-change">+1.2% from last week</span>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3 className="chart-title">Sheep Purchases Over Time</h3>
          <div className="line-chart">
            <svg viewBox="0 0 400 200" className="chart-svg">
              <polyline
                points="50,150 100,120 150,80 200,75 250,110 300,50"
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
              />
              {mockChartData.sheepPurchases.map((point, index) => (
                <circle key={index} cx={50 + index * 50} cy={200 - point.value * 2} r="4" fill="#4ade80" />
              ))}
            </svg>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Appointments per Point of Sale</h3>
          <div className="bar-chart">
            {mockChartData.appointmentsPerCenter.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar" style={{ height: `${item.appointments * 4}px` }}></div>
                <span className="bar-label">{item.center}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-content">
                  <p className="activity-message">
                    <strong>{activity.user}</strong> {activity.message}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Pending Approvals</h3>
          <div className="approvals-list">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="approval-item">
                <div className="approval-icon">⚠️</div>
                <div className="approval-content">
                  <p className="approval-message">{approval.message}</p>
                  <span className="approval-count">{approval.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="capacity-monitor">
        <h3 className="section-title">Points of Sale Capacity Monitor</h3>
        <div className="capacity-list">
          {centerCapacity.map((center, index) => (
            <div key={index} className="capacity-item">
              <div className="capacity-info">
                <h4 className="capacity-name">{center.name}</h4>
                <p className="capacity-details">
                  Capacity: {center.capacity} • Scheduled: {center.scheduled} • Usage: {center.usage}
                </p>
              </div>
              <div className="capacity-bar">
                <div className={`capacity-fill ${center.status}`} style={{ width: center.usage }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
