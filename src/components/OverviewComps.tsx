import React, { useState } from 'react';
import { ChevronRight, ShieldAlert, ShieldCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="relative w-full lg:w-fit">
      {/* Profile Trigger - Visible in Nav */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bodydark2/50 transition-colors lg:bg-gray-100 lg:hover:bg-gray-200"
      >
        <div className="w-8 h-8 text-sm flex items-center justify-center bg-gray-200 text-black font-bold rounded-full">
          {getAbbreviation(email)}
        </div>
        <span className="max-lg:text-white/90 lg:text-black text-sm font-medium">
          {formatEmail(email)}
        </span>
      </button>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="absolute top-full left-1 mt-2 w-64 z-50 bg-bodydark1 lg:bg-white rounded-lg shadow-lg overflow-hidden border border-bodydark2/50 lg:border-gray-200">
          {/* User Info Section */}
          <div className="p-4 border-b border-bodydark2/50 lg:border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-white/70 lg:text-gray-500">
              <span>UID: {uid}</span>
              <VerificationBadge verified={verified} />
            </div>
          </div>

          {/* Trading Information */}
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-medium text-white/80 lg:text-gray-700 mb-2">
              Trading Details
            </h4>

            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 lg:text-gray-500">
                Trading Status
              </span>
              <span className="text-xs font-medium text-white/90 lg:text-black">
                {tradingStatus}
              </span>
            </div>

            {/* Level */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 lg:text-gray-500">
                Trading Level
              </span>
              <span className="text-xs font-medium text-white/90 lg:text-black">
                {tradingLevel}
              </span>
            </div>

            {/* Limit */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 lg:text-gray-500">
                Trading Limit
              </span>
              <span className="text-xs font-medium text-white/90 lg:text-black">
                {tradingLimit}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 bg-bodydark2/30 lg:bg-gray-50">
            <Link
              to="/dashboard/wallet"
              className="w-full py-2 text-xs font-medium text-white/90 lg:text-black hover:text-primary transition-colors"
            >
              Manage Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// AccountBalance Component
interface IBal {
  totalBalance: number;
}
const AccountBalance: React.FC<IBal> = ({ totalBalance }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="font-semibold">Account balance</h3>
      <p className="text-3xl font-bold mt-2">
        {totalBalance.toFixed(2)}{' '}
        <span className="text-gray-500 text-lg">USDT</span>
      </p>
      <Link
        to="/dashboard/wallet"
        className="text-green-500 flex items-center gap-1 mt-2"
      >
        <Wallet /> <span>My wallet </span>{' '}
        <span>
          <ChevronRight size={16} />
        </span>
      </Link>
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

export { UserProfile, AccountBalance, PressRelease };
