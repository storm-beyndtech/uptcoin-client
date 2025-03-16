import banner from '../assets/advantage-bg.png';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Journey() {
  return (
    <div className="max-ctn flex justify-center items-center flex-wrap gap-10 pb-20">
      <div className="w-full max-w-115 space-y-6">
        <div className="space-y-4 text-sm text-gray-500">
          <h2 className="text-5xl font-bold mb-5 text-bodydark2">
            We're Optimized <br />
            For Perfomance
          </h2>
          <p>
            <span className="text-gray-700 font-bold">Manage Your Assets:</span>{' '}
            Spot trading with up to 5x leverage
          </p>
          <p>
            <span className="text-gray-700 font-bold">
              Credit Card Payment:
            </span>{' '}
            Buy cryptocurrency with your credit card through our partners
          </p>
          <p>
            <span className="text-gray-700 font-bold"> Safe Storage:</span>{' '}
            Client funds are held in a dedicated multi-signature cold wallet.
            24/7 security monitoring 32,000 BTC safety reserve
          </p>
          <p>
            access anywhere Our mobile apps for Android and iOS are coming up
            soon Weather deposits, withdrawals and
          </p>
        </div>

        <div className="w-full">
          <div className="flex gap-5">
            <a
              href="https://download.mql5.com/cdn/mobile/mt5/android?utm_source=www.metatrader5.com&utm_campaign=install.metaquotes"
              className="primaryBtn flex gap-4 items-center py-1"
            >
              <FaApple className="text-2xl" />
              <div className="mb-1">
                <p className="font-extralight text-[10px] text-gray-400">
                  Download From
                </p>
                <p className="text-xs">Play Store</p>
              </div>
            </a>

            <a
              href="https://download.mql5.com/cdn/mobile/mt5/ios?utm_source=www.metatrader5.com&utm_campaign=install.metaquotes"
              className="primaryBtn flex gap-4 items-center py-1"
            >
              <FaGooglePlay className="text-2xl" />
              <div className="mb-1">
                <p className="font-extralight text-[10px] text-gray-400">
                  Download From
                </p>
                <p className="text-xs">App Store</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <img src={banner} alt="banner" className="w-full max-w-[600px]" />
    </div>
  );
}
