import React from 'react';
import { ChevronRight, ShieldAlert, ShieldCheck, Wallet } from 'lucide-react';

const formatEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (name.length <= 5) return email;
  return `${name.slice(0, 3)}***${name.slice(-3)}@${domain}`;
};

const getAbbreviation = (email: string): string => {
  return email.slice(0, 2).toUpperCase();
};

const VerificationBadge = ({ verified }: { verified: boolean }) => {
  return verified ? (
    <div className="bg-green-500 text-white text-xs py-1 px-1.5 rounded-md flex items-center gap-1">
      <ShieldCheck size={12} />
      <span>Verified</span>
    </div>
  ) : (
    <div className="bg-red-500 text-white text-xs py-1 px-1.5 rounded-md flex items-center gap-1">
      <ShieldAlert size={12} />
      <span>Not Verified</span>
    </div>
  );
};

const UserProfile = ({
  email,
  verified,
  uid,
  tradingStatus,
  tradingLevel,
  tradingLimit,
}: {
  email: string;
  verified: boolean;
  uid: string;
  tradingStatus: string;
  tradingLevel: string;
  tradingLimit: string;
}) => {
  return (
    <div className="flex flex-col bg-white max-lg:bg-bodydark1 max-lg:my-5 p-4 rounded-lg shadow-sm space-y-4 flex-shrink-0">
      {/* Top Section - User Info */}
      <div className="flex items-center lg:space-x-4">
        {/* Abbreviation */}
        <div className="w-14 h-14 text-xl flex items-center justify-center bg-gray-200 text-black font-bold rounded-full max-lg:hidden">
          {getAbbreviation(email)}
        </div>

        {/* User Info */}
        <div className="grid lg:gap-1 gap-3">
          <p className="text-sm font-medium max-lg:text-white/60">
            {formatEmail(email)}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 max-lg:text-white/90">
            <span>UID: {uid}</span>
            <VerificationBadge verified={verified} />
          </div>
        </div>
      </div>

      {/* Trading Information */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        {/* Trading Status */}
        <div className="flex flex-col">
          <span className="text-gray-500 max-lg:text-white/40">
            Trading Status
          </span>
          <span className="font-medium max-lg:text-white/90">
            {tradingStatus}
          </span>
        </div>

        {/* Trading Level */}
        <div className="flex flex-col">
          <span className="text-gray-500 max-lg:text-white/40">
            Trading Level
          </span>
          <span className="font-medium max-lg:text-white/90">
            {tradingLevel}
          </span>
        </div>

        {/* Trading Limit */}
        <div className="flex flex-col">
          <span className="text-gray-500 max-lg:text-white/40">
            Trading Limit
          </span>
          <span className="font-medium max-lg:text-white/90">
            {tradingLimit}
          </span>
        </div>
      </div>
    </div>
  );
};

// AccountBalance Component
const AccountBalance: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="font-semibold">Account balance</h3>
      <p className="text-3xl font-bold mt-2">
        0.00 <span className="text-gray-500 text-lg">USDT</span>
      </p>
      <a href="#" className="text-green-500 flex items-center gap-1 mt-2">
        <Wallet /> <span>My wallet </span>{' '}
        <span>
          <ChevronRight size={16} />
        </span>
      </a>
    </div>
  );
};

// PressRelease Component
const PressRelease: React.FC = () => {
  return (
    <div className="h-full p-4 border rounded-lg shadow-sm bg-white cursor-pointer">
      <h3 className="font-semibold flex justify-between items-center">
        Press release{' '}
        <span>
          <ChevronRight size={16} />
        </span>
      </h3>
    </div>
  );
};

// AssetTransactions Component
const AssetTransactions: React.FC = () => {
  const transactions: any = [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50 max-lg:bg-bodydark2">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Direction
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Turnover
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Complete
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 max-lg:divide-gray-700">
          {transactions.length > 0 ? (
            transactions.map((txn: any, index: number) => (
              <tr
                key={index}
                className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.id}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.symbol}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      txn.direction === 'BUY'
                        ? 'bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200'
                        : 'bg-red-100 max-lg:bg-red-900 text-red-800 max-lg:text-red-200'
                    }`}
                  >
                    {txn.direction}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                  {txn.price}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.quantity}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                  {txn.turnover}
                </td>
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  {txn.complete}%
                </td>
                <td className="px-6 py-4 text-gray-500 max-lg:text-gray-400 text-xs">
                  {txn.time}
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-sm bg-gray-50 max-lg:bg-bodydark2">
              <td
                colSpan={8}
                className="text-center px-6 py-5 text-gray-500 max-lg:text-gray-400"
              >
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { UserProfile, AccountBalance, PressRelease, AssetTransactions };
