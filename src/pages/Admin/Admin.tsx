import AdminLatestTransactions from '@/components/AdminLatestTransactions';
import AdminStats from '@/components/AdminStats';
import { sendRequest } from '@/lib/sendRequest';
import { useEffect, useState } from 'react';

export default function Admin() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    try {
      // Fetch users and trades in parallel
      const [depositData, withdrawalData] = await Promise.all([
        sendRequest('/transaction/deposits', 'GET'),
        sendRequest('/transaction/withdrawals', 'GET'),
      ]);

      console.log(depositData, withdrawalData);

      const deposits = depositData?.map((item:any) => ({ ...item, event: "deposit" })) || [];
      const withdrawals = withdrawalData?.map((item:any) => ({ ...item, event: "withdrawal" })) || [];
      
      setTransactions([...deposits, ...withdrawals]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <AdminStats />

      <AdminLatestTransactions allTransactions={transactions} />
    </>
  );
}
