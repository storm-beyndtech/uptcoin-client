import { useCrypto } from '@/context/CoinContext';
import { sendRequest } from '@/lib/sendRequest';
import { ChartNoAxesCombined, Coins, Users, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stat {
  title: string;
  value: number;
  icon: JSX.Element;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const { cryptoData } = useCrypto();

  const fetchStats = async () => {
    try {
      // Fetch users and trades in parallel
      const [usersRes, tradesRes] = await Promise.all([
        sendRequest('/auth/users', 'GET'),
        sendRequest('/transaction/trades', 'GET'),
      ]);

      const users = usersRes || [];
      const trades = tradesRes || [];

      // Filter users excluding admins
      const filteredUsers = users.filter((user: any) => user.role !== 'admin');

      // Sum all users' asset lengths
      const totalAssets = filteredUsers.reduce(
        (sum: number, user: any) => sum + (user.assets?.length || 0),
        0,
      );

      // Create stats array
      setStats([
        {
          title: 'Total Users',
          value: filteredUsers.length,
          icon: <Users className="text-xl text-black dark:text-gray-500" />,
        },
        {
          title: 'Total Trades',
          value: trades.length,
          icon: (
            <ChartNoAxesCombined className="text-xl text-black dark:text-gray-500" />
          ),
        },
        {
          title: 'Total Coins',
          value: Object.keys(cryptoData).length,
          icon: <Coins className="text-xl text-black dark:text-gray-500" />,
        },
        {
          title: 'Total Users Assets',
          value: totalAssets,
          icon: <Wallet className="text-xl text-black dark:text-gray-500" />,
        },
      ]);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="col-span-12 rounded-xl border border-stroke bg-white py-7.5 dark:border-blue-500 dark:bg-black/20">
      <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-7.5 gap-2 border-stroke pb-5 dark:border-blue-500 ${
              i === stats.length - 1 ? '' : 'xl:border-r'
            } xl:pb-0`}
          >
            <div className="flex flex-col justify-between items-start font-montserrat">
              <h4 className="mb-2.5 text-3xl font-semibold text-black dark:text-white">
                {stat.value}
              </h4>
              <p className="text-xs text-black dark:text-gray-500">
                {stat.title}
              </p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
