import ConversionTable from '@/components/ConversionTable';
import ConvertAsset from '@/components/ConvertAsset';
import NavigateBack from '@/components/UI/NavigateBack';
import { useState } from 'react';

export default function Conversion() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="max-lg:pt-5">
      {!showHistory && <div className="flex items-center justify-between mb-5 p-5 lg:hidden">
        <div className="text-2xl text-white">
          <NavigateBack />
        </div>

        <button
          className="font-semibold text-green-500 max-lg:text-green-300"
          onClick={() => setShowHistory(true)}
        >
          History
        </button>
      </div>
      }
      {!showHistory && <button
        className="my-3 font-semibold text-green-500 max-lg:text-green-300 max-lg:hidden"
        onClick={() => setShowHistory(true)}
      >
        History
      </button>}

      {showHistory ? (
        <ConversionTable setShowHistory={setShowHistory} />
      ) : (
        <ConvertAsset />
      )}
    </div>
  );
}
