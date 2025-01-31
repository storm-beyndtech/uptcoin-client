import CreateTradeModal from '@/components/CreateTradeModal';
import Alert from '@/components/UI/Alert';
import { useEffect, useState } from 'react';

export default function ManageTrades() {
  const [trades, setTrades] = useState<ITransaction[]>([]);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [success, setSuccess] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const toggleModal = (e: boolean) => {
    setToggle(e);
  };

  const fetchTrades = async () => {
    try {
      const res = await fetch(`${url}/trades`);
      const data = await res.json();

      if (res.ok) setTrades(data);
      else throw new Error(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [toggle, success]);

  const handleTrade = async (e: ITransaction) => {
    setError(null);
    setSuccess(null);
    setLoading((prev) => ({ ...prev, [e._id]: true }));

    try {
      const res = await fetch(`${url}/trades/${e._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [e._id]: false }));
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto rounded-[6px]">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <button
            onClick={() => toggleModal(true)}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create new trade
          </button>
        </div>
        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                User
              </th>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                Type/Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg">
                Status
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 &&
              trades.map((trade: ITransaction, i: number) => (
                <tr className="bg-white dark:bg-gray-800" key={i}>
                  <th
                    scope="row"
                    className="flex items-center px-5 py-3 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      className="w-10 h-10 rounded-full bg-[#E2FFD7]/10"
                      src={`https://robohash.org/${trade.user?.id}`}
                      alt="Avatar"
                    />
                    <div className="ps-3">
                      <div className="text-xs font-semibold">
                        {trade.user.name!.length > 17
                          ? trade.user.name?.slice(0, 15) + '...'
                          : trade.user.name}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        {trade.user.email!.length > 17
                          ? trade.user.email?.slice(0, 15) + '...'
                          : trade.user.email}
                      </div>
                    </div>
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {trade.tradeData.package}
                    <br />${trade.amount}
                  </th>
                  <td className="px-6 py-4 max-sm:text-[10px] min-w-28">
                    {trade.date.slice(0, 10)}
                  </td>
                  <td
                    className={`px-6 py-4 max-sm:text-[12px] ${trade.status} font-medium`}
                  >
                    {trade.status}
                  </td>
                  <td className="px-6 py-4">
                    {trade.status === 'pending' && (
                      <button
                        onClick={() => handleTrade(trade)}
                        className="font-medium text-blue-600 dark:text-blue-500"
                      >
                        {loading[trade._id] ? 'loading...' : 'Close trade'}
                      </button>
                    )}
                    {trade.status === 'success' && (
                      <button className="font-medium text-blue-600 dark:text-blue-500">
                        Closed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {toggle && <CreateTradeModal toggleModal={toggleModal} />}
    </>
  );
}

interface User {
  id?: string;
  email?: string;
  name?: string;
}

interface WalletData {
  address?: string;
  network?: string;
  coinName?: string;
  convertedAmount?: number;
}

interface TradeData {
  package?: string;
  interest?: string;
}

interface ITransaction {
  _id: string;
  type: string;
  user: User;
  status: 'pending' | 'success' | 'failed';
  amount: number;
  date: string;
  walletData: WalletData;
  tradeData: TradeData;
}
