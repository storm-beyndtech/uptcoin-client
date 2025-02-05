import DepositComp from '@/components/DepositComp';
import { symbols } from '@/lib/utils';

export default function Deposit() {
  const userAssets = [
    { symbol: 'BTC', funding: 0.2, spot: 0.19698 },
    { symbol: 'ETH', funding: 0.5, spot: 1.7 },
    { symbol: 'LTC', funding: 3, spot: 0.5 },
    { symbol: 'USDT', funding: 4000, spot: 0 },
  ];

  // Get available coins (excluding ones in wallet)
  const availableCoins = symbols.filter((coin) =>
    userAssets.some((wallet) => wallet.symbol === coin.symbol),
  );

  return (
    <div>
      <DepositComp coins={availableCoins} />
    </div>
  );
}