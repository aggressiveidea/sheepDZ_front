import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./views/Login"
import Register from "./views/Register"
import UserDashboard from "./views/forUser/Dashboard"
import UserProfile from "./views/forUser/Profile"
import UserSheeps from "./views/forUser/Sheeps"
import UserAppointments from "./views/forUser/Appointments"
import UserPayment from "./views/forUser/Payment"
import AdminDashboard from "./views/forAdmin/Dashboard"
import AdminUsers from "./views/forAdmin/Users"
import AdminSheeps from "./views/forAdmin/Sheeps"
import AdminAppointments from "./views/forAdmin/Appointments"
import AdminPointsOfSale from "./views/forAdmin/PointsOfSale"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/sheeps"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserSheeps />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/appointments"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/payment"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserPayment />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sheeps"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSheeps />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/points-of-sale"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPointsOfSale />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
