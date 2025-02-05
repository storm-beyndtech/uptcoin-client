import { ScanSearch } from 'lucide-react';
import { useState } from 'react';

export default function QuickContract() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Open', 'Released'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 text-xs">
      <h2 className="text-xl font-medium my-3">Transactions</h2>
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-3 py-1 rounded-sm text-xs font-medium ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-400 text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="w-full text-left text-xs">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="px-2 py-3">#</th>
            <th className="px-2 py-3">Side</th>
            <th className="px-2 py-3">Symbol</th>
            <th className="px-2 py-3">Price</th>
            <th className="px-2 py-3">Contract time</th>
            <th className="px-2 py-3">Amount</th>
            <th className="px-2 py-3">Percentage</th>
            <th className="px-2 py-3">Profit</th>
            <th className="px-2 py-3">Event</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-100">
            <td colSpan={9} className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <ScanSearch
                  className="text-gray-400"
                  size={40}
                  strokeWidth={1}
                />
                <p className="text-gray-500 text-xs mt-2">No records found</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
