import AddAssetModal from '@/components/AddAssetModal';
import AssetList from '@/components/AssetList';
import { useCrypto } from '@/context/CoinContext';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userAssets = [
    { symbol: 'BTC', funding: 0.2, spot: 0.19698 },
    { symbol: 'ETH', funding: 0.5, spot: 1.7 },
    { symbol: 'LTC', funding: 3, spot: 0.5 },
    { symbol: 'USDT', funding: 4000, spot: 0 },
  ];

  // Get user's coins with USD equivalent
  const parsedAssets = userAssets.map((asset) => {
    const coinInfo = cryptoData.find((coin) => coin.symbol === asset.symbol);

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
    (acc, asset) => acc + (asset.funding + asset.spot) * asset.price,
    0,
  );

  // Get available coins (excluding ones in wallet)
  const availableCoins = cryptoData.filter(
    (coin) => !userAssets.some((wallet) => wallet.symbol === coin.symbol),
  );

  //handle adding new asset
  const handleAddAsset = (coin: string) => {
    const newAsset = availableCoins.find((c) => c.symbol === coin);
    if (newAsset) {
    }
  };

  return (
    <div className="pr-4 space-y-4">
      <h2 className="py-5 text-4xl font-medium">Wallet</h2>
      <TotalConversion total={totalConversion} />
      <AssetList assets={parsedAssets} setIsModalOpen={setIsModalOpen} />

      {isModalOpen && (
        <AddAssetModal
          setIsModalOpen={setIsModalOpen}
          coins={availableCoins}
          onAdd={handleAddAsset}
        />
      )}
    </div>
  );
}
