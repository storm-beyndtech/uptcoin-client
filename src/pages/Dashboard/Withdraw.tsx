import AddAddressModal from '@/components/AddAddressModal';
import { Address } from '@/components/ManageAddress';
import WithdrawForm from '@/components/WithdrawForm';
import { symbols, userAssets } from '@/lib/utils';
import { useState } from 'react';

export default function Withdraw() {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState<Address>(userAssets[0]);
  const [addressModalOpen, setIsAddressModalOpen] = useState(false);

  // Get user addresses with usefull fields
  const addresses: Address[] = userAssets.map(({ funding, spot, ...rest }) => ({
    ...rest,
  }));

  // get user assets with some extra fields for withdrawals
  const withdrawAssets = userAssets.map((ass) => {
    const foundSym = symbols.find((symbol) => ass.symbol === symbol.symbol)!;

    return {
      ...ass,
      minWithdraw: foundSym.minWithdraw,
      withdraw: foundSym.withdraw,
      charges: foundSym.charges,
    };
  });

  const onAdd = (address: Address) => {
    setAddress(address);
    setIsAddressModalOpen(false);
  };

  return (
    <div>
      {addressModalOpen && (
        <AddAddressModal
          addresses={addresses}
          address={address}
          onAdd={onAdd}
          setIsModalOpen={setIsAddressModalOpen}
          editing={editing}
          setEditing={setEditing}
        />
      )}
      <WithdrawForm
        withdrawAssets={withdrawAssets}
        setIsAddressModalOpen={setIsAddressModalOpen}
      />
    </div>
  );
}
