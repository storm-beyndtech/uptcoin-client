import DepositComp from '@/components/DepositComp';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/lib/utils';

export default function Deposit() {
  const { cryptoData, symbols } = useCrypto();
  const { user } = contextData();

  //user Assets
  const assets = symbols
    .filter((symbolAsset) => {
      return user.assets.some(
        (userAsset: Asset) =>
          userAsset.symbol === symbolAsset.symbol &&
          symbolAsset.symbol !== 'USDT',
      );
    })
    .map((symbolAsset) => {
      const userAsset = user.assets.find(
        (a: Asset) => a.symbol === symbolAsset.symbol,
      );
      const coinInfo = Object.values(cryptoData).find(
        (coin) => coin.symbol === symbolAsset.symbol,
      );

      return {
        ...userAsset, // user's quantity or balance
        ...symbolAsset, // from symbols
        price: coinInfo ? Number(coinInfo.price) : 0,
      };
    });

  console.log(user.assets);

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
