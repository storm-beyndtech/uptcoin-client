import React, { Dispatch, SetStateAction } from 'react';
import { Trash2, Pencil, PlusCircle } from 'lucide-react';
import { Asset } from '@/lib/utils';

export type Address = Omit<Asset, 'funding' | 'spot'>;

interface ManageAddressProps {
  addresses: Address[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (id: string) => void;
  onEdit: (address: Address) => void;
}

const ManageAddress: React.FC<ManageAddressProps> = ({
  addresses,
  setIsModalOpen,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="p-4 bg-white max-lg:bg-bodydark2 max-lg:text-white/80 max-lg:text-sm rounded">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-xl max-lg:text-base font-semibold max-lg:font-medium">
          Manage Address
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gray-800 max-lg:bg-black text-white px-3 py-1 rounded-sm hover:opacity-80 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Address
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 max-lg:bg-bodydark1 text-left">
              <th className="p-2">Currency</th>
              <th className="p-2">Address</th>
              <th className="p-2">Network</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map(({ _id, symbol, address, network, name }) => (
              <tr
                key={_id}
                className="border-t max-lg:border-white/10 max-lg:text-white/60"
              >
                <td className="p-3">{symbol}</td>
                <td className="p-3 truncate max-w-xs">{address}</td>
                <td className="p-3">{network}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="p-2 text-blue-500 hover:text-blue-700"
                    onClick={() =>
                      onEdit({ _id, symbol, address, network, name })
                    }
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(_id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAddress;
