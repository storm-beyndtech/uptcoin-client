import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Ban,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// TypeScript interface for user data
export interface IUser {
  _id: string;
  uid: string;
  email: string;
  createdAt: string;
  kycStatus: 'approved' | 'pending' | 'rejected';
}

const AdminUsersList = ({ allUsers }: { allUsers: IUser[] }) => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>(allUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof IUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Add this ref to track user-initiated page changes
  const userChangedPage = useRef(false);

  const navigate = useNavigate();

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search - only resets page for search term changes
  useEffect(() => {
    const results = allUsers.filter(
      (user) =>
        user.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.kycStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    
    setFilteredUsers(results);
    
    // Only reset to page 1 when search term changes, not when allUsers changes
    if (searchTerm) {
      setCurrentPage(1);
      userChangedPage.current = false;
    }
  }, [searchTerm, allUsers]);

  // Separate effect to apply sorting whenever sort criteria change
  useEffect(() => {
    if (sortField) {
      const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      
      setFilteredUsers(sortedUsers);
    }
  }, [sortField, sortDirection]);
  
  // Add this effect to check if we need to adjust current page
  useEffect(() => {
    // If the current page would be out of bounds now, adjust it
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      userChangedPage.current = false;
    }
  }, [filteredUsers, totalPages]);

  // Handle sorting
  const handleSort = (field: keyof IUser) => {
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

  // Navigate to edit user page
  const handleEditUser = (userId: string) => {
    navigate(`/admin/manage-user/${userId}`);
  };

  // Handle suspend user
  const handleSuspendUser = (userId: string) => {
    // You would implement the suspension logic here
    console.log(`Suspending user with ID: ${userId}`);
    // After API call to suspend, you might want to refresh the data
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    // You would implement the deletion logic here
    console.log(`Deleting user with ID: ${userId}`);
    // After API call to delete, you might want to refresh the data
  };

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          bg: 'border border-green-400/50',
          text: 'text-green-500',
        };
      case 'pending':
        return {
          bg: 'border border-yellow-400/50',
          text: 'text-yellow-500',
        };
      case 'rejected':
        return {
          bg: 'border border-red-400/50',
          text: 'text-red-500',
        };
      default:
        return {
          bg: 'border border-gray-400/50',
          text: 'text-gray-500 dark:text-white',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Manage Users
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
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Date Joined
                  {sortField === 'createdAt' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('kycStatus')}
              >
                <div className="flex items-center">
                  Kyc Status
                  {sortField === 'kycStatus' &&
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
              currentUsers.map((user) => {
                const statusStyle = getStatusStyles(user.kycStatus);
                return (
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
                      <div className="whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          className="text-blue-600 hover:text-blue-800 border border-blue-300 p-1.5 rounded hover:bg-blue-200 transition-colors"
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(user._id)}
                          className="text-yellow-600 hover:text-yellow-800 border border-yellow-300 p-1.5 rounded hover:bg-yellow-200 transition-colors"
                          title="Suspend user"
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 border border-red-300 p-1.5 rounded hover:bg-red-200 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
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
          Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
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

export default AdminUsersList;