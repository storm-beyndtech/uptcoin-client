import AddAssetModal from '@/components/AddAssetModal';
import AssetList from '@/components/AssetList';
import BalanceCard from '@/components/BalanceCard';
import MobileNav from '@/components/MobileNav';
import {
  AccountBalance,
  AssetTransactions,
  PressRelease,
  UserProfile,
} from '@/components/OverviewComps';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/lib/utils';
import { useState } from 'react';

interface CustomAsset extends Asset {
  equivalent: number;
  price: number;
}

export default function UserOverview() {
  const { cryptoData } = useCrypto();
  const { user } = contextData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user's coins with USD equivalent
  const parsedAssets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );

    if (!coinInfo) return { ...asset, equivalent: 0, image: '', price: 0 };

    return {
      ...asset,
      image: coinInfo.image,
      price: Number(coinInfo.price),
      equivalent: (asset.funding + asset.spot) * Number(coinInfo.price),
    };
  });

  // Calculate total balance
  const totalBalance = parsedAssets.reduce(
    (acc: number, asset: CustomAsset) => acc + asset.equivalent,
    0,
  );

  // Get available coins (excluding ones in wallet)
  const availableCoins = Object.values(cryptoData).filter(
    (coin) =>
      !user.assets.some((wallet: Asset) => wallet.symbol === coin.symbol),
  );

  // Handle adding new asset
  const handleAddAsset = (coin: string) => {
    const newAsset = availableCoins.find((c) => c.symbol === coin);
    if (newAsset) {
    }
  };

  return (
    <>
      <div className="grid gap-5 pr-5 max-lg:hidden">
        <UserProfile
          email={user.email}
          verified={false}
          uid="7154949378"
          tradingStatus={user.tradingStatus}
          tradingLevel={user.tradingLevel}
          tradingLimit={user.tradingLimit}
        />

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <AccountBalance totalBalance={totalBalance}/>
          </div>
          <div className="col-span-1">
            <PressRelease />
          </div>
        </div>

        <div className="grid mt-10">
          <h3 className="font-semibold">Assets Transaction</h3>
          <AssetTransactions />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="px-2 py-7">
          <BalanceCard totalBalance={totalBalance} />
        </div>

        <AssetList assets={parsedAssets} setIsModalOpen={setIsModalOpen} />

        {isModalOpen && (
          <AddAssetModal
            setIsModalOpen={setIsModalOpen}
            coins={availableCoins}
            onAdd={handleAddAsset}
          />
        )}

        <MobileNav />
      </div>
    </>
  );
}
