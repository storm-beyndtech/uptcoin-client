import { Dispatch, SetStateAction, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface Asset {
  symbol: string;
  image: string;
  funding: number;
  spot: number;
  price: number;
  equivalent: number;
}

interface AssetListProps {
  assets: Asset[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AssetList = ({ assets, setIsModalOpen }: AssetListProps) => {
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter((asset) =>
    asset.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 bg-white rounded-sm shadow-default">
      <h2 className="text-lg font-semibold">Asset List</h2>

      <div className="flex justify-between items-center my-4">
        {/* Search input */}
        <div className={`relative max-w-70`}>
          <FiSearch className="absolute top-[50%] translate-y-[-50%] left-3 text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Search Symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-sm pl-10"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-sm hover:opacity-80"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Asset
        </button>
      </div>

      <table className="w-full border-collapse border rounded-sm">
        <thead className="bg-gray-200 text-left text-sm">
          {' '}
          <tr>
            <th className="p-3">Symbol</th>
            <th className="p-3">Funding</th>
            <th className="p-3">Spot</th>
            <th className="p-3">Total</th>
            <th className="p-3">Equivalent</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => {
            return (
              <tr key={asset.symbol} className="border-t text-sm font-semibold">
                <td className="px-3 py-4 flex items-center space-x-2">
                  <img
                    src={asset.image}
                    alt={asset.symbol}
                    className="w-5 h-5"
                  />
                  <span>{asset.symbol}</span>
                </td>
                <td className="px-3 py-4">
                  {asset.symbol === 'USDT'
                    ? asset.funding.toFixed(2)
                    : asset.funding.toFixed(6)}
                </td>
                <td className="px-3 py-4">
                  {asset.symbol === 'USDT'
                    ? asset.spot.toFixed(2)
                    : asset.spot.toFixed(6)}
                </td>
                <td className="px-3 py-4">
                  {asset.symbol === 'USDT'
                    ? (asset.funding + asset.spot).toFixed(2)
                    : (asset.funding + asset.spot).toFixed(6)}
                </td>
                <td className="px-3 py-4">${asset.equivalent.toFixed(2)}</td>
                <td className="space-x-2 mx-auto">
                  <Link to="/dashboard/deposit">
                    <button className="bg-[#138ea1] font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                      Deposit
                    </button>
                  </Link>

                  <Link to="/dashboard/withdraw">
                    <button className="bg-customGreen font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                      Withdraw
                    </button>
                  </Link>

                  <Link to="/dashboard/transfer">
                    <button className="bg-blue-600 font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                      Transfer
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
