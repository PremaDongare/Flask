import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaShoppingCart, FaChartBar, FaComments, FaTruck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FarmerNavigation = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <Link 
        to="/farmer/waste" 
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50"
      >
        <FaLeaf className="mr-2" />
        {t('navigation.manageWaste')}
      </Link>
      <NavLink 
        to="/farmer/waste-selling"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 hover:bg-green-50 rounded-md ${
            isActive ? 'bg-green-100 text-green-600' : 'text-gray-700'
          }`
        }
      >
        <FaShoppingCart className="text-xl" />
        <span>{t('navigation.wasteSelling')}</span>
      </NavLink>
      <NavLink 
        to="/farmer/sales-dashboard"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 hover:bg-green-50 rounded-md ${
            isActive ? 'bg-green-100 text-green-600' : 'text-gray-700'
          }`
        }
      >
        <FaChartBar className="text-xl" />
        <span>{t('navigation.monthlySales')}</span>
      </NavLink>
      <NavLink 
        to="/farmer/chat"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 hover:bg-green-50 rounded-md ${
            isActive ? 'bg-green-100 text-green-600' : 'text-gray-700'
          }`
        }
      >
        <FaComments className="text-xl" />
        <span>{t('navigation.chat')}</span>
      </NavLink>
      <NavLink 
        to="/farmer/transport"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 hover:bg-green-50 rounded-md ${
            isActive ? 'bg-green-100 text-green-600' : 'text-gray-700'
          }`
        }
      >
        <FaTruck className="text-xl" />
        <span>{t('navigation.transport')}</span>
      </NavLink>
    </div>
  );
};

export default FarmerNavigation; 