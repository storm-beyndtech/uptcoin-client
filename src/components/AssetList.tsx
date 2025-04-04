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
  name: string;
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
    <>
      <div className="p-4 bg-white rounded-sm shadow-default max-lg:hidden">
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
                <tr
                  key={asset.symbol}
                  className="border-t text-sm font-semibold"
                >
                  <td className="px-3 py-4 flex items-center space-x-2">
                    <img
                      src={
                        asset.symbol !== 'USDT'
                          ? asset.image
                          : `https://assets.coincap.io/assets/icons/tether2@2x.png`
                      }
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
                  <td className="space-x-2 pr-1">
                    <div className="mx-auto flex gap-1 flex-nowrap">
                      <Link to={`/dashboard/deposit/${asset.symbol}`}>
                        <button className="bg-green-500 font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                          deposit
                        </button>
                      </Link>

                      <Link to={`/dashboard/withdraw/${asset.symbol}`}>
                        <button className="bg-gray-700 font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                          withdraw
                        </button>
                      </Link>

                      <Link to={`/dashboard/transfer/${asset.symbol}`}>
                        <button className="bg-blue-700 font-medium text-white px-3 py-1.5 rounded-sm hover:opacity-80">
                          transfer
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden p-3 space-y-4">
        <div className="flex justify-between items-center mb-7.5">
          <h2 className="text-lg font-semibold text-white/90">Asset List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-[#28292a] text-sm text-white px-3 py-1 rounded-lg hover:opacity-80"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Asset
          </button>
        </div>

        {assets.map((asset, i) => (
          <Link
            key={i}
            to={`/dashboard/asset/${asset.symbol}`}
            className="grid grid-cols-3 p-4 bg-bodydark2 rounded-lg 
            cursor-pointer text-white/50 text-xs"
          >
            <div className="space-y-1 col-span-1">
              <p>Funding</p>
              <p className="text-white">
                {' '}
                {asset.symbol === 'USDT'
                  ? asset.funding.toFixed(2)
                  : asset.funding.toFixed(6)}
              </p>
            </div>

            <div className="space-y-1 col-span-1">
              <p>Spot</p>
              <p className="text-white">
                {' '}
                {asset.symbol === 'USDT'
                  ? asset.spot.toFixed(2)
                  : asset.spot.toFixed(6)}
              </p>
            </div>

            <div className="space-y-1 col-span-1 text-right">
              <p>{asset.name}</p>
              <p className="text-white">
                {asset.equivalent.toFixed(2)}{' '}
                <span className="text-green-300/80">USDT</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AssetList;
