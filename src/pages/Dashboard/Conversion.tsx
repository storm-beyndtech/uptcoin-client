import ConvertAsset from '@/components/ConvertAsset';
import NavigateBack from '@/components/UI/NavigateBack';

export default function Conversion() {
  return (
    <div className="max-lg:pt-5">
      <div className="p-5 pt-0 text-2xl lg:hidden text-white">
        <NavigateBack />
      </div>
      <h2 className="text-4xl font-medium my-5 max-lg:hidden">Convert Asset</h2>
      <ConvertAsset />
    </div>
  );
}
