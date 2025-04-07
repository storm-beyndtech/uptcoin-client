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
import { useEffect, useState } from 'react';
import { MarketData } from './Exchange';
import HotPairs, { TradingPair } from '@/components/HotPairs';
import SEO from '@/components/SEO';
import { Features } from '@/components/Features';
import CryptoCarousel from '@/components/cryptoCarousel/CryptoCarousel';
import Testimonials from '@/components/Testimonials';
import { HomeSec2, testimonies } from '@/lib/utils';
import CustomSec from '@/components/CustomSec';

export default function Home() {
  const { cryptoData } = useCrypto();
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      div[data-testid="widgetButtonFrame"] {
        bottom: 70px !important;
      }

      div[data-testid="widgetMessengerFrame"] {
        bottom: 70px !important;
        width: 90% !important;
        height: 80vh !important;
        max-width: 400px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const coinDataWithoutUsdt = Object.values(cryptoData).filter(
    (coin) => coin.symbol !== 'USDT',
  );

  const marketData: MarketData[] = coinDataWithoutUsdt.map(
    ({ symbol, price, change, low, high, volume }) => ({
      symbol,
      price,
      change,
      low,
      high,
      volume,
    }),
  );

  // Filter only hot pairs ["BNB", "SOL", "ATOM"]
  const hotList: TradingPair[] = Object.values(cryptoData)
    .filter((pair) => ['BNB', 'SOL', 'XRP'].includes(pair.symbol))
    .map(({ symbol, price, change }) => ({
      symbol,
      price,
      change,
    }));

  return (
    <>
      <SEO
        title="Uptcoin - The Future of Crypto Trading, Powered by Speed, Security, and Innovation🚀"
        description="Experience the future of trading with Uptcoin—the super-fast, ultra-secure, smart trading community. Seamlessly buy, sell, and exchange assets with lightning speed while enjoying top-tier security and a thriving network of expert traders."
        url="https://www.uptcoin.com"
      />

      <div className="relative pt-20 max-lg:bg-bodydark1">
        <Navbar />
        <div className="max-lg:hidden">
          <Hero />
          <BannerSlides />
          <MarketTable />
          <Features />
          <CryptoCarousel />
          <Journey />
          <CustomSec secData={HomeSec2} />
          <Guide />
          <Testimonials data={testimonies} />
          <Join />
          <Footer />
        </div>

        <div className="lg:hidden space-y-5 pb-20">
          <MobileLinks />
          <BannerSlides />
          <HotPairs hotList={hotList} />
          <MarketList
            markets={marketData.slice(0, 5)}
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
          />
          <Guide />
          <Features />
          <MobileNav />
        </div>
      </div>
    </>
  );
}
