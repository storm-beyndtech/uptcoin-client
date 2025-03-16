import { useState, useEffect } from 'react';
import Chart from '@/components/Chart';
import MarketLabel from '@/components/MarketLabel';
import MarketList from '@/components/MarketList';
import Navbar from '@/components/Navbar';
import OrderBook from '@/components/OrderBook';
import OrderHistory from '@/components/OrderHistory';
import TradePanel from '@/components/TradePanel';
import { useCrypto } from '@/context/CoinContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import MobileNav from '@/components/MobileNav';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  low: string;
  high: string;
  volume: string;
}

const Exchange: React.FC = () => {
  const { cryptoData } = useCrypto();
  const { symbol } = useParams();
  const [selectedMarket, setSelectedMarket] = useState<string>(
    (symbol as string) || 'BTC',
  );
  const [activeTab, setActiveTab] = useState<'trade' | 'chart'>('trade');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (symbol) setSelectedMarket(symbol as string);
  }, [symbol]);

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

  return (
    <>
      <SEO
        title="Uptcoin Exchange - Buy & Sell Crypto"
        description=""
        url="https://www.uptcoin.com/exchange"
      />
      <section className="w-full bg-bodydark1 pb-46 pt-20">
        <Navbar />
        <MobileNav />
        <div className="max-ctn !max-w-[1300px] text-white">
          {/* Mobile Tabs */}
          <div className="flex items-center justify-between p-4 pt-0 lg:hidden">
            <ArrowLeft onClick={handleGoBack} />
            <Link to="/market">{selectedMarket} / USDT</Link>
            <p>Spot</p>
          </div>

          {/* Actions */}
          <div className="w-full lg:hidden grid grid-cols-2 p-2 gap-2 text-sm fixed bottom-19 z-99999 bg-bodydark1/90 customBlur">
            <Link
              to="/dashboard/conversion"
              className="w-full bg-[#202020] py-2 rounded text-white col-span-2 text-center"
            >
              Convert
            </Link>

            <button className="w-full bg-green-600 py-2 rounded text-white col-span-1">
              Buy {selectedMarket}
            </button>

            <button className="w-full bg-red-600 py-2 rounded text-white col-span-1">
              Sell {selectedMarket}
            </button>

            <Link
              to="/dashboard/transfer"
              className="w-full bg-[#202020] py-2 rounded text-white col-span-2 text-center"
            >
              Transfer
            </Link>
          </div>
          <div className="lg:hidden grid grid-cols-2 p-3 w-full text-sm text-white/70">
            <button
              className={`px-4 py-1 rounded-l-sm col-span-1 ${
                activeTab === 'trade' ? 'bg-[#303131]' : 'bg-bodydark2'
              }`}
              onClick={() => setActiveTab('trade')}
            >
              Trade
            </button>
            <button
              className={`px-4 py-1 rounded-r-sm col-span-1 ${
                activeTab === 'chart' ? 'bg-[#303131]' : 'bg-bodydark2'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Chart
            </button>
          </div>
          <div className="w-full grid grid-cols-10 gap-4 py-5">
            {/* Market List */}
            <div className="col-span-2 max-lg:col-span-10 bg-bodydark2 p-3 rounded-sm max-lg:hidden">
              <MarketList
                markets={marketData}
                selectedMarket={selectedMarket}
                setSelectedMarket={setSelectedMarket}
              />
            </div>

            {/* Main Trading Section */}
            <div className="col-span-6 max-lg:col-span-10 flex flex-col gap-10 max-lg:hidden">
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
              <div className="flex max-lg:flex-wrap gap-4">
                <TradePanel market={selectedMarket} tradeType="buy" />
                <TradePanel market={selectedMarket} tradeType="sell" />
              </div>
            </div>

            {/* Mobile View: Toggle Between Trade & Chart */}
            <div className="lg:hidden col-span-10">
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
            </div>

            {activeTab === 'trade' ? (
              <div className="lg:hidden w-full flex gap-1 col-span-10 p-3">
                <div className="w-[65%] bg-bodydark2">
                  <div className="lg:hidden grid grid-cols-2 w-full text-sm text-white/70">
                    <button
                      className={`px-4 py-1 rounded-l-sm col-span-1 ${
                        tradeTab === 'buy' ? 'bg-green-600' : 'bg-bodydark2'
                      }`}
                      onClick={() => setTradeTab('buy')}
                    >
                      Buy
                    </button>
                    <button
                      className={`px-4 py-1 rounded-r-sm col-span-1 ${
                        tradeTab === 'sell' ? 'bg-red-600' : 'bg-bodydark2'
                      }`}
                      onClick={() => setTradeTab('sell')}
                    >
                      Sell
                    </button>
                  </div>

                  <div className="flex max-lg:flex-wrap gap-4">
                    {tradeTab === 'buy' ? (
                      <TradePanel market={selectedMarket} tradeType="buy" />
                    ) : (
                      <TradePanel market={selectedMarket} tradeType="sell" />
                    )}
                  </div>
                </div>

                <div className="w-[35%] bg-bodydark2 py-4 px-3 rounded-sm">
                  <OrderBook
                    marketData={marketData.find(
                      (market) => market.symbol === selectedMarket,
                    )}
                    version={'2'}
                  />
                </div>
              </div>
            ) : (
              <div className="lg:hidden col-span-10 grid gap-10 px-3 py-1">
                <Chart symbol={selectedMarket} />
                <OrderBook
                  marketData={marketData.find(
                    (market) => market.symbol === selectedMarket,
                  )}
                  version={'3'}
                />
              </div>
            )}

            {/* Order Book */}
            <div className="col-span-2 max-lg:hidden bg-bodydark2 p-4 rounded-sm">
              <OrderBook
                marketData={marketData.find(
                  (market) => market.symbol === selectedMarket,
                )}
              />
            </div>
          </div>
          {/* Order History */}
          <div className="w-full bg-bodydark1 p-2 rounded-sm">
            <OrderHistory />
          </div>
        </div>
      </section>
    </>
  );
};

export default Exchange;
