import TransferAsset from '@/components/TransferAsset';

export default function Transfer() {
  return (
    <div className="py-10 px-2">
      <h2 className="text-4xl font-medium my-5 max-lg:hidden">
        Transfer Asset
      </h2>
      <TransferAsset />
    </div>
  );
}
