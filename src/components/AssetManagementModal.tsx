import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from './UI/Alert';

// TypeScript interface for asset management
export interface ISymbol {
  _id?: string;
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

// Props for the modal component
interface AssetManagementModalProps {
  asset: ISymbol | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

const AssetManagementModal = ({
  asset,
  setIsModalOpen,
  onSuccess,
}: AssetManagementModalProps) => {
  // Initial form data for a new asset
  const initialFormData: ISymbol = {
    symbol: '',
    margin: 0,
    name: '',
    address: '',
    network: '',
    transfer: false,
    deposit: false,
    withdraw: false,
    minWithdraw: 0,
    minDeposit: 0,
    withdrawalFee: 0,
    conversionFee: 0,
  };

  // Form state
  const [formData, setFormData] = useState<ISymbol>(initialFormData);

  // Form handling state
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [isNewAsset, setIsNewAsset] = useState(true);

  // Set initial form data from asset prop if editing
  useEffect(() => {
    if (asset) {
      setFormData(asset);
      setIsNewAsset(false);
    } else {
      setFormData(initialFormData);
      setIsNewAsset(true);
    }
  }, [asset]);

  // Handle input changes for text and number fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate form data
    if (!formData.symbol || !formData.name || !formData.network) {
      setError('Symbol, Name and Network are required fields');
      setLoading(false);
      return;
    }

    if (
      formData.minWithdraw < 0 ||
      formData.minDeposit < 0 ||
      formData.withdrawalFee < 0 ||
      formData.conversionFee < 0
    ) {
      setError('All numeric values must be positive numbers');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isNewAsset) {
        // Create new asset
        response = await sendRequest(
          `/coins/create/${formData.symbol}`,
          'POST',
          formData,
        );
      } else {
        // Update existing asset
        response = await sendRequest(
          `/coins/update/${formData.symbol}`,
          'PUT',
          formData,
        );
      }

      // Show success message
      setSuccess(response.message || 'Asset successfully saved');

      // Refresh the asset list
      onSuccess();

      // Close modal after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000000] bg-black bg-opacity-50 customBlur flex items-center justify-center p-2">
      <div className="bg-white dark:bg-bodydark1 rounded-lg shadow-xl w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isNewAsset ? 'Add New Asset' : 'Update Asset'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Details Section */}
          <div className="mb-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbol*
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  required
                  readOnly={!isNewAsset} // Symbol cannot be changed once created
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Network*
                </label>
                <input
                  type="text"
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Transaction Settings Section */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
              Transaction Settings
            </h4>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Deposit
                </label>
                <input
                  type="number"
                  name="minDeposit"
                  value={formData.minDeposit.toString()}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  step="0.0001"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Withdrawal
                </label>
                <input
                  type="number"
                  name="minWithdraw"
                  value={formData.minWithdraw.toString()}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  step="0.0001"
                  min="0"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Withdrawal Fee
                </label>
                <input
                  type="number"
                  name="withdrawalFee"
                  value={formData.withdrawalFee.toString()}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  step="0.0001"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conversion Fee
                </label>
                <input
                  type="number"
                  name="conversionFee"
                  value={formData.conversionFee.toString()}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                  step="0.0001"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Margin (%)
              </label>
              <input
                type="number"
                name="margin"
                value={formData.margin}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-bodydark2/50 text-gray-700 dark:text-white"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
              Status Settings
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deposit"
                  name="deposit"
                  checked={formData.deposit}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="deposit"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Allow Deposit
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="withdraw"
                  name="withdraw"
                  checked={formData.withdraw}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="withdraw"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Allow Withdraw
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transfer"
                  name="transfer"
                  checked={formData.transfer}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="transfer"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Allow Transfer
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {error && <Alert message={error} type="danger" />}
          {success && <Alert message={success} type="success" />}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={12} />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Save Coin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetManagementModal;
