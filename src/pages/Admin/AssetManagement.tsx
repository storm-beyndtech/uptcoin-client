import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Settings, Plus } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import AssetManagementModal from '@/components/AssetManagementModal';

export interface ISymbol {
  _id: string;
  symbol: string;
  margin: number;
  name: string;
  address: string;
  network: string;
  transfer: boolean;
  deposit: boolean;
  withdraw: boolean;
  minWithdraw: number;
  minDeposit: number;
  withdrawalFee: number;
  conversionFee: number;
}

const AssetManagement = () => {
  // State for filtering and pagination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ISymbol | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<ISymbol[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<ISymbol[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<keyof ISymbol | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch all assets
  const fetchAssets = async () => {
    try {
      const assetsData = await sendRequest('/coins', 'GET');
      setAssets(assetsData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle search
  useEffect(() => {
    const results = assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.network.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredAssets(results);
    setCurrentPage(1);
  }, [searchTerm, assets]);

  // Handle sorting
  const handleSort = (field: keyof ISymbol) => {
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

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
    }).format(value / 100);
  };

  // Function to open modal with selected asset
  const openManagementModal = (asset: ISymbol) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // Function to open modal for adding a new asset
  const openNewAssetModal = () => {
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  // Function to refresh assets after modal actions
  const refreshAssets = () => {
    fetchAssets();
  };

  return (
    <>
      <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-6xl mx-auto mt-10">
        <div className="flex justify-between flex-wrap gap-3 items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Manage Assets
          </h2>
          <button
            onClick={openNewAssetModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add New Asset
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assets by symbol, name or network..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Assets table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full whitespace-nowrap">
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
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('withdrawalFee')}
                >
                  <div className="flex items-center">
                    Withdrawal Fee
                    {sortField === 'withdrawalFee' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('margin')}
                >
                  <div className="flex items-center">
                    Margin
                    {sortField === 'margin' &&
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
                currentAssets.map((asset) => (
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
                      {asset.network}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            asset.deposit
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {asset.deposit ? 'Deposit' : 'No Deposit'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            asset.withdraw
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {asset.withdraw ? 'Withdraw' : 'No Withdraw'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatCurrency(asset.withdrawalFee)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-400">
                      {formatPercentage(asset.margin)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => openManagementModal(asset)}
                          className="text-blue-600 hover:text-blue-800 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                          title="Manage asset"
                        >
                          <Settings size={16} />
                          <span>Manage</span>
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
      </div>

      {isModalOpen && (
        <AssetManagementModal
          asset={selectedAsset}
          setIsModalOpen={setIsModalOpen}
          onSuccess={refreshAssets}
        />
      )}
    </>
  );
};

export default AssetManagement;
