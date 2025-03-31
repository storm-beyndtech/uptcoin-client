import React, { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Alert from './UI/Alert';

interface AddAssetModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (coin: string) => void;
  coins: { name: string; symbol: string }[];
  error: string;
  success: string;
  isSubmitting: boolean;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  onAdd,
  coins,
  setIsModalOpen,
  error,
  success,
  isSubmitting,
}) => {
  const [selectedCoin, setSelectedCoin] = useState<string>('');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur px-4">
      <div className="bg-white max-lg:bg-bodydark2 p-6 max-lg:px-4 rounded-lg w-96">
        <div className="relative mb-4">
          <h2 className="text-lg font-semibold max-lg:text-white/90">
            Add Asset
          </h2>
          <CgClose
            className="absolute right-2 top-[50%] translate-y-[-50%] text-xl cursor-pointer max-lg:text-white/90"
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        {/* Select Coin */}
        <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
          Select Coin
        </label>
        <select
          className="input mb-4 px-2"
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          <option value="" className="max-lg:text-bodydark2">
            Choose a coin
          </option>
          {coins.map((coin) => (
            <option
              key={coin.symbol}
              value={coin.symbol}
              className="max-lg:text-bodydark2"
            >
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <button
            className="px-5 py-1.5 bg-bodydark1 text-white rounded-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            disabled={isSubmitting}
            onClick={() => {
              if (selectedCoin) {
                onAdd(selectedCoin);
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Add asset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
