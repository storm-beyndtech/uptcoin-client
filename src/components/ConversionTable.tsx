import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';

// Interface matching the ConversionSchema from your server
interface Conversion {
  _id: string;
  userId: string;
  fee: number;
  from: {
    symbol: string;
    amount: number;
    price: number;
  };
  to: {
    symbol: string;
    amount: number;
    price: number;
  };
  createdAt: string; // ISO date string
}

export default function ConversionTable({
  setShowHistory,
}: {
  setShowHistory: any;
}) {
  const { user } = contextData();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch conversions data from the server
  useEffect(() => {
    const fetchConversions = async () => {
      setLoading(true);
      try {
        const data = await sendRequest(
          `/transaction/convert/${user?._id}`,
          'GET',
        );

        console.log(data)
        setConversions(data || []);
      } catch (error: any) {
        console.error('Error fetching conversions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchConversions();
    }
  }, [user?._id]);

  // Filter conversions based on search input (checking both from and to symbols)
  const filteredConversions = conversions.filter(
    (conversion) =>
      conversion.from.symbol.toLowerCase().includes(search.toLowerCase()) ||
      conversion.to.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  // Format amount based on currency type
  const formatAmount = (amount: number, symbol: string) => {
    // Format USDT to 2 decimal places, others to 6
    const decimals = symbol.toUpperCase() === 'USDT' ? 2 : 6;
    return amount.toFixed(decimals);
  };

  return (
    <div className="p-4 text-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium text-gray-500 max-lg:text-gray-300">
          Currency Conversions
        </h2>

        <button
          className="font-semibold text-green-500 max-lg:text-green-300"
          onClick={() => setShowHistory(false)}
        >
          Back
        </button>
      </div>

      {/* Search input */}
      <div className="relative max-w-70 mb-4">
        <FiSearch className="absolute top-[50%] translate-y-[-50%] left-3 text-xl text-gray-400" />
        <input
          type="text"
          placeholder="Search by currency"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 max-lg:text-gray-300 text-center py-4">
            Loading conversions...
          </p>
        ) : filteredConversions.length === 0 ? (
          <p className="text-gray-500 max-lg:text-gray-300 text-center py-4">
            No conversions found.
          </p>
        ) : (
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 max-lg:bg-bodydark2">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 max-lg:divide-gray-700">
              {filteredConversions.map((conversion) => {
                // Calculate conversion rate with appropriate decimal places
                const fromSymbol = conversion.from.symbol;
                const toSymbol = conversion.to.symbol;
                const rate = formatAmount(
                  conversion.to.amount / conversion.from.amount,
                  toSymbol,
                );

                return (
                  <tr
                    key={conversion._id}
                    className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                      {conversion._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatAmount(conversion.from.amount, fromSymbol)}{' '}
                          {fromSymbol}
                        </span>
                        <span className="text-xs text-gray-500 max-lg:text-gray-400">
                          ${conversion.from.price.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatAmount(conversion.to.amount, toSymbol)}{' '}
                          {toSymbol}
                        </span>
                        <span className="text-xs text-gray-500 max-lg:text-gray-400">
                          ${conversion.to.price.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                      1 {fromSymbol} = {rate} {toSymbol}
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                      {formatAmount(conversion.fee, fromSymbol)} {fromSymbol}
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                      {new Date(conversion.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
