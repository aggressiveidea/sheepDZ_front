import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { AppProvider } from "./context/AppContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"

// Auth components
import Login from "./views/forUser/Login"
import Register from "./views/forUser/Register"

// User components
import Dashboard from "./views/forUser/Dashboard"
import Sheeps from "./views/forUser/Sheeps"
import PointOfSale from "./views/forUser/PointOfSale"
import Appointments from "./views/forUser/Appointments"
import Payment from "./views/forUser/Payment"
import Profile from "./views/forUser/Profile"

// Admin components
import AdminDashboard from "./views/forAdmin/AdminDashboard"
import Users from "./views/forAdmin/Users"
// Import the new Notifications component
import Notifications from "./views/forAdmin/Notifications"

import "./App.css"

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes - Available to both users and admins */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sheeps"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Sheeps />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/point-of-sale"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PointOfSale />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Appointments />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Payment />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin-only routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Add the notifications route after the Users route */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect based on role */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
