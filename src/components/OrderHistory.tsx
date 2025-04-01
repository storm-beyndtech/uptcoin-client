import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';
import React, { useEffect, useState } from 'react';

type Order = {
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

const OrderHistory: React.FC = () => {
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
  }, [user]);

  return (
    <div className="rounded-sm w-full text-sm">
      <h2 className="text-white font-semibold mb-2">Order History</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-white/40 text-center py-4">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-white/40 text-center py-4">No orders found.</p>
        ) : (
          <table className="w-full text-left text-white/40">
            <thead className="text-xs bg-[#1a1b1c] text-white/80">
              <tr>
                {tableHeads.map((head) => (
                  <th key={head} className="px-4 py-2">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-white/10 text-xs">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{order.symbol}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      order.action === 'buy' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {order.action}
                  </td>
                  <td className="px-4 py-3">
                    $
                    {order.orderType === 'limit' && order.limitPrice
                      ? order.limitPrice.toFixed(2)
                      : order.marketPrice && order.marketPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
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

export default OrderHistory;
