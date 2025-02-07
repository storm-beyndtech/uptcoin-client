import Deposit from "@/pages/Dashboard/Deposit";
import KYC from "@/pages/Dashboard/KYC";
import LiveTrades from "@/pages/Dashboard/LiveTrades";
import Profile from "@/pages/Dashboard/UserOverview";
import Settings from "@/pages/Dashboard/Settings";
import Transactions from "@/pages/Dashboard/Transactions";
import Withdraw from "@/pages/Dashboard/Withdraw";

const coreRoutes = [
  {
    path: '/dashboard/liveTrades',
    title: 'LiveTrades',
    component: LiveTrades,
  },
  {
    path: '/dashboard/deposit',
    title: 'Deposit',
    component: Deposit,
  },
  {
    path: '/dashboard/withdrawal',
    title: 'Withdrawal',
    component: Withdraw,
  },
  {
    path: '/dashboard/transactions',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/dashboard/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/dashboard/bonus',
    title: 'Bonus',
  },
  {
    path: '/dashboard/kyc',
    title: 'KYC',
    component: KYC,
  },
  {
    path: '/dashboard/settings',
    title: 'Settings',
    component: Settings,
  },
];

const routes = [...coreRoutes];
export default routes;
