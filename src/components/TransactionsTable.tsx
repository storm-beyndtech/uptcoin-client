import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const transactions = [
  {
    id: 1,
    symbol: 'BTC',
    address: 'havuybahquraoi384k3hhvjbq4335',
    amount: 0.5,
    charges: 0,
    network: 'BTC',
    operation: 'DEPOSIT',
    event: '2025-01-24',
    status: 'Approved',
  },
  {
    id: 2,
    symbol: 'BTC',
    address: 'bc1q45068uptr6pa2nkua86kyv7f4xx9f4vzu786w4',
    amount: 1,
    charges: 0,
    network: 'BTC',
    operation: 'DEPOSIT',
    event: '2025-01-22',
    status: 'Cancelled',
  },
];

export default function TransactionsTable() {
  const [search, setSearch] = useState('');

  const filteredAssets = transactions.filter((asset) =>
    asset.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  const truncateAddress = (address: string) =>
    address.length > 15 ? `${address.slice(0, 15)}...` : address;

  return (
    <div className="p-4 text-sm">
      <h2 className="text-xl font-medium mb-4 text-gray-500 max-lg:text-gray-300">
        Transactions
      </h2>

      {/* Search input */}
      <div className={`relative max-w-70 mb-4`}>
        <FiSearch className="absolute top-[50%] translate-y-[-50%] left-3 text-xl text-gray-400" />
        <input
          type="text"
          placeholder="Search Transaction"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 max-lg:bg-bodydark2">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Charges
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Network
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Operation
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 max-lg:divide-gray-700">
            {filteredAssets.map((txn) => (
              <tr
                key={txn.id}
                className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.id}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-700 max-lg:text-gray-300">
                  {txn.symbol}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-700 max-lg:text-gray-300">
                  {truncateAddress(txn.address)}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                  {txn.amount}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.charges}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.network}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.operation}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.event}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      txn.status === 'Approved'
                        ? 'bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200'
                        : 'bg-red-100 max-lg:bg-red-900 text-red-800 max-lg:text-red-200'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredAssets.length === 0 && (
              <tr className="text-sm bg-gray-50 max-lg:bg-bodydark2">
                <td
                  colSpan={10}
                  className="px-6 py-8 text-center text-gray-500 max-lg:text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
