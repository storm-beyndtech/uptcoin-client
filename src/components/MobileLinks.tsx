import {
  Gift,
  UserPlus,
  Coins,
  UploadCloud,
  SendToBack,
  CoinsIcon,
  TrendingUpDown,
  Headset,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const links = [
  { icon: Gift, label: 'Rewards', href: '/dashboard/affiliate' },
  { icon: UserPlus, label: 'Referral', href: '/dashboard/affiliate' },
  { icon: CoinsIcon, label: 'Market', href: '/market' },
  { icon: TrendingUpDown, label: 'Futures', href: '/margin' },
  { icon: Coins, label: 'Earn', href: '/dashboard/wallet' },
  { icon: UploadCloud, label: 'Deposit', href: '/dashboard/deposit' },
  { icon: SendToBack, label: 'Convert', href: '/dashboard/conversion' },
  { icon: Headset, label: 'Support', href: '/support' },
];

export default function MobileLinks() {
  return (
    <div className="grid grid-cols-4 gap-4 p-2">
      {links.map(({ icon: Icon, label, href }, index) => (
        <Link
          to={href}
          key={index}
          className="flex flex-col items-center text-white"
        >
          <div className="bg-bodydark2 p-3 rounded-xl flex items-center justify-center">
            <Icon size={24} className="text-green-300" strokeWidth={1} />
          </div>
          <p className="text-[10px] mt-2">{label}</p>
        </Link>
      ))}
    </div>
  );
}
