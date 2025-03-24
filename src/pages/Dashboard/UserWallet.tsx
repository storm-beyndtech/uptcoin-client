import AddAssetModal from '@/components/AddAssetModal';
import AssetList from '@/components/AssetList';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/types/types';
import { useState } from 'react';

const TotalConversion = ({ total }: { total: number }) => {
  return (
    <div className="bg-white p-5 rounded-sm space-y-2 shadow-1">
      <h2 className="text-black/50 text-base">Total Conversion</h2>
      <p className="text-3xl font-medium text-green-600">
        {total.toFixed(2)} <span className="text-base">USDT</span>
      </p>
    </div>
  );
};

export default function UserWallet() {
  const { cryptoData } = useCrypto();
  const { user } = contextData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user's coins with USD equivalent
  const parsedAssets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find((coin) => coin.symbol === asset.symbol);

    if (!coinInfo) return { ...asset, equivalent: 0, image: '', price: 0 };
    return {
      ...asset,
      image: coinInfo.image,
      equivalent: (asset.funding + asset.spot) * Number(coinInfo.price),
      price: Number(coinInfo.price),
    };
  });

  //handle total conversion
  const totalConversion = parsedAssets.reduce(
    (acc: number, asset: any) =>
      acc + (asset.funding + asset.spot) * asset.price,
    0,
  );

  // Get available coins (excluding ones in wallet)
  const availableCoins = Object.values(cryptoData).filter(
    (coin) =>
      !user.assets.some((wallet: Asset) => wallet.symbol === coin.symbol),
  );

  //handle adding new asset
  const handleAddAsset = (coin: string) => {
    const newAsset = availableCoins.find((c) => c.symbol === coin);
    if (newAsset) {
    }
  };

  return (
    <>
      <div className="pr-4 space-y-4 max-lg:hidden">
        <h2 className="py-5 text-4xl font-medium">Wallet</h2>
        <TotalConversion total={totalConversion} />
        <AssetList assets={parsedAssets} setIsModalOpen={setIsModalOpen} />
      </div>

      {isModalOpen && (
        <AddAssetModal
          setIsModalOpen={setIsModalOpen}
          coins={availableCoins}
          onAdd={handleAddAsset}
        />
      )}

      <div className="lg:hidden">
        <AssetList assets={parsedAssets} setIsModalOpen={setIsModalOpen} />
        <MobileNav />
      </div>
    </>
  );
}
