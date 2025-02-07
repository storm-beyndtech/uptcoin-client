import { heroAvatarLinks } from '@/lib/utils';
import { Link } from 'react-router-dom';
import asset from '../assets/cryptoAsset.png';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-bodydark1 -mt-10">
      <div className="max-ctn py-30 px-5 max-md:pt-40 flex items-center gap-12">
        <div className="w-full max-w-[650px]">
          <h1 className="text-6xl font-semibold max-md:!text-2xl text-white mb-4">
            Join Over 26 Million{' '}
            <span className="text-customGreen my-4 block">
              Active Users Trading{' '}
            </span>{' '}
            Daily With Uptcoin
          </h1>

          <p className="text-white/60 text-lg font-medium mb-10">
            Enjoy 24 hours trading with no limitation
          </p>

          <Link to="/login">
            <button className="bg-white py-3 px-10 rounded-xl font-semibold">
              Get Started <span className="ml-3">&rarr;</span>
            </button>
          </Link>

          <div>
            <div className="relative mt-10 flex w-full max-w-xs items-center">
              {heroAvatarLinks.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="avatar"
                  className={`relative avatar ${
                    i > 0 ? '-ml-5' : ''
                  } [box-shadow:#212121_0px_6px]`}
                  style={{ top: 'auto', left: `0px` }}
                />
              ))}
              <div className="relative left-[-40px] top-auto z-[1] rounded-[30px] bg-bodydark1 py-2 pl-12 pr-3 text-center text-white [box-shadow:#212121_0px_6px]">
                <p className="text-[10px] leading-normal font-semibold">
                  <span className="font-bold">26m+ </span>
                  <br />
                  Clients
                </p>
              </div>
            </div>
          </div>
        </div>

        <img className="w-100 m-auto" src={asset} alt="trade" />
      </div>
    </section>
  );
};

export default Hero;
