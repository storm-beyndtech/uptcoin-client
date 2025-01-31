import { FaUserPlus, FaUserShield, FaWallet } from 'react-icons/fa';
import { RiTokenSwapFill } from 'react-icons/ri';

export default function Guide() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="">BEGINNER'S GUIDE</h3>
      <h2 className="text-xl font-medium">Get started in a few minutes!</h2>
      <p>Bitpapy supports a variety of the most popular digital currencies.</p>
      <div className="w-full flex justify-center gap-8 py-5">
        <div className="w-full max-w-[250px] text-center grid gap-4">
          <div className="rounded-full w-20 h-20 grid place-content-center mx-auto bg-blue-500 text-white">
            <FaUserPlus className="text-xl" />
          </div>
          <h3 className="font-semibold">Create account</h3>
          <p>Create your Bitpapy account using a valid email address</p>
        </div>

        <div className="w-full max-w-[250px] text-center grid gap-4">
          <div className="rounded-full w-20 h-20 grid place-content-center mx-auto bg-blue-500 text-white">
            <FaUserShield className="text-xl" />
          </div>
          <h3 className="font-semibold">Verification</h3>
          <p>
            Use the verification code sent to your email address to verify your
            account
          </p>
        </div>

        <div className="w-full max-w-[250px] text-center grid gap-4">
          <div className="rounded-full w-20 h-20 grid place-content-center mx-auto bg-blue-500  text-white">
            <FaWallet className="text-xl" />
          </div>
          <h3 className="font-semibold">Fund wallets</h3>
          <p>
            Fund your Bitpapy wallet and start trading 50+ cryptocurrencies with
            ease
          </p>
        </div>

        <div className="w-full max-w-[250px] text-center grid gap-4">
          <div className="rounded-full w-20 h-20 grid place-content-center mx-auto bg-blue-500 text-white">
            <RiTokenSwapFill className="text-xl" />
          </div>
          <h3 className="font-semibold">Exchange</h3>
          <p>
            You can instantly buy, sell, store, or swap your digital assets 24/7
          </p>
        </div>
      </div>
      <button className="max-w-[200px] px-10 py-3 bg-blue-500 text-white font-medium">
        Start Trading
      </button>
    </div>
  );
}
