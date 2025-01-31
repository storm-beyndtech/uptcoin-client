import { useState } from 'react';

const MarginTrade = () => {
  const [customAmount, setCustomAmount] = useState('');

  const selectionPeriods = [
    { time: '60S', percent: '20%' },
    { time: '120S', percent: '30%' },
    { time: '180S', percent: '50%' },
    { time: '240S', percent: '70%' },
  ];

  const amounts = [100, 200, 500, 1000, 2000, 3000, 4000];

  return (
    <div className="text-white rounded-sm w-full">
      <h2 className="font-semibold text-green-500 mb-2">BTC/USDT</h2>
      <p className="text-green-500 mb-5 text-sm">Quick Contract</p>

      {/* Selection Period */}
      <div>
        <h3 className="text-sm text-white/60 mb-2">Selection Period</h3>
        <div className="grid grid-cols-2 gap-2">
          {selectionPeriods.map((period, index) => (
            <button
              key={index}
              className="p-3 bg-[#1f2022] text-center rounded-xl text-white/80 hover:bg-[#151617] transition"
            >
              <div className="text-sm font-bold mb-1">{period.time}</div>
              <div className="text-xs">{period.percent}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="mt-7.5">
        <h3 className="text-sm text-white/60 mb-2">Custom amount in USDT</h3>
        <input
          type="number"
          placeholder="Enter amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="tradePanelInput !pl-4 placeholder:text-sm placeholder:text-white/20"
        />
      </div>

      {/* Select Amount */}
      <div className="mt-7.5">
        <h3 className="text-sm text-white/60 mb-2">Select amount in USDT</h3>
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amount, index) => (
            <button
              key={index}
              className="p-3 text-xs  bg-[#1f2022] text-white/80 rounded-xl hover:bg-[#151617] transition"
              onClick={() => setCustomAmount(amount.toString())}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Balance */}
      <div className="mt-7.5 font-semibold text-white/60">
        Balance: <span className="text-green-500">10507.88 USDT</span>
      </div>
    </div>
  );
};

export default MarginTrade;
