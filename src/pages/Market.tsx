import Footer from '@/components/Footer';
import MarketList from '@/components/MarketList';
import MarketTable from '@/components/MarketTable';
import MobileNav from '@/components/MobileNav';
import Navbar from '@/components/Navbar';
import { useCrypto } from '@/context/CoinContext';
import { useState } from 'react';
import { MarketData } from './Exchange';
import SEO from '@/components/SEO';

export default function Market() {
  const { cryptoData } = useCrypto();
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');

  const marketData: MarketData[] = Object.values(cryptoData).map(
    ({ symbol, price, change, low, high, volume }) => ({
      symbol,
      price,
      change,
      low,
      high,
      volume,
    }),
  );

  return (
    <>
      <SEO
        title="Crypto Market Prices - Live Updates"
        description=""
        url="https://www.uptcoin.com/market"
      />
      <div className="py-20 max-lg:pb-30 max-lg:bg-bodydark1 max-lg:min-h-screen">
        <Navbar />
        <MobileNav />

        <div className="w-full grid grid-cols-10 gap-4 lg:hidden">
          {/* Market List */}
          <div className="col-span-2 max-lg:col-span-10 bg-[#1a1b1c] rounded-sm">
            <MarketList
              markets={marketData.filter((coin) => coin.symbol !== "USDT")}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
            />
          </div>
        </div>

        <div className="max-lg:hidden">
          <div className="max-ctn grid place-content-center py-6">
            <h1 className="text-7xl font-bold">Trusted Markets</h1>
          </div>
          <MarketTable />
          <Footer />
        </div>
      </div>
    </>
  );
}
