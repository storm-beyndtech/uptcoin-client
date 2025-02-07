import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import OrderHistory from '@/components/OrderHistory';
import Chart from '@/components/Chart';
import MarginTrade from '@/components/MarginTrade';
import { useCrypto } from '@/context/CoinContext';
import { IoChevronDownSharp } from 'react-icons/io5';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  low: string;
  high: string;
  volume: string;
}

const QuickMargin: React.FC = () => {
  const { symbol } = useParams();
  const { cryptoData } = useCrypto();
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC');
  const [marginModal, setMarginModal] = useState<boolean>(false);

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

  useEffect(() => {
    if (symbol !== undefined) {
      setSelectedMarket(symbol);
    }
  }, [symbol]);

  console.log(marginModal);

  return (
    <section className="w-full bg-bodydark1 py-20 relative">
      <Navbar />
      <MobileNav />
      <div className="max-ctn !max-w-[1300px] text-white">
        <div className="w-full grid grid-cols-10 gap-4 py-5">
          {/* Market List */}
          <div className="col-span-2 max-lg:col-span-10 bg-bodydark2 p-4 rounded-sm">
            <MarketList
              markets={marketData}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              setMarginModal={setMarginModal}
            />
          </div>

          {/* Main Trading Section */}
          <div className="col-span-5 flex flex-col gap-10 max-lg:hidden">
            <MarketLabel
              market={
                marketData.find(
                  (market) => market.symbol === selectedMarket,
                ) || {
                  price: 0,
                  symbol: selectedMarket,
                  high: '---',
                  low: '---',
                  volume: '---',
                }
              }
            />
            <Chart symbol={selectedMarket} />
          </div>

          {/* Margin Trade - Desktop */}
          <div className="col-span-3 bg-bodydark2 p-4 rounded-sm max-lg:hidden">
            <MarginTrade selectedMarket={selectedMarket} />
          </div>
        </div>

        {/* Order History */}
        <div className="w-full bg-bodydark1 p-2 rounded-sm max-lg:hidden">
          <OrderHistory />
        </div>
      </div>

      {/* Margin Trade Modal - Mobile */}
      {marginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
          onClick={() => setMarginModal(false)}
        >
          <div
            className="w-full max-w-md bg-bodydark2 rounded-t-2xl p-5 pb-20 relative transform translate-y-full transition-all duration-300 ease-in-out max-lg:translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-2xl"
              onClick={() => setMarginModal(false)}
            >
              <IoChevronDownSharp />
            </button>
            <MarginTrade selectedMarket={selectedMarket} />
          </div>
        </div>
      )}
    </section>
  );
};

export default QuickMargin;
