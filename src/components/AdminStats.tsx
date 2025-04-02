import { useCrypto } from '@/context/CoinContext';
import { sendRequest } from '@/lib/sendRequest';
import { useEffect, useState } from 'react';
import { TbUsers, TbCoin, TbArrowsExchange, TbWallet } from 'react-icons/tb';

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

      const users = usersRes?.data || [];
      const trades = tradesRes?.data || [];

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
          icon: <TbUsers className="text-xl text-black dark:text-gray-500" />,
        },
        {
          title: 'Total Trades',
          value: trades.length,
          icon: (
            <TbArrowsExchange className="text-xl text-black dark:text-gray-500" />
          ),
        },
        {
          title: 'Total Coins',
          value: Object.keys(cryptoData).length,
          icon: <TbCoin className="text-xl text-black dark:text-gray-500" />,
        },
        {
          title: 'Total Assets',
          value: totalAssets,
          icon: <TbWallet className="text-xl text-black dark:text-gray-500" />,
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
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-7.5 dark:border-strokedark dark:bg-boxdark">
      <div className="grid grid-cols-1 gap-10 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-7.5 gap-2 border-stroke pb-5 dark:border-strokedark ${
              i === stats.length - 1 ? '' : 'xl:border-r'
            } xl:pb-0`}
          >
            <div className="flex flex-col justify-between items-start font-montserrat">
              <h4 className="mb-2.5 text-2xl font-medium text-black dark:text-white">
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
