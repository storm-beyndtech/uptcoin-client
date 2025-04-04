import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Check,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// TypeScript interface for transaction data
interface Transaction {
  id: string;
  userId: string;
  symbol: string;
  amount: number;
  network: string;
  event: 'Transfer' | 'Convert' | 'Withdrawal' | 'Deposit';
  createdAt: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const AdminLatestTransactions = ({
  allTransactions,
}: {
  allTransactions: Transaction[];
}) => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(allTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Function to handle search
  useEffect(() => {
    const results = allTransactions.filter(
      (transaction) =>
        transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTransactions(results);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, allTransactions]);

  // Handle sorting
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Sort the transactions
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTransactions(sortedTransactions);
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
    switch (status) {
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

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Latest Transactions
      </h2>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Transaction table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('userId')}
              >
                <div className="flex items-center">
                  User's ID
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
                  Crypto
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
                onClick={() => handleSort('network')}
              >
                <div className="flex items-center">
                  Network
                  {sortField === 'network' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('event')}
              >
                <div className="flex items-center">
                  Event
                  {sortField === 'event' &&
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
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => {
                const statusStyle = getStatusStyles(transaction.status);
                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600 whitespace-nowrap"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="font-medium">
                        {transaction.userId.substring(0, 6)}...
                        {transaction.userId.substring(
                          transaction.userId.length - 4,
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://assets.coincap.io/assets/icons/${transaction.symbol.toLocaleLowerCase()}@2x.png`}
                          alt={transaction.symbol}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium dark:text-gray-400">
                          {transaction.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm dark:text-gray-400">
                      <div className="font-medium">
                        {transaction.amount.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}{' '}
                        {transaction.symbol}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {transaction.network}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium capitalize dark:text-gray-400">
                        {transaction.event}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="whitespace-nowrap">
                        {new Date(transaction.createdAt).toLocaleDateString(
                          'en-US',
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon}
                        <span className="ml-1">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        to={`/admin/manage-${transaction.event}s`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No transactions found matching your search criteria
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
          {Math.min(indexOfLastItem, filteredTransactions.length)} of{' '}
          {filteredTransactions.length} transactions
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

export default AdminLatestTransactions;
