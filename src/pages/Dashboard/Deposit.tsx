import DepositComp from '@/components/DepositComp';
import MobileNav from '@/components/MobileNav';
import { contextData } from '@/context/AuthContext';
import { useCrypto } from '@/context/CoinContext';
import { Asset } from '@/lib/utils';

export default function Deposit() {
  const { cryptoData } = useCrypto();
  const { user } = contextData();

  //user Assets
  const assets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find((coin) => coin.symbol === asset.symbol);
    return { ...asset, price: coinInfo ? Number(coinInfo.price) : 0, ...coinInfo };
  });


  return (
    <div className=''>
      <DepositComp coins={assets} />

      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
