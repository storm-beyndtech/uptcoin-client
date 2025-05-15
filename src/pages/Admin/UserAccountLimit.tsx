import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import UserLimitsModal from '@/components/UserLimitsModal';
import { sendRequest } from '@/lib/sendRequest';

export interface IUserLimit {
  _id: string;
  uid: string;
  email: string;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

const UserAccountLimit = () => {
  // State for filtering and pagination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserLimit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<IUserLimit[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUserLimit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof IUserLimit | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Add this ref to track user-initiated page changes
  const userChangedPage = useRef(false);

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
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(results);
    // Only reset to page 1 when search term changes, not when allUsers changes
    if (searchTerm) {
      setCurrentPage(1);
      userChangedPage.current = false;
    }
  }, [searchTerm, users]);

 // Add this effect to check if we need to adjust current page
  useEffect(() => {
    // If the current page would be out of bounds now, adjust it
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      userChangedPage.current = false;
    }
  }, [filteredUsers, totalPages]);

  // Handle sorting
  const handleSort = (field: keyof IUserLimit) => {
    // Calculate the new sort direction
    let newDirection: 'asc' | 'desc';

    if (sortField === field) {
      // Toggle direction if same field is clicked again
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending for new field
      newDirection = 'asc';
    }

    // Update sort state (actual sorting happens in the useEffect)
    setSortField(field);
    setSortDirection(newDirection);

    // Reset to page 1 when sorting changes
    setCurrentPage(1);
    userChangedPage.current = false;
  };

  // Handle page change
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      userChangedPage.current = true; // Mark that user explicitly changed the page
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

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Function to open modal with selected user
  const openLimitsModal = (user: IUserLimit) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Manage User Limits
        </h2>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
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

        {/* Users table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('uid')}
                >
                  <div className="flex items-center">
                    User ID
                    {sortField === 'uid' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === 'email' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('minDeposit')}
                >
                  <div className="flex items-center">
                    Min Deposit
                    {sortField === 'minDeposit' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('maxDeposit')}
                >
                  <div className="flex items-center">
                    Max Deposit
                    {sortField === 'maxDeposit' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('minWithdrawal')}
                >
                  <div className="flex items-center">
                    Min Withdrawal
                    {sortField === 'minWithdrawal' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('maxWithdrawal')}
                >
                  <div className="flex items-center">
                    Max Withdrawal
                    {sortField === 'maxWithdrawal' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="font-medium">
                        {user.uid.substring(0, 6)}...
                        {user.uid.substring(user.uid.length - 4)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatCurrency(user.minDeposit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatCurrency(user.maxDeposit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatCurrency(user.minWithdrawal)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatCurrency(user.maxWithdrawal)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => openLimitsModal(user)}
                          className="text-blue-600 hover:text-blue-800 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                          title="Set limits"
                        >
                          <Settings size={16} />
                          <span>Set Limit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No users found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-6">
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

      {isModalOpen && selectedUser && (
        <UserLimitsModal user={selectedUser} setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};

export default UserAccountLimit;
