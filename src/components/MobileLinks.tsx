import {
  Gift,
  UserPlus,
  Coins,
  UploadCloud,
  ShoppingCart,
  CoinsIcon,
  TrendingUpDown,
  Headset,
} from 'lucide-react';

const links = [
  { icon: Gift, label: 'Rewards', href: '/dashboard' },
  { icon: UserPlus, label: 'Referral', href: '/dashboard' },
  { icon: CoinsIcon, label: 'Market', href: '/market' },
  { icon: TrendingUpDown, label: 'Futures', href: '/margin' },
  { icon: Coins, label: 'Earn', href: '/dashboard' },
  { icon: UploadCloud, label: 'Deposit', href: '/dashboard/deposit' },
  { icon: ShoppingCart, label: 'Convert', href: '/dashboard/conversion' },
  { icon: Headset, label: 'Support', href: '/support' },
];

export default function MobileLinks() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {links.map(({ icon: Icon, label }, index) => (
        <div key={index} className="flex flex-col items-center text-white">
          <div className="bg-bodydark2 p-3 rounded-xl flex items-center justify-center">
            <Icon size={24} className="text-green-300" strokeWidth={1} />
          </div>
          <p className="text-[10px] mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}
