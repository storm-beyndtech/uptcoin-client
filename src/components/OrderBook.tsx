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
  version?: string;
}

const generateRandomOrders = (
  type: 'bid' | 'ask',
  basePrice: number,
): Order[] => {
  return Array.from({ length: 10 }, () => {
    const variation = Math.random() * (type === 'bid' ? -0.2 : 0.2);
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

const OrderBook: React.FC<OrderBookProps> = ({ marketData, version }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  useEffect(() => {
    if (marketData?.price) {
      setBids(generateRandomOrders('bid', marketData.price));
      setAsks(generateRandomOrders('ask', marketData.price));

      const interval = setInterval(() => {
        setBids(generateRandomOrders('bid', marketData.price));
        setAsks(generateRandomOrders('ask', marketData.price));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [marketData]);

  if (version) {
    if (version === '1') {
      return (
        <div className="w-full h-full text-xs overflow-y-auto no-scrollbar">
          <h3 className="mb-2 font-semibold text-white/60">Order Book</h3>
          <div className="flex justify-between border-b border-white/10 text-white/40 pb-2 mb-2">
            <span>Price</span>
            <span>Quantity</span>
            <span>Time</span>
          </div>
          <div className="space-y-4">
            {asks.map((order, i) => (
              <div key={i} className="flex justify-between text-red-400">
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
    }

    //Second Version
    if (version === '2') {
      return (
        <div className="w-full h-full text-[10px] overflow-y-auto no-scrollbar">
          <h3 className="mb-2 font-semibold text-white/60 text-xs">
            Order Book
          </h3>
          <div className="flex justify-between border-b border-white/10 text-white/40 pb-2 mb-2">
            <span>Price</span>
            <span>Qty</span>
          </div>
          <div className="">
            {asks.map((order, i) => (
              <div key={i} className="flex justify-between text-red-400">
                <span>{order.price.toFixed(2)}</span>
                <span className="text-white/90">
                  {order.quantity.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 my-2"></div>
          <div className="">
            {bids.map((order, index) => (
              <div key={index} className="flex justify-between text-green-400">
                <span>{order.price.toFixed(2)}</span>
                <span className="text-white/90">
                  {order.quantity.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Third Version
    if (version === '3') {
      return (
        <div className="w-full h-full text-xs overflow-y-auto no-scrollbar">
          <h3 className="mb-2 font-semibold text-white/60">Order Book</h3>
          <div className="flex justify-between border-b border-white/10 text-white/40 pb-2 mb-2">
            <span>Qty</span>
            <span>Price(USDT)</span>
            <span>Qty</span>
          </div>

          <div className="flex justify-between w-full gap-2">
            <div className="space-y-4 w-full">
              {bids.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between text-green-400"
                >
                  <span className="text-white/90">
                    {order.quantity.toFixed(4)}
                  </span>
                  <span className="text-right">{order.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 w-full">
              {asks.map((order, i) => (
                <div key={i} className="flex justify-between text-red-400">
                  <span>{order.price.toFixed(2)}</span>
                  <span className="text-white/90 text-right">
                    {order.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="w-full h-full text-xs overflow-y-auto no-scrollbar">
        <h3 className="mb-2 font-semibold text-white/60">Order Book</h3>
        <div className="flex justify-between border-b border-white/10 text-white/40 pb-2 mb-2">
          <span>Price</span>
          <span>Quantity</span>
          <span>Time</span>
        </div>
        <div className="space-y-4">
          {asks.map((order, i) => (
            <div key={i} className="flex justify-between text-red-400">
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
  }
};

export default OrderBook;
