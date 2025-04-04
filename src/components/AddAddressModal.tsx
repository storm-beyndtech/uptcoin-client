import React, { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { Address } from './ManageAddress';
import Alert from './UI/Alert';

interface AddAddressModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (addressData: { symbol: string; address: string, network: string }) => void;
  addresses: Address[];
  address: Address;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  success: string | null;
  loading: boolean;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onAdd,
  addresses,
  address,
  setIsModalOpen,
  editing,
  setEditing,
  error,
  success,
  loading,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    editing ? address : addresses[0],
  );

  const [newAddress, setNewAddress] = useState<string>(
    editing ? address.address : '',
  );

  const [newNetwork, setNewNetwork] = useState<string>(
    editing ? address.network : '',
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = addresses.find((addr) => addr.symbol === e.target.value);
    if (selected) setSelectedAddress(selected);
  };

  const handleSubmit = () => {
    onAdd({
      symbol: selectedAddress.symbol,
      network: newNetwork,
      address: newAddress,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black bg-opacity-50 customBlur px-2">
      <div className="bg-white max-lg:bg-bodydark2 p-6 max-lg:px-4 rounded-lg w-96">
        <div className="relative mb-4 max-lg:text-white/90">
          <h2 className="text-lg font-semibold">
            {editing ? 'Update' : 'Add'} Address
          </h2>
          <CgClose
            className="absolute right-2 top-[50%] translate-y-[-50%] text-xl cursor-pointer"
            onClick={() => {
              setIsModalOpen(false);
              setEditing(false);
            }}
          />
        </div>

        {/* Select Coin */}
        {editing ? (
          <>
            <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
              Currency
            </label>
            <input
              type="text"
              value={`${address.name} (${address.symbol})`}
              className="input mb-4"
              disabled
            />
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
              Select Currency
            </label>
            <select
              className="input mb-4"
              value={selectedAddress?.symbol || ''}
              onChange={handleAddressChange}
            >
              <option disabled>Choose A Currency</option>
              {addresses.map((addr, i) => (
                <option key={i} value={addr.symbol}>
                  {addr.name} ({addr.symbol})
                </option>
              ))}
            </select>
          </>
        )}

        {/* Coin Network */}
        <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
          Withdrawal Network
        </label>
        <input
          type="text"
          value={newNetwork}
          onChange={(e) => setNewNetwork(e.target.value)}
          className="input mb-4"
          placeholder="Fixed Withdrawal Network"
        />

        {/* Coin Address */}
        <label className="block mb-2 text-sm font-medium max-lg:text-white/30">
          Withdrawal Address
        </label>
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="input mb-4"
          placeholder="Enter Withdrawal Address"
        />

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <button
            className="px-5 py-1.5 bg-bodydark1 text-white rounded-sm"
            onClick={() => {
              setIsModalOpen(false);
              setEditing(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            onClick={handleSubmit}
          >
            {editing && !loading
              ? 'Update Address'
              : !editing && !loading
                ? 'Add Address'
                : 'Submitting'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
