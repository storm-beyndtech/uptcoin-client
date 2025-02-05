import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Alert from './UI/Alert';
import { Asset, SymbolMargin } from '@/lib/utils';
import CompleteTransactionModal from './CompleteTransactionModal';

type WithdrawAsset = Asset &
  Pick<SymbolMargin, 'minWithdraw' | 'charges' | 'withdraw'>;

interface WithdrawFormProps {
  withdrawAssets: WithdrawAsset[];
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function WithdrawForm({
  withdrawAssets,
  setIsAddressModalOpen,
}: WithdrawFormProps) {
  const { symbol } = useParams();
  const [selectedAsset, setSelectedAsset] = useState<WithdrawAsset>(
    withdrawAssets[0],
  );
  const [amount, setAmount] = useState<number>(0);
  const [submitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    if (symbol) {
      const asset = withdrawAssets.find((asset) => asset.symbol === symbol);
      if (asset) setSelectedAsset(asset);
    }
  }, [symbol]);

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = withdrawAssets.find(
      (asset) => asset.symbol === e.target.value,
    );
    if (selected) setSelectedAsset(selected);
  };

  const handleSubmit = (password: string) => {
    console.log(password);
  };

  return (
    <>
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-7">
        <h2 className="text-xl font-medium">Withdraw Funds</h2>

        <div>
          <label className="text-sm font-medium mb-2.5 text-gray-500">
            Select Asset
          </label>
          <select
            className="input !text-sm"
            value={selectedAsset?.symbol || ''}
            onChange={handleAssetChange}
          >
            <option value="" disabled>
              Choose an Asset
            </option>
            {withdrawAssets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.name} ({asset.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2.5 text-gray-500">
            Network
          </label>
          <input
            type="text"
            value={selectedAsset.network}
            disabled
            className="input !text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-gray-500">
            <label>Address</label>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="text-blue-500 flex items-center gap-1"
            >
              <Edit2 size={10} /> Change Address
            </button>
          </div>
          <input
            type="text"
            value={selectedAsset.address}
            disabled
            className="input !text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-gray-500">
            <label>Amount ({selectedAsset.symbol})</label>
            <p className="text-blue-500">
              Balance: {selectedAsset.funding} {selectedAsset.symbol}
            </p>
          </div>
          <input
            type="number"
            min={selectedAsset.minWithdraw}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input !text-sm"
          />
        </div>

        <Alert
          type="warning"
          message={`Minimum withdrawal amount is ${selectedAsset.minWithdraw} ${selectedAsset.symbol}. Withdrawals below this amount will not be processed.`}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={() => setIsSubmitModalOpen(true)}
        >
          Submit
        </button>
      </div>

      {submitModalOpen &&
        <CompleteTransactionModal
          setIsModalOpen={setIsSubmitModalOpen}
          onSubmit={handleSubmit}
          title="Withdrawal"
        />
      }
    </>
  );
}
