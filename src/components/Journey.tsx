import manage from '../assets/journey/manage.svg';
import credit from '../assets/journey/credit.svg';
import safe from '../assets/journey/safe.svg';
import banner from '../assets/advantage-bg.png';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Journey() {
  return (
    <div className="max-ctn flex justify-center items-center flex-wrap gap-10 py-20">
      <div className="grid gap-8">
        <div className="w-full max-w-100 flex gap-3">
          <img src={manage} alt="manage" className="w-10 h-10" />
          <p>Manage your assets: Spot trading with up to 5x leverage</p>
        </div>

        <div className="w-full max-w-100 flex gap-3">
          <img src={credit} alt="manage" className="w-10 h-10" />
          <p>
            credit card payment: Buy cryptocurrency with your credit card
            through our partners
          </p>
        </div>

        <div className="w-full max-w-100 flex gap-3">
          <img src={safe} alt="manage" className="w-10 h-10" />
          <p>
            safe storage: Client funds are held in a dedicated multi-signature
            in a cold wallet. 24/7 security monitoring Dedicated 32,000 BTC
            safety reserve
          </p>
        </div>

        <div className="w-full max-w-100 grid gap-3">
          <p className="text-sm">
            access anywhere Our mobile apps for Android and iOS are coming up
            soon Weather deposits, withdrawals and
          </p>

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
