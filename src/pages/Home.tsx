import BannerSlides from '@/components/BannerSlides';
import Footer from '@/components/Footer';
import Guide from '@/components/Guide';
import Hero from '@/components/Hero';
import Join from '@/components/Join';
import Journey from '@/components/Journey';
import MarketList from '@/components/MarketList';
import MarketTable from '@/components/MarketTable';
import MobileLinks from '@/components/MobileLinks';
import MobileNav from '@/components/MobileNav';
import Navbar from '@/components/Navbar';
import { useCrypto } from '@/context/CoinContext';
import { useState } from 'react';
import { MarketData } from './Exchange';
import CryptoNews from '@/components/CryptoNews';
import HotPairs, { TradingPair } from '@/components/HotPairs';
import Staking from '@/components/Staking';

export default function Home() {
  const { cryptoData } = useCrypto();
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');

  const marketData: MarketData[] = cryptoData.map(
    ({ symbol, price, change, low, high, volume }) => ({
      symbol,
      price: Number(price),
      change: parseFloat(change),
      low,
      high,
      volume,
    }),
  );

  // Filter only hot pairs ["BNB", "SOL", "ATOM"]
  const hotList: TradingPair[] = cryptoData
    .filter((pair) => ['BNB', 'SOL', 'ATOM'].includes(pair.symbol))
    .map(({ symbol, price, change }) => ({
      symbol,
      price,
      change: parseFloat(change),
    }));

  return (
    <div className="relative pt-20 max-lg:bg-bodydark1">
      <Navbar />
      <div className="max-lg:hidden">
        <Hero />
        <BannerSlides />
        <MarketTable />
        <Journey />
        <Guide />
        <Join />
        <Footer />
      </div>

      <div className="lg:hidden space-y-5 pb-20">
        <MobileLinks />
        <Staking />
        <HotPairs hotList={hotList} />
        <BannerSlides />
        <MarketList
          markets={marketData.slice(0, 5)}
          selectedMarket={selectedMarket}
          setSelectedMarket={setSelectedMarket}
        />
        <CryptoNews />
        <MobileNav />
      </div>
    </div>
  );
}
