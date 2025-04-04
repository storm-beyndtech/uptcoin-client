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
  const { cryptoData } = useCrypto();

  const [stats, setStats] = useState<Stat[]>([
    {
      title: 'Total Users',
      value: 0,
      icon: <Users className="text-xl text-black dark:text-gray-500" />,
    },
    {
      title: 'Total Trades',
      value: 0,
      icon: (
        <ChartNoAxesCombined className="text-xl text-black dark:text-gray-500" />
      ),
    },
    {
      title: 'Total Coins',
      value: 0,
      icon: <Coins className="text-xl text-black dark:text-gray-500" />,
    },
    {
      title: 'Total Users Assets',
      value: 0,
      icon: <Wallet className="text-xl text-black dark:text-gray-500" />,
    },
  ]);

  // First useEffect: fetch and update everything except cryptoData
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, tradesRes] = await Promise.all([
          sendRequest('/auth/users', 'GET'),
          sendRequest('/transaction/trades', 'GET'),
        ]);

        const users = usersRes || [];
        const trades = tradesRes || [];

        const filteredUsers = users.filter(
          (user: any) => user.role !== 'admin',
        );
        const totalAssets = filteredUsers.reduce(
          (sum: number, user: any) => sum + (user.assets?.length || 0),
          0,
        );

        setStats((prev) => [
          { ...prev[0], value: filteredUsers.length },
          { ...prev[1], value: trades.length },
          { ...prev[2], value: Object.keys(cryptoData).length }, // still use latest cryptoData
          { ...prev[3], value: totalAssets },
        ]);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []); // Only run once on mount

  // Second useEffect: update only the coin count when cryptoData updates
  useEffect(() => {
    setStats((prev) =>
      prev.map((stat) =>
        stat.title === 'Total Coins'
          ? { ...stat, value: Object.keys(cryptoData).length }
          : stat,
      ),
    );
  }, [cryptoData]);

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
