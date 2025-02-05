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
      <h2 className="text-xl font-medium">Transactions</h2>

      {/* Search input */}
      <div className={`relative max-w-70`}>
        <FiSearch className="absolute top-[50%] translate-y-[-50%] left-3 text-xl text-gray-400" />
        <input
          type="text"
          placeholder="Search Symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg pl-10 bg-transparent my-2"
        />
      </div>

      <table className="w-full mt-2 text-xs">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="px-2 py-3">#</th>
            <th className="px-2 py-3">Currency</th>
            <th className="px-2 py-3">Address</th>
            <th className="px-2 py-3">Amount</th>
            <th className="px-2 py-3">Charges</th>
            <th className="px-2 py-3">Network</th>
            <th className="px-2 py-3">Operation</th>
            <th className="px-2 py-3">Event</th>
            <th className="px-2 py-3">Status</th>
            <th className="px-2 py-3">View</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((txn) => (
            <tr key={txn.id} className="bg-white border-t">
              <td className="px-2 py-3">{txn.id}</td>
              <td className="px-2 py-3">{txn.symbol}</td>
              <td className="px-2 py-3">{truncateAddress(txn.address)}</td>
              <td className="px-2 py-3">{txn.amount}</td>
              <td className="px-2 py-3">{txn.charges}</td>
              <td className="px-2 py-3">{txn.network}</td>
              <td className="px-2 py-3">{txn.operation}</td>
              <td className="px-2 py-3">{txn.event}</td>
              <td
                className={`px-2 py-3 font-medium ${
                  txn.status === 'Approved' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {txn.status}
              </td>
              <td className="px-2 py-3">
                <button className="bg-gray-400 text-white px-2 py-[2px] rounded text-xs">
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
