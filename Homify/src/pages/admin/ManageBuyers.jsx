import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBan, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

function ManageBuyers() {
  const { t } = useTranslation();
  const [buyers, setBuyers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBuyers();
    fetchQueries();
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchBuyers();
      fetchQueries();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBuyers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const buyerUsers = users.filter(user => user.role === 'buyer');
      setBuyers(buyerUsers);
    } catch (error) {
      console.error('Error fetching buyers:', error);
      toast.error('Error fetching buyers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueries = () => {
    try {
      const allQueries = JSON.parse(localStorage.getItem('buyerQueries') || '[]');
      setQueries(allQueries);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleBlockBuyer = (buyerId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.uid === buyerId) {
          const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
          return { ...user, status: newStatus };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      fetchBuyers();
      
      toast.success(t('admin.manageBuyers.statusUpdateSuccess'));
    } catch (error) {
      toast.error(t('admin.manageBuyers.statusUpdateError'));
    }
  };

  const handleDeleteBuyer = (buyerId) => {
    try {
      // Delete user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(user => user.uid !== buyerId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Delete associated orders
      const orders = JSON.parse(localStorage.getItem('wasteOrders') || '[]');
      const updatedOrders = orders.filter(order => order.buyerId !== buyerId);
      localStorage.setItem('wasteOrders', JSON.stringify(updatedOrders));

      // Delete associated queries
      const updatedQueries = queries.filter(query => query.buyerId !== buyerId);
      localStorage.setItem('buyerQueries', JSON.stringify(updatedQueries));

      fetchBuyers();
      fetchQueries();
      
      toast.success(t('admin.manageBuyers.deleteSuccess'));
    } catch (error) {
      toast.error(t('admin.manageBuyers.deleteError'));
    }
  };

  const handleQueryResponse = (queryId, status) => {
    try {
      const updatedQueries = queries.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            status,
            responseDate: new Date().toISOString(),
            responseMessage: status === 'approved' 
              ? t('admin.manageBuyers.queryApproved')
              : t('admin.manageBuyers.queryRejected')
          };
        }
        return query;
      });

      localStorage.setItem('buyerQueries', JSON.stringify(updatedQueries));
      setQueries(updatedQueries);
      
      toast.success(t('admin.manageBuyers.queryResponseSuccess'));
    } catch (error) {
      toast.error(t('admin.manageBuyers.queryResponseError'));
    }
  };

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = (
      buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || buyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t('admin.manageBuyers.title')}
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('admin.manageBuyers.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">{t('admin.manageBuyers.filterAll')}</option>
          <option value="active">{t('admin.manageBuyers.filterActive')}</option>
          <option value="blocked">{t('admin.manageBuyers.filterBlocked')}</option>
        </select>
      </div>

      {/* Buyers List */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('admin.manageBuyers.buyersList')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.manageBuyers.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.manageBuyers.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.manageBuyers.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.manageBuyers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{buyer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        buyer.status === 'blocked' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleBlockBuyer(buyer.uid)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        title={buyer.status === 'blocked' ? t('admin.manageBuyers.unblock') : t('admin.manageBuyers.block')}
                      >
                        <FaBan />
                      </button>
                      <button
                        onClick={() => handleDeleteBuyer(buyer.uid)}
                        className="text-red-600 hover:text-red-900"
                        title={t('admin.manageBuyers.delete')}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Queries List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('admin.manageBuyers.queries')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.manageBuyers.buyer')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.manageBuyers.query')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.manageBuyers.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.manageBuyers.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queries.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{query.buyerName}</div>
                    <div className="text-sm text-gray-500">{query.buyerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{query.text}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(query.createdAt).toLocaleString()}
                    </div>
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
                          title={t('admin.manageBuyers.approve')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleQueryResponse(query.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title={t('admin.manageBuyers.reject')}
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

export default ManageBuyers; 