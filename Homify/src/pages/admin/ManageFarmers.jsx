import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter, FaDownload, FaBan } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function ManageFarmers() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [queries, setQueries] = useState([]);
  
  useEffect(() => {
    fetchFarmers();
    fetchQueries();
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchFarmers();
      fetchQueries();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchFarmers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/farmers', {
        params: {
          page: currentPage,
          status: selectedStatus,
          search: searchTerm,
        },
      });
      setFarmers(response.data.farmers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      // Mock data for demonstration
      const mockFarmers = [
        {
          id: 1,
          uid: 'farmer1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '+91 98765 43210',
          location: 'Patna, Bihar',
          joinedDate: '2022-05-15',
          status: 'active',
          totalListings: 8,
          totalSales: 15,
          revenue: 25000,
        },
        {
          id: 2,
          name: 'Sunita Devi',
          email: 'sunita.devi@example.com',
          phone: '+91 98765 43211',
          location: 'Ludhiana, Punjab',
          joinedDate: '2022-06-20',
          status: 'active',
          totalListings: 12,
          totalSales: 22,
          revenue: 35000,
        },
        {
          id: 3,
          name: 'Harpreet Singh',
          email: 'harpreet.singh@example.com',
          phone: '+91 98765 43212',
          location: 'Amritsar, Punjab',
          joinedDate: '2022-07-10',
          status: 'inactive',
          totalListings: 5,
          totalSales: 8,
          revenue: 12000,
        },
        {
          id: 4,
          name: 'Meena Kumari',
          email: 'meena.kumari@example.com',
          phone: '+91 98765 43213',
          location: 'Meerut, Uttar Pradesh',
          joinedDate: '2022-08-05',
          status: 'pending',
          totalListings: 0,
          totalSales: 0,
          revenue: 0,
        },
        {
          id: 5,
          name: 'Ramesh Patel',
          email: 'ramesh.patel@example.com',
          phone: '+91 98765 43214',
          location: 'Ahmedabad, Gujarat',
          joinedDate: '2022-09-15',
          status: 'active',
          totalListings: 10,
          totalSales: 18,
          revenue: 30000,
        },
      ];
      setFarmers(mockFarmers);
      setTotalPages(3);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchQueries = () => {
    const allQueries = JSON.parse(localStorage.getItem('farmerQueries') || '[]');
    setQueries(allQueries);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFarmers();
  };
  
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleEditFarmer = (farmer) => {
    setCurrentFarmer(farmer);
    setIsModalOpen(true);
  };
  
  const handleDeleteFarmer = async (id) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await api.delete(`/admin/farmers/${id}`);
        setFarmers(farmers.filter(farmer => farmer.id !== id));
      } catch (error) {
        console.error('Error deleting farmer:', error);
        // For demonstration, simulate successful delete
        setFarmers(farmers.filter(farmer => farmer.id !== id));
      }
    }
  };
  
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/admin/farmers/${id}/status`, { status: newStatus });
      setFarmers(farmers.map(farmer => 
        farmer.id === id ? { ...farmer, status: newStatus } : farmer
      ));
    } catch (error) {
      console.error('Error updating farmer status:', error);
      // For demonstration, simulate successful update
      setFarmers(farmers.map(farmer => 
        farmer.id === id ? { ...farmer, status: newStatus } : farmer
      ));
    }
  };
  
  const handleExportData = () => {
    // In a real application, this would generate a CSV or Excel file
    alert('Exporting farmer data...');
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleBlockFarmer = (farmerId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.uid === farmerId) {
          const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
          return { ...user, status: newStatus };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      fetchFarmers();
      
      toast.success(t('admin.manageFarmers.statusUpdateSuccess'));
    } catch (error) {
      toast.error(t('admin.manageFarmers.statusUpdateError'));
    }
  };
  
  const handleQueryResponse = async (queryId, status) => {
    try {
      const updatedQueries = queries.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            status,
            responseDate: new Date().toISOString(),
            responseMessage: status === 'approved' 
              ? t('admin.manageFarmers.queryApproved')
              : t('admin.manageFarmers.queryRejected')
          };
        }
        return query;
      });

      localStorage.setItem('farmerQueries', JSON.stringify(updatedQueries));
      setQueries(updatedQueries);
      
      toast.success(t('admin.manageFarmers.queryResponseSuccess'));
    } catch (error) {
      toast.error(t('admin.manageFarmers.queryResponseError'));
    }
  };
  
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = selectedStatus === 'all' || farmer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t('admin.manageFarmers.title')}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              placeholder={t('admin.manageFarmers.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </form>
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="all">{t('admin.manageFarmers.filterAll')}</option>
          <option value="active">{t('admin.manageFarmers.filterActive')}</option>
          <option value="blocked">{t('admin.manageFarmers.filterBlocked')}</option>
          <option value="pending">{t('admin.manageFarmers.filterPending')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('admin.manageFarmers.farmersList')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('admin.manageFarmers.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('admin.manageFarmers.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('admin.manageFarmers.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('admin.manageFarmers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{farmer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{farmer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        farmer.status === 'blocked' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleBlockFarmer(farmer.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        title={farmer.status === 'blocked' ? t('admin.manageFarmers.unblock') : t('admin.manageFarmers.block')}
                      >
                        <FaBan />
                      </button>
                      <button
                        onClick={() => handleDeleteFarmer(farmer.id)}
                        className="text-red-600 hover:text-red-900"
                        title={t('admin.manageFarmers.delete')}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {t('common.previous')}
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {t('common.next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('common.showing')} <span className="font-medium">{(currentPage - 1) * 10 + 1}</span>{' '}
                  {t('common.to')}{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, filteredFarmers.length)}
                  </span>{' '}
                  {t('common.of')}{' '}
                  <span className="font-medium">{filteredFarmers.length}</span>{' '}
                  {t('common.results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('admin.manageFarmers.queries')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('admin.manageFarmers.farmer')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('admin.manageFarmers.query')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('admin.manageFarmers.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('admin.manageFarmers.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queries.map((query) => (
                <tr key={query.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{query.farmerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{query.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      query.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : query.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleQueryResponse(query.id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title={t('admin.manageFarmers.approve')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleQueryResponse(query.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title={t('admin.manageFarmers.reject')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageFarmers; 