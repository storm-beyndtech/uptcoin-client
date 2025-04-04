import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Ban,
  Trash2,
  ArrowUpRight,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendRequest } from '@/lib/sendRequest';
import { AdminDepositModal } from '@/components/AdminDepositModal';
import { AdminWithdrawalModal } from '@/components/AdminWithdrawalModal';
import { AdminTransferModal } from '@/components/AdminTransferModal';

// TypeScript interfaces
export interface Asset {
  _id: string;
  symbol: string;
  funding: number;
  spot: number;
  name: string;
  address: string;
  network: string;
  status: string;
}

export interface IUser {
  _id: string;
  uid: string;
  email: string;
  createdAt: string;
  accountStatus: 'active' | 'suspended' | 'deactivated';
  assets: Asset[];
}

const UserAssets = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof Asset | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state (to be implemented later)
  const [showDebitModal, setShowDebitModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  //Fetch all users
  const fetchUser = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const { user } = await sendRequest(`/auth/users/${id}`, 'GET');
      setUser(user);
      setFilteredAssets(user.assets || []);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data
  useEffect(() => {
    fetchUser();
  }, [id]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search
  useEffect(() => {
    if (!user || !user.assets) return;

    const results = user.assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredAssets(results);
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, user]);

  // Handle sorting
  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Sort the assets
    const sortedAssets = [...filteredAssets].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAssets(sortedAssets);
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

  // Action handlers (to be implemented with modals later)
  const handleDebit = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDebitModal(true);
  };

  const handleCredit = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowCreditModal(true);
  };

  const handleTransfer = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowTransferModal(true);
  };

  const handleSuspend = (assetId: string) => {
    console.log(`Suspending asset with ID: ${assetId}`);
    // API call to suspend asset
  };

  const handleRemove = (assetId: string) => {
    console.log(`Removing asset with ID: ${assetId}`);
    // API call to remove asset
  };

  // Get status styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bg: 'border border-green-400/50',
          text: 'text-green-500',
        };
      case 'suspended':
        return {
          bg: 'border border-yellow-400/50',
          text: 'text-yellow-500',
        };
      case 'inactive':
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

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10 flex justify-center items-center h-64">
        <RefreshCw size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  // Handle case where user is not found
  if (!user) {
    return (
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/users')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              User Not Found
            </h2>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The requested user could not be found.
          </p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
      {/* User info header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="text-blue-500 mb-4 flex items-center hover:underline"
        >
          ← Back to Users
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user.email}
            </h2>
            <p className="text-gray-500 mt-1">
              User ID: {user.uid.substring(0, 6)}...
              {user.uid.substring(user.uid.length - 4)}
            </p>
          </div>

          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                getStatusStyles(user.accountStatus).bg
              } ${getStatusStyles(user.accountStatus).text}`}
            >
              {user.accountStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Assets table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center">
                  Symbol
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
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('funding')}
              >
                <div className="flex items-center">
                  Funding
                  {sortField === 'funding' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('spot')}
              >
                <div className="flex items-center">
                  Spot
                  {sortField === 'spot' &&
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
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.length > 0 ? (
              currentAssets.map((asset) => {
                const statusStyle = getStatusStyles(asset.status);
                return (
                  <tr
                    key={asset._id}
                    className="border-b border-gray-100 hover:opacity-90 dark:border-gray-600"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      <div className="font-medium">{asset.symbol}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {asset.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {asset.funding.toFixed(asset.symbol === 'USDT' ? 2 : 6)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {asset.spot.toFixed(asset.symbol === 'USDT' ? 2 : 6)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {asset.network}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleCredit(asset)}
                          className="flex items-center text-sm gap-1 text-green-600 hover:text-green-800 border border-green-300 p-1 px-1.5 rounded hover:bg-green-200 transition-colors"
                          title="Credit asset"
                        >
                          <CreditCard size={16} /> Credit
                        </button>
                        <button
                          onClick={() => handleDebit(asset)}
                          className="flex items-center text-sm gap-1 text-blue-600 hover:text-blue-800 border border-blue-300 p-1 px-1.5 rounded hover:bg-blue-200 transition-colors"
                          title="Debit asset"
                        >
                          <CreditCard size={16} /> Debit
                        </button>
                        <button
                          onClick={() => handleTransfer(asset)}
                          className="flex items-center text-sm gap-1 text-purple-600 hover:text-purple-800 border border-purple-300 p-1 px-1.5 rounded hover:bg-purple-200 transition-colors"
                          title="Transfer asset"
                        >
                          <ArrowUpRight size={16} /> Transfer
                        </button>
                        <button
                          onClick={() => handleSuspend(asset._id)}
                          className="text-yellow-600 hover:text-yellow-800 border border-yellow-300 p-1.5 rounded hover:bg-yellow-200 transition-colors"
                          title="Suspend asset"
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => handleRemove(asset._id)}
                          className="text-red-600 hover:text-red-800 border border-red-300 p-1.5 rounded hover:bg-red-200 transition-colors"
                          title="Remove asset"
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
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No assets found matching your search criteria
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
          {Math.min(indexOfLastItem, filteredAssets.length)} of{' '}
          {filteredAssets.length} assets
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

      {/* Modal placeholders - will be implemented later */}
      {showCreditModal && selectedAsset && (
        <AdminDepositModal
          asset={selectedAsset}
          showModal={setShowCreditModal}
        />
      )}
      {showDebitModal && selectedAsset && (
        <AdminWithdrawalModal
          asset={selectedAsset}
          showModal={setShowDebitModal}
        />
      )}
      {showTransferModal && selectedAsset && (
        <AdminTransferModal
          asset={selectedAsset}
          showModal={setShowTransferModal}
        />
      )}
    </div>
  );
};

export default UserAssets;
