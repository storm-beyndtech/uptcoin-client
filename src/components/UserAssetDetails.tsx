import { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Clock,
  ExternalLink,
  ArrowUpDown,
  Coins,
} from 'lucide-react';
import { Asset, formatNumber } from '@/lib/utils';
import { useCrypto } from '@/context/CoinContext';
import { contextData } from '@/context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { sendRequest } from '@/lib/sendRequest';
import NavigateBack from './UI/NavigateBack';

type Trade = {
  _id: string;
  symbol: string;
  action: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  limitPrice?: number;
  marketPrice?: number;
  quantity: number;
  amount: number;
  createdAt: string;
  status: 'pending' | 'executed' | 'canceled' | 'rejected';
};

interface CustomAsset extends Asset {
  equivalent: number;
  price: number;
  image: string;
  volume: number;
}

const UserAssetDetails = () => {
  const { cryptoData } = useCrypto();
  const { user } = contextData();
  const { symbol } = useParams();

  // Get user's coins with USD equivalent
  const parsedAssets = user.assets.map((asset: Asset) => {
    const coinInfo = Object.values(cryptoData).find(
      (coin) => coin.symbol === asset.symbol,
    );

    if (!coinInfo)
      return { ...asset, equivalent: 0, image: '', price: 0, volume: 0 };

    return {
      ...asset,
      image: coinInfo.image,
      price: Number(coinInfo.price),
      volume: Number(coinInfo.volume),
      equivalent: (asset.funding + asset.spot) * Number(coinInfo.price),
    };
  });

  const currentAsset = parsedAssets.find(
    (asset: CustomAsset) => asset.symbol === symbol,
  );

  const [selectedAsset, setSelectedAsset] = useState<CustomAsset>(
    currentAsset ? currentAsset : parsedAssets[0],
  );
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadTrades();
    setSelectedAsset(currentAsset ? currentAsset : parsedAssets[0]);
  }, [symbol, user]);

  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const trades = await sendRequest(
        `/transaction/trades/${user._id}`,
        'GET',
      );
      setTrades(trades.filter((trade: Trade) => trade.symbol === symbol));
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedAsset) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-100">
      <div className="p-4 text-2xl lg:hidden">
        <NavigateBack />
      </div>

      {/* Asset Header */}
      <div className="px-4 py-6 bg-bodydark2">
        <div className="flex items-center gap-3 mb-4">
          <img src={selectedAsset.image} className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">{selectedAsset.name}</h1>
            <p className="text-gray-400">{selectedAsset.symbol}</p>
          </div>
        </div>
        <div className="mb-2">
          <p className="text-3xl font-bold">
            ${selectedAsset.equivalent.toFixed(2)}
          </p>
          <p className="text-gray-400">
            {(selectedAsset.spot + selectedAsset.funding).toFixed(
              symbol === 'USDT' ? 2 : 6,
            )}{' '}
            {selectedAsset.symbol}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'details'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'trades'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('trades')}
        >
          Trades
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'details' ? (
          <div className="p-4">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bodydark2 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Spot Balance</p>
                <p className="font-bold">
                  {selectedAsset.spot.toFixed(symbol === 'USDT' ? 2 : 6)}{' '}
                  {selectedAsset.symbol}
                </p>
              </div>
              <div className="bg-bodydark2 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Funding Balance</p>
                <p className="font-bold">
                  {selectedAsset.funding.toFixed(symbol === 'USDT' ? 2 : 6)}{' '}
                  {selectedAsset.symbol}
                </p>
              </div>
            </div>

            {/* Trading Volume */}
            <div className="bg-bodydark2 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-gray-400" />
                <p className="text-gray-400">Trading Volume</p>
              </div>
              <p className="font-bold">
                {formatNumber(selectedAsset.volume)} {selectedAsset.symbol}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-bodydark2 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">
                About {selectedAsset.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedAsset.name} ({selectedAsset.symbol}) is a digital asset
                that can be traded on the platform. Check the latest market data
                and make informed trading decisions.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <ExternalLink size={16} className="text-green-400" />
                <Link
                  to={`/market/${selectedAsset.symbol}`}
                  className="text-green-400 text-sm"
                >
                  View in Market
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Recent Trades</h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
            ) : trades.length === 0 ? (
              <p className="text-center py-8 text-gray-400">
                No recent trades found
              </p>
            ) : (
              <div className="space-y-3">
                {trades.map((trade) => (
                  <div key={trade._id} className="bg-bodydark2 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {trade.action === 'buy' ? (
                          <ArrowDownLeft size={16} className="text-green-500" />
                        ) : (
                          <ArrowUpRight size={16} className="text-red-500" />
                        )}
                        <span
                          className={
                            trade.action === 'buy'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {trade.action.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock size={14} />
                        <span>
                          {new Date(trade.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p>
                          ${' '}
                          {trade.orderType === 'limit' && trade.limitPrice
                            ? trade.limitPrice.toFixed(2)
                            : trade.marketPrice && trade.marketPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p>
                          {trade.amount} {selectedAsset.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total</p>
                        <p>${trade.quantity.toFixed(6)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex items-center flex-wrap gap-3 bg-bodydark2">
        <div className="flex gap-4">
          <Link
            to={`/dashboard/conversion/${symbol}`}
            className="flex flex-col items-center text-white"
          >
            <div className="flex items-center justify-center">
              <Coins size={14} className="text-green-300" strokeWidth={1} />
            </div>
            <p className="text-[10px] mt-2">Convert</p>
          </Link>

          <Link
            to={`/dashboard/transfer/${symbol}`}
            className="flex flex-col items-center text-white"
          >
            <div className="flex items-center justify-center">
              <ArrowUpDown
                size={14}
                className="text-green-300"
                strokeWidth={1}
              />
            </div>
            <p className="text-[10px] mt-2">Transfer</p>
          </Link>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/dashboard/deposit/${symbol}`}
            className="bg-green-500/5 text-white text-sm py-2 px-4 rounded-lg border border-green-500/50 font-medium flex items-center justify-center gap-2"
          >
            <ArrowDownLeft size={18} />
            Deposit
          </Link>
          <Link
            to={`/dashboard/withdraw/${symbol}`}
            className="bg-red-500/5 text-white text-sm py-2 px-4 rounded-lg border border-red-500/50 font-medium flex items-center justify-center gap-2"
          >
            <ArrowUpRight size={18} />
            Withdraw
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserAssetDetails;
