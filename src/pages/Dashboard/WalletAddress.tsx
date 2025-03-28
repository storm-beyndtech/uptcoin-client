import AddAddressModal from '@/components/AddAddressModal';
import ManageAddress, { Address } from '@/components/ManageAddress';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/lib/utils';
import { useState } from 'react';

export default function WalletAddress() {
  const { cryptoData } = useCrypto();
  const { user } = contextData();

  //user Assets
  const userAssets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find((coin) => coin.symbol === asset.symbol);
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 0 };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState<Address>(userAssets[0]);

  // Get user addresses with usefull fields
  const addresses: Address[] = userAssets.map(
    ({ funding, spot, ...rest }: { funding: number; spot: number }) => ({
      ...rest,
    }),
  );

  // add new address
  const onAdd = (address: Address) => {
    console.log(address);
  };

  // edit single address
  const onEdit = (address: Address) => {
    setAddress(address);
    setIsModalOpen(true);
    setEditing(true);
  };

  // delete single address
  const onDelete = (id: string) => {
    console.log(id);
  };

  return (
    <div className="max-lg:min-h-screen max-lg:bg-bodydark1 py-10 px-2">
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

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
