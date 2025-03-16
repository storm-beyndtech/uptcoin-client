import AddAddressModal from '@/components/AddAddressModal';
import { Address } from '@/components/ManageAddress';
import MobileNav from '@/components/MobileNav';
import WithdrawForm from '@/components/WithdrawForm';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset, symbols } from '@/lib/utils';
import { useState } from 'react';

export default function Withdraw() {
  const { cryptoData } = useCrypto();
  const { user } = contextData();

  //user Assets
  const userAssets = user.assets.map((asset: Asset) => {
    const coinInfo = cryptoData.find((coin) => coin.symbol === asset.symbol);
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 0 };
  });
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState<Address>(userAssets[0]);
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
      charges: foundSym.charges,
    };
  });

  const onAdd = (address: Address) => {
    setAddress(address);
    setIsAddressModalOpen(false);
  };

  return (
    <div className="max-lg:min-h-screen max-lg:bg-bodydark1 py-20 px-2">
      {addressModalOpen && (
        <AddAddressModal
          addresses={addresses}
          address={address}
          onAdd={onAdd}
          setIsModalOpen={setIsAddressModalOpen}
          editing={editing}
          setEditing={setEditing}
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
