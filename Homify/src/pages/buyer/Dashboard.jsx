import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaRecycle, FaSearch, FaShoppingCart, FaTruck, 
  FaClipboardList, FaUser, FaSignOutAlt 
} from 'react-icons/fa';
import Chatbot from '../../components/Chatbot';
import Chat from '../../components/Chat/Chat';

// Buyer components
import BrowseWaste from './BrowseWaste';
import PostRequirement from './PostRequirement';
import Transport from './Transport';
import Profile from './Profile';

function BuyerDashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        className="bg-blue-800 text-white w-64 flex-shrink-0 shadow-lg"
      >
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <FaRecycle className="text-2xl" />
            <h1 className="text-xl font-bold">Buyer Portal</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src={currentUser?.avatar || "https://via.placeholder.com/40"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{currentUser?.name || "Buyer"}</p>
              <p className="text-xs text-blue-300">{currentUser?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link 
              to="/buyer/browse" 
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                location.pathname.includes('/buyer/browse') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:bg-blue-700'
              }`}
            >
              <FaSearch />
              <span>Browse Waste</span>
            </Link>
            
            <Link 
              to="/buyer/requirements" 
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                location.pathname.includes('/buyer/requirements') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:bg-blue-700'
              }`}
            >
              <FaClipboardList />
              <span>Post Requirements</span>
            </Link>
            
            <Link 
              to="/buyer/transport" 
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                location.pathname.includes('/buyer/transport') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:bg-blue-700'
              }`}
            >
              <FaTruck />
              <span>Transport</span>
            </Link>
            
            <Link 
              to="/buyer/profile" 
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                location.pathname.includes('/buyer/profile') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:bg-blue-700'
              }`}
            >
              <FaUser />
              <span>My Profile</span>
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-700">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 text-blue-200 hover:text-white w-full p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="text-xl font-semibold text-blue-800">
              AgriWaste Connect
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-600 focus:outline-none">
                  <FaShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Routes>
            <Route path="/" element={<BrowseWaste />} />
            <Route path="/browse" element={<BrowseWaste />} />
            <Route path="/requirements" element={<PostRequirement />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
      
      {/* Add Chat component */}
      <Chat />
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default BuyerDashboard; 