import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';

// TypeScript interface for trade data
interface Trade {
  _id: string;
  userId: string;
  symbol: string;
  action: 'buy' | 'sell';
  orderType: 'limit' | 'market';
  marketPrice: number;
  quantity: number;
  amount: number;
  status: 'pending' | 'executed' | 'canceled' | 'failed';
  createdAt: string;
}

const TradeHistory = () => {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Trade | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all trade history
  const fetchTradeHistory = async () => {
    setLoading(true);
    try {
      const tradesData = await sendRequest('/transaction/trades', 'GET');
      setTrades(tradesData);
      setFilteredTrades(tradesData);
    } catch (error: any) {
      console.error('Error fetching trade history:', error.message);
      setError('Failed to load trade history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeHistory();
  }, []);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search
  useEffect(() => {
    const results = trades.filter(
      (trade) =>
        trade.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTrades(results);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, trades]);

  // Handle sorting
  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Sort the trades
    const sortedTrades = [...filteredTrades].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTrades(sortedTrades);
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
      case 'executed':
        return {
          bg: 'bg-green-100 dark:bg-opacity-10',
          text: 'text-green-600',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-opacity-10',
          text: 'text-yellow-600',
        };
      case 'rejected':
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-600',
        };
      case 'canceled':
        return {
          bg: 'bg-red-100 dark:bg-opacity-10',
          text: 'text-red-600',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-700 dark:text-white',
        };
    }
  };

  // Get action styles
  const getActionStyles = (action: string) => {
    switch (action) {
      case 'buy':
        return {
          bg: 'bg-green-100 dark:bg-opacity-10',
          text: 'text-green-600',
        };
      case 'sell':
        return {
          bg: 'bg-red-100 dark:bg-opacity-10',
          text: 'text-red-600',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-opacity-10',
          text: 'text-gray-700 dark:text-white',
        };
    }
  };

  // Format date
  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString();
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format number with appropriate decimals
  const formatNumber = (value: number, decimals: number = 8) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Trade History
      </h2>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by user ID, symbol, action, order type, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader size={32} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Trades table */}
      {!loading && !error && (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full whitespace-nowrap">
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
                    Pair
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
                  onClick={() => handleSort('action')}
                >
                  <div className="flex items-center">
                    Action
                    {sortField === 'action' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderType')}
                >
                  <div className="flex items-center">
                    Order Type
                    {sortField === 'orderType' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('marketPrice')}
                >
                  <div className="flex items-center">
                    Market Price
                    {sortField === 'marketPrice' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortField === 'quantity' &&
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
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Time
                    {sortField === 'createdAt' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTrades.length > 0 ? (
                currentTrades.map((trade) => {
                  const statusStyle = getStatusStyles(trade.status);
                  const actionStyle = getActionStyles(trade.action);
                  return (
                    <tr
                      key={trade._id}
                      className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600 whitespace-nowrap"
                    >
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                        <div className="font-medium">
                          {trade.userId.substring(0, 6)}...
                          {trade.userId.substring(trade.userId.length - 4)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">{trade.symbol}/USDT</div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionStyle.bg} ${actionStyle.text}`}
                        >
                          {trade.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">{trade.orderType}</div>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">
                          {formatCurrency(trade.marketPrice)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">
                          {formatNumber(trade.quantity)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">
                          {formatCurrency(trade.amount)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {trade.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm dark:text-gray-400">
                        <div className="font-medium">
                          {formatDate(trade.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No trades found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredTrades.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-2 mt-6">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, filteredTrades.length)} of{' '}
            {filteredTrades.length} trades
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
      )}
    </div>
  );
};

export default TradeHistory;
