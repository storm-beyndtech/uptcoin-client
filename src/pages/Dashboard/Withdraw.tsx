import AddAddressModal from '@/components/AddAddressModal';
import { Address } from '@/components/ManageAddress';
import MobileNav from '@/components/MobileNav';
import WithdrawForm from '@/components/WithdrawForm';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { sendRequest } from '@/lib/sendRequest';
import { Asset, symbols } from '@/lib/utils';
import { useState } from 'react';

export default function Withdraw() {
  const { cryptoData } = useCrypto();
  const { user, refreshUser } = contextData();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //user Assets
  const userAssets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 0 };
  });
  const [editing, setEditing] = useState(false);
  const [addressModalOpen, setIsAddressModalOpen] = useState(false);

  // Get user addresses with usefull fields
  const addresses: Address[] = userAssets.map(
    ({ funding, spot, ...rest }: { funding: number; spot: number }) => ({
      ...rest,
    }),
  );

  // get user assets with some extra fields for withdrawals
  const withdrawAssets = userAssets.map((ass: Asset) => {
    const foundSym = symbols.find((symbol) => ass.symbol === symbol.symbol)!;

    return {
      ...ass,
      minWithdraw: foundSym.minWithdraw,
      withdraw: foundSym.withdraw,
      withdrawalFee: foundSym.withdrawalFee,
    };
  });


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
        setIsAddressModalOpen(false);
        setEditing(false);
        setError(null);
        setSuccess(null);
        refreshUser()
      }, 3000)
    }
  };


  return (
    <div className="max-lg:min-h-screen max-lg:bg-bodydark1 py-20 sm:py-5 px-2">
      {addressModalOpen && (
        <AddAddressModal
          addresses={addresses}
          address={addresses[0]}
          onAdd={handleAddOrUpdate}
          setIsModalOpen={setIsAddressModalOpen}
          editing={editing}
          setEditing={setEditing}
          error={error}
          success={success}
          loading={loading}
        />
      )}
      <WithdrawForm
        withdrawAssets={withdrawAssets}
        setIsAddressModalOpen={setIsAddressModalOpen}
      />

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
