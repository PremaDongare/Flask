import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import FarmerLayout from "./layouts/FarmerLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/Dashboard";
import ManageWaste from "./pages/farmer/ManageWaste";
import FarmerOrders from "./pages/farmer/Orders";
import WastePrediction from "./pages/farmer/WastePrediction";
import FarmerProfile from "./pages/farmer/Profile";
import SalesDashboard from "./pages/farmer/SalesDashboard";
import Tutorials from "./pages/farmer/Tutorials";
import FarmerTransport from "./pages/farmer/FarmerTransport";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/Dashboard";
import Marketplace from "./pages/buyer/Marketplace";
import BuyerOrders from "./pages/buyer/Orders";
import BuyerProfile from "./pages/buyer/Profile";
import TransportSystem from "./pages/buyer/TransportSystem";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Waste from "./pages/admin/Waste";
import AdminOrders from "./pages/admin/Orders";
import AdminProfile from "./pages/admin/Profile";
import ManageFarmers from "./pages/admin/ManageFarmers";
import ManageBuyers from "./pages/admin/ManageBuyers";
import Overview from "./pages/admin/Overview";
import ManageTutorials from "./pages/admin/ManageTutorials";

// Shared Pages
import Chat from "./pages/shared/Chat";
import NotFound from "./pages/NotFound";



function App() {
  const { currentUser, loading } = useAuth();

  // ✅ Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Router>
        <Routes>
          {/* ✅ Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Farmer Routes */}
          <Route path="/farmer" element={<ProtectedRoute><FarmerLayout /></ProtectedRoute>}>
            <Route index element={<FarmerDashboard />} />
            <Route path="waste" element={<ManageWaste />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="prediction" element={<WastePrediction />} />
            <Route path="profile" element={<FarmerProfile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="sales-dashboard" element={<SalesDashboard />} />
            <Route path="tutorials" element={<Tutorials />} />
            <Route path="transport" element={<FarmerTransport />} />
          </Route>

          {/* ✅ Buyer Routes */}
          <Route path="/buyer" element={<ProtectedRoute><BuyerLayout /></ProtectedRoute>}>
            <Route index element={<BuyerDashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="profile" element={<BuyerProfile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="transport" element={<TransportSystem />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="waste" element={<Waste />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="manage-farmers" element={<ManageFarmers />} />
            <Route path="manage-buyers" element={<ManageBuyers />} />
            <Route path="overview" element={<Overview />} />
            <Route path="manage-tutorials" element={<ManageTutorials />} />
          </Route>

          {/* ✅ Role-Based Redirect */}
          <Route path="/" element={
            loading ? (
              <div className="flex justify-center items-center h-screen">Loading...</div>
            ) : currentUser ? (
              <Navigate to={`/${currentUser.role}`} />
            ) : (
              <Navigate to="/login" />
            )
          } />

          {/* ✅ 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* ✅ Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
