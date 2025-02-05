import {
  AccountBalance,
  AssetTransactions,
  PressRelease,
  UserProfile,
} from '@/components/OverviewComps';

export default function UserOverview() {
  return (
    <div className="grid gap-5 pr-5">
      <UserProfile
        email="beyndtech@gmail.com"
        verified={true}
        uid="7154949378"
        tradingStatus="Non Trader"
        tradingLevel="None"
        tradingLimit="None"
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AccountBalance />
        </div>
        <div className="col-span-1">
          <PressRelease />
        </div>
      </div>

      <div className="grid mt-10">
        <h3 className="font-semibold">Assets Transaction</h3>
        <AssetTransactions />
      </div>
    </div>
  );
}
