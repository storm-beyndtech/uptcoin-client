import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useCrypto } from '@/context/CoinContext';
import { formatChange, formatNumber, formatTradePrice } from '@/lib/utils';

const MarketTable: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { cryptoData } = useCrypto();
  const [searchQuery, setSearchQuery] = useState<string>(''); // Track search query

  const tableTitles = [
    'Market',
    'Price',
    '24h Change',
    'Low',
    'High',
    'Volume',
    'Action',
  ];

  // Filter crypto data based on search query
  const filteredData = Object.values(cryptoData).filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="w-full px-5 my-10">
      <div className="max-w-5xl mx-auto bg-white rounded-lg font-inter">
        <h3
          className={`${
            pathname === '/' ? 'hidden' : ''
          } text-2xl font-semibold text-gray-600 text-center`}
        >
          Our Trusted Markets
        </h3>

        {/* Search input */}
        <div
          className={`${
            pathname === '/' ? 'hidden' : ''
          } relative max-w-70 py-5 mx-auto`}
        >
          <FiSearch className="absolute top-[50%] translate-y-[-50%] left-3 text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Search by symbol or name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg pl-10"
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              {tableTitles.map((title, i) => (
                <th className="p-3" key={i}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(pathname === '/market'
              ? filteredData
              : filteredData.slice(0, 6)
            ).map((coin, i) => (
              <tr
                key={coin.id}
                className={`font-bold text-xs border-b ${
                  i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="p-3 py-5 flex items-center space-x-2.5">
                  <img
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                    alt={coin.name}
                    width="24"
                    onError={(e) =>
                      (e.currentTarget.src =
                        'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/generic.png')
                    }
                  />{' '}
                  <span>{`${coin.symbol}/ USDT`}</span>
                </td>
                <td
                  className={`p-3 py-4 ${
                    coin.change < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  ${formatTradePrice(coin.price)}
                </td>
                <td
                  className={`p-3 py-4 ${
                    coin.change < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {formatChange(coin.change)}
                </td>
                <td className="p-3 py-4">${formatTradePrice(coin.low)}</td>
                <td className="p-3 py-4">${formatTradePrice(coin.high)}</td>
                <td className="p-3 py-4">{formatNumber(coin.volume)}</td>
                <td className="p-3 py-4">
                  <Link to={`/margin/${coin.symbol}`}>
                    <button className="py-2 px-4 bg-red-500 text-white rounded-md">
                      Trade
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/market"
        className={`${
          pathname === '/market' ? 'hidden' : 'block'
        } w-fit mx-auto text-center text-xs font-bold text-blue-600 mt-10`}
      >
        Show all markets
      </Link>
    </section>
  );
};

export default MarketTable;
