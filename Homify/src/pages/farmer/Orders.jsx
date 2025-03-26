import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaShippingFast } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function Orders() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    fetchOrders();
    
    const orderUpdateInterval = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(orderUpdateInterval);
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch from the API with the farmer's ID
      // const response = await api.get(`/farmer/orders?farmerId=${currentUser.id}`);
      // setOrders(response.data);
      
      // For demo, we'll use mock data that includes orders placed by buyers
      const mockOrders = [
        {
          id: 'ORD-001',
          buyerId: '201',
          buyerName: 'Rajesh Industries',
          wasteId: 'W001',
          wasteType: 'Rice Straw',
          quantity: 500,
          unit: 'kg',
          price: 2.5,
          totalAmount: 1250,
          status: 'pending',
          orderDate: '2023-06-15T10:30:00Z',
          notes: 'Need delivery within a week',
          buyerContact: '+91 98765 43210',
          buyerEmail: 'rajesh@example.com'
        },
        {
          id: 'ORD-002',
          buyerId: '202',
          buyerName: 'Green Energy Co.',
          wasteId: 'W003',
          wasteType: 'Corn Stalks',
          quantity: 300,
          unit: 'kg',
          price: 3.0,
          totalAmount: 900,
          status: 'confirmed',
          orderDate: '2023-06-10T14:15:00Z',
          notes: 'Will arrange pickup',
          buyerContact: '+91 87654 32109',
          buyerEmail: 'green@example.com'
        },
        {
          id: 'ORD-003',
          buyerId: '203',
          buyerName: 'Eco Solutions',
          wasteId: 'W002',
          wasteType: 'Wheat Straw',
          quantity: 800,
          unit: 'kg',
          price: 2.0,
          totalAmount: 1600,
          status: 'completed',
          orderDate: '2023-05-28T09:45:00Z',
          notes: 'Payment done via bank transfer',
          buyerContact: '+91 76543 21098',
          buyerEmail: 'eco@example.com'
        },
        {
          id: 'ORD-004',
          buyerId: '204',
          buyerName: 'New Buyer Corp',
          wasteId: 'W004',
          wasteType: 'Sugarcane Bagasse',
          quantity: 600,
          unit: 'kg',
          price: 2.8,
          totalAmount: 1680,
          status: 'pending',
          orderDate: new Date().toISOString(),
          notes: 'Please contact before shipping',
          buyerContact: '+91 65432 10987',
          buyerEmail: 'newbuyer@example.com'
        }
      ];
      
      // Check localStorage for any persisted mock order status changes
      const persistedMockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      
      // Apply any persisted status changes to the mock orders
      const updatedMockOrders = mockOrders.map(mockOrder => {
        const persistedOrder = persistedMockOrders.find(order => order.id === mockOrder.id);
        return persistedOrder ? { ...mockOrder, status: persistedOrder.status } : mockOrder;
      });
      
      // Check localStorage for any orders placed by buyers
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Combine mock orders with any local orders
      const allOrders = [...updatedMockOrders, ...localOrders];
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      // In a real app, this would call an API endpoint
      // await api.put(`/farmer/orders/${orderId}/status`, { status: newStatus });
      
      // For demo, we'll update both mock orders and localStorage orders
      
      // First, find if this is a mock order or a localStorage order
      const mockOrderIds = ['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004'];
      const isMockOrder = mockOrderIds.includes(orderId);
      
      if (isMockOrder) {
        // If it's a mock order, we need to add it to localStorage to persist the change
        const mockOrderToUpdate = orders.find(order => order.id === orderId);
        if (mockOrderToUpdate) {
          const updatedMockOrder = { ...mockOrderToUpdate, status: newStatus };
          
          // Get existing orders from localStorage
          const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          
          // Check if this mock order is already in localStorage
          const existingOrderIndex = existingOrders.findIndex(order => order.id === orderId);
          
          if (existingOrderIndex >= 0) {
            // Update existing entry
            existingOrders[existingOrderIndex] = updatedMockOrder;
          } else {
            // Add new entry
            existingOrders.push(updatedMockOrder);
          }
          
          // Save back to localStorage
          localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
        }
      } else {
        // If it's a localStorage order (from buyer), update it
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedLocalOrders = localOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedLocalOrders));
      }
      
      // Update the orders in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Update the selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      // Show success message
      let successMessage = '';
      switch (newStatus) {
        case 'confirmed':
          successMessage = t('orders.orderConfirmed');
          break;
        case 'completed':
          successMessage = t('orders.orderCompleted');
          break;
        case 'cancelled':
          successMessage = t('orders.orderCancelled');
          break;
        default:
          successMessage = t('orders.statusUpdated');
      }
      alert(successMessage);
      
    } catch (error) {
      console.error(`Error updating order to ${newStatus}:`, error);
      alert(t('errors.general'));
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleConfirmOrder = (orderId) => {
    updateOrderStatus(orderId, 'confirmed');
  };
  
  const handleCompleteOrder = (orderId) => {
    updateOrderStatus(orderId, 'completed');
  };
  
  const handleCancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
  };
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.buyerName.toLowerCase().includes(searchLower) ||
        order.wasteType.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('orders.title')}</h1>
        
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t('Search orders...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{t('orders.all')}</option>
            <option value="pending">{t('orders.pending')}</option>
            <option value="confirmed">{t('orders.confirmed')}</option>
            <option value="completed">{t('orders.completed')}</option>
            <option value="cancelled">{t('orders.cancelled')}</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">{t('orders.noOrders')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.orderID')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.buyer')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.wasteType')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.quantity')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.buyerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.wasteType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity} {order.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status === 'pending' && t('orders.statusPending')}
                        {order.status === 'confirmed' && t('orders.statusConfirmed')}
                        {order.status === 'completed' && t('orders.statusCompleted')}
                        {order.status === 'cancelled' && t('orders.statusCancelled')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEye className="inline mr-1" />
                        {t('orders.viewDetails')}
                      </button>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          disabled={actionLoading}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaCheck className="inline mr-1" />
                          {t('orders.confirmOrder')}
                        </button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <FaShippingFast className="inline mr-1" />
                          {t('orders.completeOrder')}
                        </button>
                      )}
                      
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimes className="inline mr-1" />
                          {t('orders.cancelOrder')}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Order details modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {t('orders.orderDetails')} - {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {t('orders.buyer')}
                  </h3>
                  <p className="text-gray-800 font-medium">{selectedOrder.buyerName}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.buyerEmail}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.buyerContact}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {t('orders.orderDate')}
                  </h3>
                  <p className="text-gray-800">
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  {t('orders.orderItems')}
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{selectedOrder.wasteType}</span>
                    <span>₹{selectedOrder.price} / {selectedOrder.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{selectedOrder.quantity} {selectedOrder.unit}</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
                
                {selectedOrder.notes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      {t('orders.notes')}
                    </h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    {t('orders.status')}
                  </h4>
                  <p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status === 'pending' && t('orders.statusPending')}
                      {selectedOrder.status === 'confirmed' && t('orders.statusConfirmed')}
                      {selectedOrder.status === 'completed' && t('orders.statusCompleted')}
                      {selectedOrder.status === 'cancelled' && t('orders.statusCancelled')}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleConfirmOrder(selectedOrder.id);
                      }}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {t('orders.confirmOrder')}
                    </button>
                    <button
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id);
                      }}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {t('orders.cancelOrder')}
                    </button>
                  </>
                )}
                
                {selectedOrder.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => {
                        handleCompleteOrder(selectedOrder.id);
                      }}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {t('orders.completeOrder')}
                    </button>
                    <button
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id);
                      }}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {t('orders.cancelOrder')}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders; 