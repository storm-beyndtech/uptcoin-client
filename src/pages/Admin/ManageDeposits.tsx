import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Check,
  Clock,
  X,
  Loader,
} from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from '@/components/UI/Alert';

// TypeScript interface for deposit transaction data
interface Deposit {
  _id: string;
  userId: string;
  userEmail: string;
  symbol: string;
  amount: number;
  network: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ManageDeposits = () => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Deposit | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //Fetch all users
  const fetchDeposits = async () => {
    try {
      const depositsData = await sendRequest('/transaction/deposits', 'GET');
      setDeposits(depositsData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [deposits]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeposits = filteredDeposits.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Function to handle search
  useEffect(() => {
    const results = deposits.filter(
      (deposit) =>
        deposit.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredDeposits(results);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, deposits]);

  // Handle sorting
  const handleSort = (field: keyof Deposit) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Sort the deposits
    const sortedDeposits = [...filteredDeposits].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredDeposits(sortedDeposits);
  };

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

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-green-100 dark:bg-opacity-10',
          text: 'text-green-600',
          icon: <Check size={16} className="text-green-500" />,
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-opacity-10',
          text: 'text-yellow-600',
          icon: <Clock size={16} className="text-yellow-500" />,
        };
      case 'rejected':
        return {
          bg: 'bg-red-100 dark:bg-opacity-10',
          text: 'text-red-600',
          icon: <AlertCircle size={16} className="text-red-500" />,
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-700 dark:text-white',
          icon: null,
        };
    }
  };

  // Open deposit modal
  const openDepositModal = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Handle deposit approval/rejection
  const handleDepositAction = async (action: 'approve' | 'reject') => {
    if (!selectedDeposit) return;

    setModalLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send request to update deposit status
      const { message, deposit } = await sendRequest(
        `/transaction/deposit/${action}/${selectedDeposit._id}`,
        'PUT',
      );

      setFilteredDeposits((prev) => [...prev, deposit]);
      setSuccess(message);

      // Close modal after a delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to process deposit');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Deposit Management
      </h2>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search deposits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Deposits table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('userId')}
              >
                <div className="flex items-center">
                  User ID
                  {sortField === 'userId' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center">
                  Currency
                  {sortField === 'symbol' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {sortField === 'amount' &&
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
                  Date
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
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' &&
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
            {currentDeposits.length > 0 ? (
              currentDeposits.map((deposit) => {
                const statusStyle = getStatusStyles(deposit.status);
                return (
                  <tr
                    key={deposit._id}
                    className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600 whitespace-nowrap"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="font-medium">
                        {deposit.userId.substring(0, 6)}...
                        {deposit.userId.substring(deposit.userId.length - 4)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://assets.coincap.io/assets/icons/${deposit.symbol.toLowerCase()}@2x.png`}
                          alt={deposit.symbol}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium dark:text-gray-400">
                          {deposit.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm dark:text-gray-400">
                      <div className="font-medium">
                        {deposit.amount.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}{' '}
                        {deposit.symbol}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="whitespace-nowrap">
                        {new Date(deposit.createdAt).toLocaleDateString(
                          'en-US',
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon}
                        <span className="ml-1">{deposit.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openDepositModal(deposit)}
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
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No deposits found matching your search criteria
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
          {Math.min(indexOfLastItem, filteredDeposits.length)} of{' '}
          {filteredDeposits.length} deposits
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

      {/* Deposit Detail Modal */}
      {isModalOpen && selectedDeposit && (
        <div className="fixed inset-0 z-[1000000] bg-black bg-opacity-50 customBlur flex items-center justify-center">
          <div className="bg-white dark:bg-bodydark1 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Deposit Details
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Deposit information */}
            <div className="mb-6 p-3 bg-gray-50 dark:bg-bodydark2/50 rounded-md">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://assets.coincap.io/assets/icons/${selectedDeposit.symbol.toLowerCase()}@2x.png`}
                  alt={selectedDeposit.symbol}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-lg dark:text-white">
                    {selectedDeposit.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })}{' '}
                    {selectedDeposit.symbol}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedDeposit.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>User ID:</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedDeposit.userId.substring(0, 6)}...
                  {selectedDeposit.userId.substring(
                    selectedDeposit.userId.length - 4,
                  )}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Network:</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedDeposit.network}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Status:</strong>
                </p>
                <p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusStyles(selectedDeposit.status).bg
                    } ${getStatusStyles(selectedDeposit.status).text}`}
                  >
                    {getStatusStyles(selectedDeposit.status).icon}
                    <span className="ml-1">{selectedDeposit.status}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={modalLoading}
              >
                Close
              </button>

              {selectedDeposit.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDepositAction('reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDepositAction('approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDeposits;
