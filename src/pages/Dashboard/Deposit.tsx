import DepositComp from '@/components/DepositComp';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/lib/utils';

export default function Deposit() {
  const { cryptoData, symbols } = useCrypto();
  const { user } = contextData();

  //user Assets
  const assets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );
    return {
      ...asset,
      price: coinInfo ? Number(coinInfo.price) : 0,
      ...coinInfo,
    };
  }).filter((asset: Asset)=> asset.symbol !== "USDT");

  //get usdt asset
  const usdtAsset = symbols.find((asset) => asset.symbol === 'USDT');

  return (
    <div>
      <DepositComp coins={[...assets, { ...usdtAsset, price: 1 }]} />

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
