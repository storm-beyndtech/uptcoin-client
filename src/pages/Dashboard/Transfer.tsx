import TransferAsset from '@/components/TransferAsset';
import NavigateBack from '@/components/UI/NavigateBack';

export default function Transfer() {
  return (
    <div className="py-5 px-2">
      <h2 className="text-4xl font-medium my-5 max-lg:hidden">
        Transfer Asset
      </h2>
      <div className="p-5 pt-0 text-2xl lg:hidden text-white">
        <NavigateBack />
      </div>
      <TransferAsset />
    </div>
  );
}
