import AddAddressModal from '@/components/AddAddressModal';
import ManageAddress, { Address } from '@/components/ManageAddress';
import { userAssets } from '@/lib/utils';
import { useState } from 'react';

export default function WalletAddress() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState<Address>(userAssets[0]);


  // Get user addresses with usefull fields
  const addresses: Address[] = userAssets.map(({ funding, spot, ...rest }) => ({
    ...rest,
  }));

  // add new address
  const onAdd = (address: Address) => {
    console.log(address)
  };

  // edit single address
  const onEdit = (address: Address) => {
    setAddress(address);
    setIsModalOpen(true);
    setEditing(true);
  };

  // delete single address
  const onDelete = (id: string) => {
    console.log(id)
  };

  return (
    <div>
      <ManageAddress
        onDelete={onDelete}
        addresses={addresses}
        setIsModalOpen={setIsModalOpen}
        onEdit={onEdit}
      />

      {isModalOpen && (
        <AddAddressModal
          addresses={addresses}
          address={address}
          onAdd={onAdd}
          setIsModalOpen={setIsModalOpen}
          editing={editing}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}
