import { UserProfile } from '@/components/OverviewComps';
import { ClipboardCopy } from 'lucide-react';
import { useState } from 'react';

export default function Affiliate() {
  const [copied, setCopied] = useState(false);
  const invitationCode = 'jxaw7lc';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-4 space-y-6">
      <UserProfile
        email="beyndtech@gmail.com"
        verified={false}
        uid="7154949378"
        tradingStatus="Non Trader"
        tradingLevel="None"
        tradingLimit="None"
      />
      <div className="border rounded-lg shadow-sm p-4">
        <h2 className="font-semibold mb-3">Affiliate Information</h2>
        <p className="text-sm text-green-600 font-bold">0.00 USDT</p>
        <p className="text-sm font-bold">
          <span className="text-green-600">0</span> Member
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm">My invitation code:</span>
          <span
            onClick={handleCopy}
            className="px-3 py-1 cursor-pointer bg-gray-200 rounded-md text-xs font-medium"
          >
            {invitationCode}
          </span>
          <button onClick={handleCopy} className=" hover:text-blue-500">
            <ClipboardCopy size={14} strokeWidth={1} />
          </button>
          {copied && (
            <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-[2px] rounded font-medium">
              Copied!
            </span>
          )}
        </div>
      </div>

      <div className="border rounded-lg shadow-sm p-4">
        <h2 className="font-semibold">Affiliate Statistic</h2>
        <table className="w-full text-left mt-2">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">User's name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 text-sm">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">$100</td>
              <td className="px-4 py-2">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
