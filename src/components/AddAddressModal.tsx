import React, { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { Address } from './ManageAddress';

interface AddAddressModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onAdd: (address: Address) => void;
  addresses: Address[];
  address: Address;
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onAdd,
  addresses,
  address,
  setIsModalOpen,
  editing,
  setEditing,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<any>(
    editing ? address : addresses[0],
  );
  const [newAddress, setNewAddress] = useState<string>(
    editing ? address.address : '',
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = addresses.find(
      (address) => address.symbol === e.target.value,
    );
    if (selected) {
      setSelectedAddress(selected);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur px-2">
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
              value={address.name + `(${address.symbol})`}
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
              value={selectedAddress.symbol}
              onChange={handleAddressChange}
            >
              <option disabled>Choose A Currency</option>
              {addresses.map((address, i) => (
                <option key={i} value={address.symbol}>
                  {address.name} ({address.symbol})
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
          value={selectedAddress.network}
          className="input mb-4"
          placeholder="Fixed Withdrawal Network"
          disabled
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
          placeholder="Set Withdrawal Address"
        />

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
            onClick={() => {
              if (selectedAddress) {
                onAdd({
                  ...selectedAddress,
                  address,
                });
              }
            }}
          >
            {editing ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
