import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';
import React, { useEffect, useState } from 'react';

type Order = {
  _id: string;
  symbol: string;
  action: 'Buy' | 'Sell';
  orderType: 'market' | 'limit';
  limitPrice?: number;
  marketPrice?: number;
  quantity: number;
  amount: number;
  createdAt: string;
  status: 'pending' | 'executed' | 'canceled' | 'rejected';
};

const tableHeads = [
  'ID',
  'Symbol',
  'Action',
  'Price',
  'Quantity',
  'Amount',
  'Time',
  'Status',
];

const TradeTransactions: React.FC = () => {
  const { user } = contextData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const trades = await sendRequest(
          `/transaction/trades/${user._id}`,
          'GET',
        );
        setOrders(trades);
      } catch (error: any) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="rounded-sm w-full text-sm">
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-white/40 text-center py-4">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-white/40 text-center py-4">No orders found.</p>
        ) : (
          <table className="w-full text-left text-white/40">
            <thead>
              <tr className="bg-gray-50 max-lg:bg-bodydark2">
                {tableHeads.map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={i}
                  className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {order.symbol}
                  </td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      order.action === 'Buy' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {order.action}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    $
                    {order.orderType === 'limit' && order.limitPrice
                      ? order.limitPrice.toFixed(2)
                      : order.marketPrice && order.marketPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      order.status === 'executed'
                        ? 'text-green-400'
                        : order.status === 'pending'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TradeTransactions;
