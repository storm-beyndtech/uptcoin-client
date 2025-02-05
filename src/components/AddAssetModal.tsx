import React, { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';

interface AddAssetModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (coin: string) => void;
  coins: { name: string; symbol: string }[];
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  onAdd,
  coins,
  setIsModalOpen,
}) => {
  const [selectedCoin, setSelectedCoin] = useState<string>('');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <div className="relative mb-4">
          <h2 className="text-lg font-semibold">Add Asset</h2>
          <CgClose
            className="absolute right-2 top-[50%] translate-y-[-50%] text-xl cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        {/* Select Coin */}
        <label className="block mb-2 text-sm font-medium">Select Coin</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          <option value="">Choose a coin</option>
          {coins.map((coin) => (
            <option key={coin.symbol} value={coin.symbol}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <button
            className="px-5 py-1 bg-gray-600 text-white rounded-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1 bg-green-600 text-white rounded-sm"
            onClick={() => {
              if (selectedCoin) {
                onAdd(selectedCoin);
              }
            }}
          >
            Add asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
