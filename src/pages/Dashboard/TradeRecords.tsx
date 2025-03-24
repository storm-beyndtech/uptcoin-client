import { AssetTransactions } from '@/components/OverviewComps';

export default function TradeRecords() {
  return (
    <div className='py-10 px-4'>
      <h3 className="font-medium text-xl mb-4 text-gray-500 max-lg:text-gray-300">Trade Records</h3>
      <AssetTransactions />
    </div>
  );
}
