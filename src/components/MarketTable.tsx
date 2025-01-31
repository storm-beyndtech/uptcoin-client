import { symbols } from '@/context/DataContext';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  low: string;
  high: string;
  volume: string;
  image: string;
}

const MarketTable: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Track search query

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid API response');
        }

        // Filter data to match symbols and adjust price
        const updatedData: CryptoData[] = symbols
          .map((item) => {
            const coin = data.find(
              (coin) => coin.symbol.toUpperCase() === item.symbol,
            );
            return coin
              ? {
                  id: coin.id,
                  name: coin.name,
                  symbol: coin.symbol.toUpperCase(),
                  price: (coin.current_price * (1 + item.margin / 100)).toFixed(
                    2,
                  ),
                  change: `${coin.price_change_percentage_24h.toFixed(2)}%`,
                  low: coin.low_24h.toFixed(2),
                  high: coin.high_24h.toFixed(2),
                  volume: coin.total_volume.toLocaleString(),
                  image: coin.image,
                }
              : null;
          })
          .filter(Boolean) as CryptoData[];

        setCryptoData(updatedData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
  }, []);

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
  const filteredData = cryptoData.filter(
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
                  <img src={coin.image} alt={coin.name} width="24" />{' '}
                  <span>{`${coin.symbol}/ USDT`}</span>
                </td>
                <td className="p-3 py-4">${coin.price}</td>
                <td className="p-3 py-4">{coin.change}</td>
                <td className="p-3 py-4">${coin.low}</td>
                <td className="p-3 py-4">${coin.high}</td>
                <td className="p-3 py-4">{coin.volume}</td>
                <td className="p-3 py-4">
                  <button className="py-2 px-4 bg-red-500 text-white rounded-md">
                    Trade
                  </button>
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
