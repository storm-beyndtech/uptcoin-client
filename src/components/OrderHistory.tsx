import React from 'react';

type Order = {
  id: string;
  symbol: string;
  direction: 'Buy' | 'Sell';
  marketPrice: number;
  quantity: number;
  amount: number;
  time: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
};

const sampleOrders: Order[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    direction: 'Buy',
    marketPrice: 45000,
    quantity: 0.1,
    amount: 4500,
    time: '14:30',
    status: 'Completed',
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    direction: 'Sell',
    marketPrice: 3000,
    quantity: 1,
    amount: 3000,
    time: '14:35',
    status: 'Pending',
  },
  {
    id: '3',
    symbol: 'XRP/USDT',
    direction: 'Buy',
    marketPrice: 1.2,
    quantity: 1000,
    amount: 1200,
    time: '14:40',
    status: 'Cancelled',
  },
];

const OrderHistory: React.FC = () => {
  return (
    <div className="rounded-sm w-full text-sm">
      <h2 className="text-white font-semibold mb-2">Order History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white/40">
          <thead className="text-xs bg-[#1a1b1c] text-white/80">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Direction</th>
              <th className="px-4 py-2 whitespace-nowrap">Market Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/10 text-xs">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.symbol}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    order.direction === 'Buy'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {order.direction}
                </td>
                <td className="px-4 py-3">${order.marketPrice.toFixed(2)}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">${order.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{order.time}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    order.status === 'Completed'
                      ? 'text-green-400'
                      : order.status === 'Pending'
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
      </div>
    </div>
  );
};

export default OrderHistory;
