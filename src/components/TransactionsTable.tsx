import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';
import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

type Transaction = {
  _id: string;
  symbol: string;
  address?: string;
  amount: number;
  charges: number;
  network: string;
  operation: 'Deposit' | 'Withdrawal';
  createdAt: string;
  status: 'approved' | 'pending' | 'cancelled' | 'rejected';
};

export default function TransactionsTable() {
  const { user } = contextData();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Fetch both deposit and withdrawal transactions
        const deposits = await sendRequest(
          `/transaction/deposits?userId=${encodeURIComponent(user._id)}`,
          'GET',
        );

        const withdrawals = await sendRequest(
          `/transaction/withdrawals?userId=${encodeURIComponent(user._id)}`,
          'GET',
        );

        // Process and merge transactions with common fields
        const formattedDeposits = deposits.map((deposit: any) => ({
          _id: deposit._id,
          symbol: deposit.symbol,
          address: deposit.address,
          amount: deposit.amount,
          charges: deposit.fee || 0,
          network: deposit.network,
          operation: 'Deposit' as const,
          createdAt: deposit.createdAt,
          status: deposit.status,
        }));

        const formattedWithdrawals = withdrawals.map((withdrawal: any) => ({
          _id: withdrawal._id,
          symbol: withdrawal.symbol,
          address: withdrawal.address,
          amount: withdrawal.amount,
          charges: withdrawal.fee || 0,
          network: withdrawal.network,
          operation: 'Withdrawal' as const,
          createdAt: withdrawal.createdAt,
          status: withdrawal.status,
        }));

        // Combine and sort by date (newest first)
        const allTransactions = [
          ...formattedDeposits,
          ...formattedWithdrawals,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setTransactions(allTransactions);
      } catch (error: any) {
        console.error('Error fetching transactions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user._id]);

  const filteredTransactions = transactions.filter((txn) =>
    txn.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  const truncateAddress = (address: string = '') =>
    address.length > 15 ? `${address.slice(0, 15)}...` : address;

  return (
    <div className="p-4 text-sm">
      <h2 className="text-xl font-medium mb-4 text-gray-500 max-lg:text-gray-300">
        Transactions
      </h2>

      {/* Search input */}
      <div className="relative max-w-70 mb-4">
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
        {loading ? (
          <p className="text-white/40 text-center py-4">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-white/40 text-center py-4">
            No transactions found.
          </p>
        ) : (
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
              {filteredTransactions.map((txn, index) => (
                <tr
                  key={txn._id}
                  className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {index + 1}
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
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300 whitespace-nowrap">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.status === 'approved'
                          ? 'bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200'
                          : txn.status === 'pending'
                            ? 'bg-yellow-100 max-lg:bg-yellow-900 text-yellow-800 max-lg:text-yellow-200'
                            : 'bg-red-100 max-lg:bg-red-900 text-red-800 max-lg:text-red-200'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr className="text-sm bg-gray-50 max-lg:bg-bodydark2">
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500 max-lg:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
