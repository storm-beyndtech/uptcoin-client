import React, { useEffect, useState } from 'react';

type Order = {
  price: number;
  quantity: number;
  time: string;
};

type Market = {
  symbol: string;
  price: number;
  change: number;
};

interface OrderBookProps {
  marketData?: Market;
}

const generateRandomOrders = (
  type: 'bid' | 'ask',
  basePrice: number,
): Order[] => {
  return Array.from({ length: 10 }, () => {
    const variation = Math.random() * (type === 'bid' ? -0.5 : 0.5);
    return {
      price: parseFloat((basePrice + variation).toFixed(2)), // Ensure price is to 2 decimals
      quantity: parseFloat((Math.random() * 2).toFixed(4)),
      time: new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false, // Use 24-hour format
      }),
    };
  });
};

const OrderBook: React.FC<OrderBookProps> = ({ marketData }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  useEffect(() => {
    if (marketData?.price) {
      setBids(generateRandomOrders('bid', marketData.price));
      setAsks(generateRandomOrders('ask', marketData.price));

      const interval = setInterval(() => {
        setBids(generateRandomOrders('bid', marketData.price));
        setAsks(generateRandomOrders('ask', marketData.price));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [marketData]);

  return (
    <div className="w-full h-full text-sm overflow-y-auto no-scrollbar">
      <h3 className="mb-2 font-semibold text-white/60">Order Book</h3>
      <div className="flex justify-between border-b border-white/10 text-white/40 pb-2 mb-2">
        <span>Price</span>
        <span>Quantity</span>
        <span>Time</span>
      </div>
      <div className="space-y-4">
        {asks.map((order, index) => (
          <div key={index} className="flex justify-between text-red-400">
            <span>{order.price.toFixed(2)}</span>
            <span>{order.quantity.toFixed(4)}</span>
            <span>{order.time}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 my-5"></div>
      <div className="space-y-4">
        {bids.map((order, index) => (
          <div key={index} className="flex justify-between text-green-400">
            <span>{order.price.toFixed(2)}</span>
            <span>{order.quantity.toFixed(4)}</span>
            <span>{order.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
