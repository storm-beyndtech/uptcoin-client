import { ScanSearch } from 'lucide-react';
import { useState } from 'react';

export default function QuickContract() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Open', 'Released'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const results: any = [];

  return (
    <div className="p-4 text-xs">
      <h2 className="text-xl font-medium mb-4 text-gray-500 max-lg:text-gray-300">
        Transactions
      </h2>
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

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 max-lg:bg-bodydark2">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Side
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Contract Time
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                Event
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 max-lg:divide-gray-700">
            {results.length > 0 ? (
              results.map((result: any, index: number) => (
                <tr
                  key={index}
                  className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {result.id}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.side === 'BUY' || result.side === 'LONG'
                          ? 'bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200'
                          : 'bg-red-100 max-lg:bg-red-900 text-red-800 max-lg:text-red-200'
                      }`}
                    >
                      {result.side}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex-shrink-0 bg-purple-100 max-lg:bg-purple-900 text-purple-600 max-lg:text-purple-400 rounded-full flex items-center justify-center font-medium text-xs">
                        {result.symbol?.charAt(0) || '?'}
                      </div>
                      <div className="ml-2">
                        <p className="font-medium text-gray-800 max-lg:text-gray-200 text-xs">
                          {result.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                    {result.price}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-lg:text-gray-400 text-xs">
                    {result.contractTime}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                    {result.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {result.percentage}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        result.profit && result.profit > 0
                          ? 'text-green-600 max-lg:text-green-400'
                          : 'text-red-600 max-lg:text-red-400'
                      }`}
                    >
                      {result.profit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                    {result.event}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-gray-50 max-lg:bg-bodydark2">
                <td colSpan={9} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center">
                    <ScanSearch
                      size={48}
                      className="text-gray-400 max-lg:text-gray-600"
                      strokeWidth={1.5}
                    />
                    <p className="text-gray-500 max-lg:text-gray-400 mt-4 font-medium">
                      No records found
                    </p>
                    <p className="text-gray-400 max-lg:text-gray-500 text-xs mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
