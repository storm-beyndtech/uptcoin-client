import { useState } from 'react';
import AddAddressModal from '@/components/AddAddressModal';
import ManageAddress, { Address } from '@/components/ManageAddress';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { sendRequest } from '@/lib/sendRequest';
import { Asset } from '@/lib/utils';

export default function WalletAddress() {
  const { cryptoData } = useCrypto();
  const { user, refreshUser } = contextData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // User Assets with price and address info
  const userAssets: Address[] = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );
    return {
      ...asset,
      price: coinInfo ? Number(coinInfo.price) : 0,
    };
  });

  // Format addresses for display
  const addresses = userAssets.map(
    ({ address, symbol, _id, network, name }) => ({
      address,
      symbol,
      name,
      network,
      _id,
    }),
  );

  // Handle adding/updating an address
  const handleAddOrUpdate = async (addressData: {
    address: string;
    symbol: string;
  }) => {
    if (!addressData.address)
      return setError('Withdrawal address is required.');
    if (addressData.address.length < 10)
      return setError('Enter a valid address.');

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { message } = await sendRequest(`/auth/update-asset-address`, 'PUT', {
        symbol: addressData.symbol,
        address: addressData.address,
        userId: user._id
      });

      setSuccess(message);
    } catch (error: any) {
      setError(error.message || 'Failed to update address.');
    } finally {
      setLoading(false);

      setTimeout(() => {
        setIsModalOpen(false);
        setEditing(false);
        setError(null);
        setSuccess(null);
        refreshUser()
      }, 3000)
    }
  };

  // Handle editing an address
  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
    setEditing(true);
  };

  return (
    <div className="max-lg:min-h-screen max-lg:bg-bodydark1 py-10 px-2">
      <ManageAddress
        addresses={addresses}
        setIsModalOpen={setIsModalOpen}
        onEdit={handleEdit}
      />

      {isModalOpen && (
        <AddAddressModal
          addresses={addresses}
          address={selectedAddress || addresses[0]}
          onAdd={handleAddOrUpdate}
          setIsModalOpen={setIsModalOpen}
          editing={editing}
          setEditing={setEditing}
          error={error}
          success={success}
          loading={loading ? 'Loading...' : null}
        />
      )}

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
