import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  Clock,
  X,
  Loader,
} from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from '@/components/UI/Alert';
import { User } from '@/types/types';

// TypeScript interface for trader data
interface Trader {
  _id: string;
  uid: string;
  firstName: string;
  lastName: string;
  country: string;
  tradingStatus: 'None' | 'Trader';
  tradingLimit: 'In Process' | 'Institutional' | 'Individual' | 'None';
  tradingLevel: 'Lv. 1' | 'Lv. 2' | 'Lv. 3' | 'Lv. 4' | 'Lv. 5' | 'None';
}

const ManageTraders = () => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [traders, setTraders] = useState<Trader[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<Trader[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Trader | null>('uid');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add this ref to track user-initiated page changes
  const userChangedPage = useRef(false);

  // Form state for trader updates
  const [formData, setFormData] = useState({
    tradingStatus: 'None' as 'None' | 'Trader',
    tradingLimit: 'None' as
      | 'In Process'
      | 'Institutional'
      | 'Individual'
      | 'None',
    tradingLevel: 'None' as
      | 'Lv. 1'
      | 'Lv. 2'
      | 'Lv. 3'
      | 'Lv. 4'
      | 'Lv. 5'
      | 'None',
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const usersData = await sendRequest('/auth/users', 'GET');

      // Filter users with tradingStatus === 'Trader'
      const traderUsers = usersData.filter(
        (user: User) => user.tradingStatus === 'Trader',
      );

      console.log(traders);
      setTraders(traderUsers);
      setFilteredTraders(traderUsers);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredTraders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTraders = filteredTraders.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Function to handle search
  useEffect(() => {
    const results = traders.filter(
      (trader) =>
        trader.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.tradingLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.tradingLimit.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTraders(results);
    // Only reset to page 1 when search term changes, not when allUsers changes
    if (searchTerm) {
      setCurrentPage(1);
      userChangedPage.current = false;
    }
  }, [searchTerm, traders]);

  // Add this effect to check if we need to adjust current page
  useEffect(() => {
    // If the current page would be out of bounds now, adjust it
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      userChangedPage.current = false;
    }
  }, [filteredTraders, totalPages]);

  // Handle sorting
  const handleSort = (field: keyof Trader) => {
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

  // Get trading level styles
  const getTradingLevelStyles = (level: string) => {
    switch (level) {
      case 'Lv. 5':
        return {
          bg: 'bg-purple-100 dark:bg-opacity-10',
          text: 'text-purple-600',
        };
      case 'Lv. 4':
        return {
          bg: 'bg-blue-100 dark:bg-opacity-10',
          text: 'text-blue-600',
        };
      case 'Lv. 3':
        return {
          bg: 'bg-green-100 dark:bg-opacity-10',
          text: 'text-green-600',
        };
      case 'Lv. 2':
        return {
          bg: 'bg-yellow-100 dark:bg-opacity-10',
          text: 'text-yellow-600',
        };
      case 'Lv. 1':
        return {
          bg: 'bg-orange-100 dark:bg-opacity-10',
          text: 'text-orange-600',
        };
      case 'None':
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-600',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-700 dark:text-white',
        };
    }
  };

  // Get trading limit styles
  const getTradingLimitStyles = (limit: string) => {
    switch (limit) {
      case 'Institutional':
        return {
          bg: 'bg-blue-100 dark:bg-opacity-10',
          text: 'text-blue-600',
        };
      case 'Individual':
        return {
          bg: 'bg-green-100 dark:bg-opacity-10',
          text: 'text-green-600',
        };
      case 'In Process':
        return {
          bg: 'bg-yellow-100 dark:bg-opacity-10',
          text: 'text-yellow-600',
          icon: <Clock size={16} className="text-yellow-500" />,
        };
      case 'None':
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-600',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-700 dark:text-white',
        };
    }
  };

  // Open trader modal
  const openTraderModal = (trader: Trader) => {
    setSelectedTrader(trader);
    setFormData({
      tradingStatus: trader.tradingStatus,
      tradingLimit: trader.tradingLimit,
      tradingLevel: trader.tradingLevel,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle trader update
  const handleUpdateTrader = async () => {
    if (!selectedTrader) return;

    setModalLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send request to update trader status
      const { message, user } = await sendRequest(
        `/auth/update-user/${selectedTrader._id}`,
        'PUT',
        formData,
      );

      // Update traders list with updated trader
      setTraders((prev) =>
        prev.map((t) => (t._id === user._id ? { ...t, ...formData } : t)),
      );

      setSuccess(message || 'Trader updated successfully');

      // Close modal after a delay
      setTimeout(() => {
        setIsModalOpen(false);
        fetchUsers(); // Refresh data
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update trader');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Trader Management
      </h2>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search traders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Traders table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('uid')}
              >
                <div className="flex items-center">
                  UID
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
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  Name
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
                onClick={() => handleSort('country')}
              >
                <div className="flex items-center">
                  Country
                  {sortField === 'country' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('tradingStatus')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'tradingStatus' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('tradingLimit')}
              >
                <div className="flex items-center">
                  Limit
                  {sortField === 'tradingLimit' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('tradingLevel')}
              >
                <div className="flex items-center">
                  Level
                  {sortField === 'tradingLevel' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentTraders.length > 0 ? (
              currentTraders.map((trader) => {
                const levelStyle = getTradingLevelStyles(trader.tradingLevel);
                const limitStyle = getTradingLimitStyles(trader.tradingLimit);
                return (
                  <tr
                    key={trader._id}
                    className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600 whitespace-nowrap"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="font-medium">
                        {trader.uid.substring(0, 6)}...
                        {trader.uid.substring(trader.uid.length - 4)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm dark:text-gray-400">
                      <div className="font-medium">
                        {trader.firstName} {trader.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm dark:text-gray-400">
                      <div className="font-medium">{trader.country}</div>
                    </td>
                    <td className="px-4 py-4 text-sm dark:text-gray-400">
                      <div className="font-medium">{trader.tradingStatus}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${limitStyle.bg} ${limitStyle.text}`}
                      >
                        {limitStyle.icon && limitStyle.icon}
                        <span className={limitStyle.icon ? 'ml-1' : ''}>
                          {trader.tradingLimit}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelStyle.bg} ${levelStyle.text}`}
                      >
                        {trader.tradingLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openTraderModal(trader)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No traders found matching your search criteria
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
          {Math.min(indexOfLastItem, filteredTraders.length)} of{' '}
          {filteredTraders.length} traders
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

      {/* Trader Detail Modal */}
      {isModalOpen && selectedTrader && (
        <div className="fixed inset-0 z-[1000000] bg-black bg-opacity-50 customBlur flex items-center justify-center">
          <div className="bg-white dark:bg-bodydark1 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trader Details
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Trader information */}
            <div className="mb-6 p-3 bg-gray-50 dark:bg-bodydark2/50 rounded-md">
              <div className="mb-4">
                <h4 className="font-semibold text-lg dark:text-white">
                  {selectedTrader.firstName} {selectedTrader.lastName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTrader.uid}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Country:</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedTrader.country}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Trading Status:</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedTrader.tradingStatus}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Trading Limit:</strong>
                </p>
                <p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getTradingLimitStyles(selectedTrader.tradingLimit).bg
                    } ${
                      getTradingLimitStyles(selectedTrader.tradingLimit).text
                    }`}
                  >
                    {selectedTrader.tradingLimit}
                  </span>
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Trading Level:</strong>
                </p>
                <p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getTradingLevelStyles(selectedTrader.tradingLevel).bg
                    } ${
                      getTradingLevelStyles(selectedTrader.tradingLevel).text
                    }`}
                  >
                    {selectedTrader.tradingLevel}
                  </span>
                </p>
              </div>
            </div>

            {/* Update form */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Trader Settings
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trading Status
                  </label>
                  <select
                    name="tradingStatus"
                    value={formData.tradingStatus}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-gray-300"
                  >
                    <option value="None">None</option>
                    <option value="Trader">Trader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trading Limit
                  </label>
                  <select
                    name="tradingLimit"
                    value={formData.tradingLimit}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-gray-300"
                  >
                    <option value="None">None</option>
                    <option value="In Process">In Process</option>
                    <option value="Individual">Individual</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trading Level
                  </label>
                  <select
                    name="tradingLevel"
                    value={formData.tradingLevel}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:text-gray-300"
                  >
                    <option value="None">None</option>
                    <option value="Lv. 1">Lv. 1</option>
                    <option value="Lv. 2">Lv. 2</option>
                    <option value="Lv. 3">Lv. 3</option>
                    <option value="Lv. 4">Lv. 4</option>
                    <option value="Lv. 5">Lv. 5</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={modalLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateTrader}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTraders;
