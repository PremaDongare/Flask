import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaUsers, FaRecycle, FaExchangeAlt, FaChartPie } from 'react-icons/fa';
import api from '../../services/api';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWaste: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // This would normally fetch from the API
      // For demo, we'll use mock data
      const mockStats = {
        totalUsers: 156,
        totalWaste: 12500,
        totalOrders: 89,
        revenue: 45000,
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{t('TotalUsers')}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaRecycle className="text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{t('dashboard.totalWaste')}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalWaste} kg</h3>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaExchangeAlt className="text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{t('TotalOrders')}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaChartPie className="text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{t('TotalRevenue')}</p>
                  <h3 className="text-2xl font-bold text-gray-800">₹{stats.revenue}</h3>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Additional dashboard content would go here */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{t('RecentActivity')}</h2>
              <p className="text-gray-500">{t('dashboard.comingSoon')}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{t('SystemStatus')}</h2>
              <p className="text-gray-500">{t('dashboard.comingSoon')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard; 