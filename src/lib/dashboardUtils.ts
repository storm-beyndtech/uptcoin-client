import {
  User,
  Wallet,
  Replace,
  BookText,
  Key,
  ShieldCheck,
  ArrowLeftRight,
  ChartGantt,
  TrendingUpDown,
  UserPlus,
} from 'lucide-react';

export const navItems = [
  {
    to: '/dashboard/',
    label: 'Overview',
    icon: User,
  },
  {
    to: '/dashboard/wallet',
    label: 'Wallet',
    icon: Wallet,
  },
  {
    to: '/dashboard/conversion',
    label: 'Conversion',
    icon: Replace,
  },
  {
    to: '/dashboard/wallet-address',
    label: 'Wallet Address',
    icon: BookText,
  },
  {
    to: '/dashboard/auth',
    label: 'Authentication',
    icon: ShieldCheck,
  },
  {
    to: '/dashboard/change-password',
    label: 'Change Password',
    icon: Key,
  },
  {
    to: '/dashboard/withdrawal-password',
    label: 'Withdrawal Password',
    icon: Key,
  },
  {
    to: '/dashboard/affiliate',
    label: 'Affiliate',
    icon: UserPlus,
  },
  {
    to: '/dashboard/transactions',
    label: 'Transactions',
    icon: ArrowLeftRight,
  },
  {
    to: '/dashboard/trade-records',
    label: 'Trade Records',
    icon: TrendingUpDown,
  },
  {
    to: '/dashboard/quick-contract',
    label: 'Quick Contract Records',
    icon: ChartGantt,
  },
];
