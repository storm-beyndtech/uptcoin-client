import {
  ArrowDownToLine,
  EyeOff,
  Eye,
  ArrowUpFromLine,
  ArrowUpDown,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Asset {
  _id: string;
  symbol: string;
  funding: number;
  spot: number;
  name: string;
  address: string;
  network: string;
}

interface BalanceCardProps {
  assets: Asset[];
}

const BalanceCard: React.FC<BalanceCardProps> = ({ assets }) => {
  const [showBalance, setShowBalance] = useState(true);
  const totalBalance = assets.reduce(
    (acc, asset) => acc + asset.funding + asset.spot,
    0,
  );

  return (
    <div className="relative bg-black/20 text-white px-4 py-5 tracking-wider rounded-2xl shadow-lg w-full max-w-md mx-auto">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-4 cursor-pointer">
        <span className="text-sm font-medium text-white/30">Total Balance</span>
        {showBalance ? (
          <EyeOff onClick={() => setShowBalance(false)} size={20} />
        ) : (
          <Eye onClick={() => setShowBalance(true)} size={20} />
        )}
      </div>

      {/* Balance Amount */}
      <h2 className="text-3xl font-medium">
        {showBalance ? `$${totalBalance.toFixed(2)}` : '******'}
      </h2>

      {/* Action Buttons */}
      <div className="flex justify-between mt-5 text-xs">
        <Link to="/dashboard/deposit" className="flex flex-col items-center">
          <ArrowDownToLine className="text-green-400" />
          <span className="text-sm mt-1 text-white/60">Deposit</span>
        </Link>

        <Link to="/dashboard/withdraw" className="flex flex-col items-center">
          <ArrowUpFromLine className="text-green-400" />
          <span className="text-sm mt-1 text-white/60">Withdraw</span>
        </Link>

        <Link to="/dashboard/transfer" className="flex flex-col items-center">
          <ArrowUpDown className="text-green-400" />
          <span className="text-sm mt-1 text-white/60">Transfer</span>
        </Link>
      </div>
    </div>
  );
};

export default BalanceCard;
