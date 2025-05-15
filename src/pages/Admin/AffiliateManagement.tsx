import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Check, X, User } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';

export interface IAffiliateUser {
  _id: string;
  firstName: string;
  lastName: string;
  referralCount: number;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  email: string;
}

const AffiliateManagement = () => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [affiliates, setAffiliates] = useState<IAffiliateUser[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<
    IAffiliateUser[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof IAffiliateUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Add this ref to track user-initiated page changes
  const userChangedPage = useRef(false);

  // Fetch all affiliates
  const fetchAffiliates = async () => {
    try {
      // Replace with your actual API endpoint
      const affiliateData = await sendRequest('/affiliates', 'GET');
      setAffiliates(affiliateData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredAffiliates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAffiliates = filteredAffiliates.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Function to handle search
  useEffect(() => {
    const results = affiliates.filter(
      (affiliate) =>
        affiliate._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${affiliate.firstName} ${affiliate.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        affiliate.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredAffiliates(results);

    // Only reset to page 1 when search term changes, not when allUsers changes
    if (searchTerm) {
      setCurrentPage(1);
      userChangedPage.current = false;
    }
  }, [searchTerm, affiliates]);

  // Add this effect to check if we need to adjust current page
  useEffect(() => {
    // If the current page would be out of bounds now, adjust it
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      userChangedPage.current = false;
    }
  }, [filteredAffiliates, totalPages]);

  // Handle sorting
  const handleSort = (field: keyof IAffiliateUser) => {
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

  // Function to handle status changes
  const handleStatusChange = async (
    affiliateId: string,
    newStatus: 'approved' | 'rejected',
  ) => {
    try {
      await sendRequest(`/affiliates/${affiliateId}/status`, 'PUT', {
        status: newStatus,
      });
      // Update local state
      const updatedAffiliates = affiliates.map((affiliate) =>
        affiliate._id === affiliateId
          ? { ...affiliate, status: newStatus }
          : affiliate,
      );
      setAffiliates(updatedAffiliates);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Function to get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <div className="flex justify-between flex-wrap gap-3 items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Affiliate Management
        </h2>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by user ID, name or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Affiliates table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('_id')}
              >
                <div className="flex items-center">
                  User ID
                  {sortField === '_id' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  Full Name
                  {sortField === 'firstName' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('referralCount')}
              >
                <div className="flex items-center">
                  Referrals
                  {sortField === 'referralCount' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center">
                  Status
                  {sortField === 'status' &&
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
            {currentAffiliates.length > 0 ? (
              currentAffiliates.map((affiliate) => (
                <tr
                  key={affiliate._id}
                  className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600"
                >
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                    <div className="font-medium">{affiliate._id}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                    {`${affiliate.firstName} ${affiliate.lastName}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                    {affiliate.referralCount}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    <div className="flex items-center justify-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyle(
                          affiliate.status,
                        )}`}
                      >
                        {affiliate.status.charAt(0).toUpperCase() +
                          affiliate.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {affiliate.status === 'pending' ? (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(affiliate._id, 'approved')
                            }
                            className="text-green-600 hover:text-green-800 border border-green-300 px-3 py-1.5 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                            title="Approve affiliate"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(affiliate._id, 'rejected')
                            }
                            className="text-red-600 hover:text-red-800 border border-red-300 px-3 py-1.5 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                            title="Reject affiliate"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            // View affiliate details
                            console.log(`View details for ${affiliate._id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                          title="View affiliate details"
                        >
                          <User size={16} />
                          <span>Details</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No affiliates found matching your search criteria
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
          {Math.min(indexOfLastItem, filteredAffiliates.length)} of{' '}
          {filteredAffiliates.length} affiliates
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

export default AffiliateManagement;
