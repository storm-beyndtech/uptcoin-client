import { useState, useEffect } from 'react';
import { UserIcon, Mail, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/types';
import { sendRequest } from '@/lib/sendRequest';

const UsersAccount = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();

  //Fetch all users
  const fetchUsers = async () => {
    try {
      const usersData = await sendRequest('/auth/users', 'GET');
      setUsers(usersData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search
  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.accountStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Handle page change
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3;
    const startPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(maxButtons / 2),
        totalPages - maxButtons + 1,
      ),
    );
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 ${
            currentPage === i
              ? 'bg-transparent border border-blue-400 text-blue-600 font-medium'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50/10 dark:text-blue-400'
          } rounded-md`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  // Navigate to user assets page
  const handleViewUserAssets = (userId: string) => {
    navigate(`/admin/user-assets/${userId}`);
  };

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bg: 'border-green-400/50',
          text: 'text-green-500',
        };
      case 'suspended':
        return {
          bg: 'border-yellow-400/50',
          text: 'text-yellow-500',
        };
      case 'deactivated':
        return {
          bg: 'border-red-400/50',
          text: 'text-red-500',
        };
      default:
        return {
          bg: 'border-gray-400/50',
          text: 'text-gray-500 dark:text-white',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        User Management
      </h2>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => {
            const statusStyle = getStatusStyles(user.accountStatus);
            return (
              <div
                key={user._id}
                onClick={() => handleViewUserAssets(user._id)}
                className="cursor-pointer bg-white dark:bg-bodydark2/40 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {user.accountStatus}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 truncate">
                    {user.email}
                  </h3>
                </div>

                <div className="flex items-center mb-3">
                  <UserIcon size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.uid.substring(0, 8)}...
                    {user.uid.substring(user.uid.length - 4)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {user.assets ? user.assets.length : 0} Assets
                    </span>
                  </div>

                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            No users found matching your search criteria
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-8">
        <div className="text-sm text-gray-400">
          Showing {indexOfFirstItem + 1} to{' '}
          {Math.min(indexOfLastItem, filteredUsers.length)} of{' '}
          {filteredUsers.length} users
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-500 rounded-md hover:opacity-80 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {renderPaginationButtons()}

          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-500 rounded-md hover:opacity-80 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersAccount;
