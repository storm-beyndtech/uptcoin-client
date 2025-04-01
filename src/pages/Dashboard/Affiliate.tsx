import { useState } from 'react';
import { Clipboard, Users, DollarSign, ChevronUp } from 'lucide-react';
import { contextData } from '@/context/AuthContext';

export default function Affiliate() {
  const { user } = contextData();
  const [copied, setCopied] = useState(false);
  const invitationCode = user.uid;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-8 space-y-10 bg-gradient-to-br from-white to-gray-50 max-lg:from-bodydark2 max-lg:to-bodydark1 min-h-screen transition-all duration-500">
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold text-gray-800 max-lg:text-gray-100">
          Affiliate Program
        </h1>
        <p className="text-gray-500 max-lg:text-gray-400">
          Invite friends and earn rewards together
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="bg-white max-lg:bg-bodydark2 rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-lg:border-white/10 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 max-lg:text-gray-400">
                  Total Earnings
                </p>
                <h3 className="text-3xl font-semibold text-gray-900 max-lg:text-white mt-1">
                  0.00
                </h3>
                <p className="text-sm font-medium text-green-600 max-lg:text-green-400 mt-1">
                  USDT
                </p>
              </div>
              <div className="p-3 bg-green-100 max-lg:bg-green-900 rounded-full">
                <DollarSign
                  size={20}
                  className="text-green-600 max-lg:text-green-400"
                />
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500 max-lg:text-gray-400">
              <ChevronUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">0%</span>&nbsp;since
              last month
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-white max-lg:bg-bodydark2 rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-lg:border-white/10 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 max-lg:text-gray-400">
                  Total Members
                </p>
                <h3 className="text-3xl font-semibold text-gray-900 max-lg:text-white mt-1">
                  0
                </h3>
                <p className="text-sm font-medium text-blue-600 max-lg:text-blue-400 mt-1">
                  Members
                </p>
              </div>
              <div className="p-3 bg-blue-100 max-lg:bg-blue-900 rounded-full">
                <Users
                  size={20}
                  className="text-blue-600 max-lg:text-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500 max-lg:text-gray-400">
              <ChevronUp size={14} className="text-blue-500 mr-1" />
              <span className="text-blue-500 font-medium">0%</span>&nbsp;since
              last month
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Code Section */}
      <div className="lg:w-fit bg-white max-lg:bg-bodydark2 rounded-2xl shadow-xl p-6 border border-gray-100 max-lg:border-white/10 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 max-lg:text-gray-200 mb-4">
          Referral Code:
        </h2>
        <div className="flex items-center gap-3">
          <div className="bg-white max-lg:bg-bodydark2 border border-gray-200 max-lg:border-gray-600 rounded-lg px-4 py-1.5 text-gray-800 max-lg:text-gray-200">
            {invitationCode}
          </div>
          <button
            onClick={handleCopy}
            className="bg-black text-white max-lg:bg-bodydark2 py-1.5 px-3 rounded flex items-center justify-center gap-3"
            aria-label="Copy invitation code"
          >
            <Clipboard size={14} />
            <span>copy</span>
          </button>
        </div>

        {copied && (
          <div className="bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center animate-pulse">
            Copied successfully!
          </div>
        )}
      </div>

      {/* Statistics Card */}
      <div className="bg-white max-lg:bg-bodydark2 rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-lg:border-white/10 transition-all duration-300">
        <div className="p-6 border-b border-gray-100 max-lg:border-white/10">
          <h2 className="text-xl font-semibold text-gray-800 max-lg:text-gray-200">
            Affiliate Statistics
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 max-lg:bg-bodydark2">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 max-lg:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 max-lg:divide-gray-700">
              <tr className="text-sm hover:bg-gray-50 max-lg:hover:bg-bodydark2 transition-colors duration-200">
                <td className="px-6 py-4 text-gray-700 max-lg:text-gray-300">
                  1
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 bg-indigo-100 max-lg:bg-indigo-900 text-indigo-600 max-lg:text-indigo-400 rounded-full flex items-center justify-center font-medium">
                      JD
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800 max-lg:text-gray-200">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-500 max-lg:text-gray-400">
                        Joined Mar 15, 2025
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 max-lg:text-gray-200">
                  $100.00
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 max-lg:bg-green-900 text-green-800 max-lg:text-green-200">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
