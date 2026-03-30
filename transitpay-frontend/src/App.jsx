import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoutes from "./pages/AdminRoutes"
import AdminQRCodes from "./pages/Adminqrcodes"
import PassengerRoutes from "./pages/Passengerroutes"
import PassengerPayment from "./pages/Passengerpayment"
import PassengerTransactions from "./pages/PassengerTransactions"
import PassengerProfile from "./pages/Passengerprofile"
import QRScanner from "./pages/QRScanner"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import PassengerDashboard from "./pages/PassengerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import AdminBuses from "./pages/AdminBuses"
import AdminTransactions from "./pages/AdminTransactions"
import AdminUsers from "./pages/AdminUsers"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin pages */}
        <Route path="/admin/routes" element={<AdminRoutes />} />
        <Route path="/admin/buses" element={<AdminBuses />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/qr-codes" element={<AdminQRCodes />} />

        {/* Passenger pages — all protected */}
        <Route path="/passenger-dashboard" element={
          <ProtectedRoute><PassengerDashboard /></ProtectedRoute>
        } />
        <Route path="/passenger/routes" element={
          <ProtectedRoute><PassengerRoutes /></ProtectedRoute>
        } />
        <Route path="/passenger/payment" element={
          <ProtectedRoute><PassengerPayment /></ProtectedRoute>
        } />
        <Route path="/passenger/transactions" element={
          <ProtectedRoute><PassengerTransactions /></ProtectedRoute>
        } />
        <Route path="/passenger/profile" element={
          <ProtectedRoute><PassengerProfile /></ProtectedRoute>
        } />
        <Route path="/passenger/scan" element={
          <ProtectedRoute><QRScanner /></ProtectedRoute>
        } />

        {/* Admin dashboard */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App