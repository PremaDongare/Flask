import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

function ManageWaste() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [wasteItems, setWasteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [wastes, setWastes] = useState([]);
  const [newWaste, setNewWaste] = useState({
    type: '',
    quantity: '',
    price: '',
    description: '',
    location: '',
    availableFrom: '',
    unit: 'kg'
  });
  
  useEffect(() => {
    fetchWasteItems();
    // Load existing waste listings
    const existingWastes = JSON.parse(localStorage.getItem('farmerWastes') || '[]');
    // Filter wastes for current farmer
    const farmerWastes = existingWastes.filter(waste => waste.farmerId === currentUser.uid);
    setWastes(farmerWastes);
  }, [currentUser.uid]);
  
  const fetchWasteItems = async () => {
    setIsLoading(true);
    
    try {
      // This would normally fetch from the API
      // For now, we'll use mock data
      const mockItems = [
        {
          id: '1',
          name: 'Rice Straw',
          quantity: 500,
          unit: 'kg',
          price: 2.5,
          location: 'Punjab',
          status: 'available',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
          id: '2',
          name: 'Wheat Husk',
          quantity: 300,
          unit: 'kg',
          price: 3.0,
          location: 'Haryana',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          id: '3',
          name: 'Corn Stalks',
          quantity: 200,
          unit: 'kg',
          price: 1.8,
          location: 'Uttar Pradesh',
          status: 'sold',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        },
        {
          id: '4',
          name: 'Sugarcane Bagasse',
          quantity: 450,
          unit: 'kg',
          price: 2.2,
          location: 'Maharashtra',
          status: 'available',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      ];
      
      setWasteItems(mockItems);
    } catch (error) {
      console.error('Error fetching waste items:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };
  
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      // This would normally call the API
      // For now, we'll just update the state
      setWasteItems(wasteItems.filter(item => item.id !== selectedItem.id));
      setShowDeleteConfirm(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting waste item:', error);
    }
  };
  
  const handleAddWaste = (e) => {
    e.preventDefault();
    
    const wasteToAdd = {
      id: `waste_${Date.now()}`,
      farmerId: currentUser.uid,
      farmerName: currentUser.displayName || 'Anonymous Farmer',
      type: newWaste.type,
      quantity: newWaste.quantity,
      price: newWaste.price,
      description: newWaste.description,
      location: newWaste.location,
      availableFrom: newWaste.availableFrom,
      unit: newWaste.unit,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    // Get all existing wastes and add new one
    const existingWastes = JSON.parse(localStorage.getItem('farmerWastes') || '[]');
    const updatedWastes = [...existingWastes, wasteToAdd];
    
    // Update localStorage and state
    localStorage.setItem('farmerWastes', JSON.stringify(updatedWastes));
    setWastes(prev => [...prev, wasteToAdd]);
    
    // Reset form and close modal
    setShowAddModal(false);
    setNewWaste({
      type: '',
      quantity: '',
      price: '',
      description: '',
      location: '',
      availableFrom: '',
      unit: 'kg'
    });
  };
  
  const handleDeleteWaste = (wasteId) => {
    const existingWastes = JSON.parse(localStorage.getItem('farmerWastes') || '[]');
    const updatedWastes = existingWastes.filter(waste => waste.id !== wasteId);
    localStorage.setItem('farmerWastes', JSON.stringify(updatedWastes));
    setWastes(prev => prev.filter(waste => waste.id !== wasteId));
  };
  
  const filteredItems = wasteItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          {t('Waste Listings')}
        </h1>
        
        <motion.button
          onClick={handleAddClick}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="mr-2" />
          {t('waste.addNew')}
        </motion.button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={t('Search Order')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">{t('All Orders')}</option>
              <option value="available">{t('Available')}</option>
              <option value="pending">{t('Pending')}</option>
              <option value="sold">{t('Sold')}</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.quantity')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.location')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('waste.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('waste.noItemsFound')}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{formatDate(item.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{item.price}/{item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status === 'available' && t('Available')}
                        {item.status === 'pending' && t('Pending')}
                        {item.status === 'sold' && t('Sold')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('waste.confirmDelete')}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedItem?.name}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t('waste.addNewWaste')}</h2>
            <form onSubmit={handleAddWaste} className="space-y-4">
            <div>
  <label className="block text-sm font-medium text-gray-700">Farmer Name</label>
  <input
    type="text"
    required
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
    value={newWaste.farmerName}
    onChange={(e) => setNewWaste({...newWaste, farmerName: e.target.value})}
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Waste Type</label>
  <input
    type="text"
    required
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
    value={newWaste.type}
    onChange={(e) => setNewWaste({...newWaste, type: e.target.value})}
  />
</div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('waste.quantity')}</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newWaste.quantity}
                    onChange={(e) => setNewWaste({...newWaste, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('waste.price')}</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={newWaste.price}
                    onChange={(e) => setNewWaste({...newWaste, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('waste.location')}</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newWaste.location}
                  onChange={(e) => setNewWaste({...newWaste, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('waste.availableFrom')}</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={newWaste.availableFrom}
                  onChange={(e) => setNewWaste({...newWaste, availableFrom: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('waste.description')}</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows="3"
                  value={newWaste.description}
                  onChange={(e) => setNewWaste({...newWaste, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  {t('waste.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageWaste; 