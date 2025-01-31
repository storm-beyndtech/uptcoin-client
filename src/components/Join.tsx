import joinBg from '../assets/community_bg.png';
import { ImFacebook2 } from 'react-icons/im';
import { ImLinkedin } from 'react-icons/im';
import { FaWhatsappSquare } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

export default function Join() {
  return (
    <div
      className="max-ctn h-[80vh] flex items-center p-10"
      style={{
        backgroundImage: `url(${joinBg})`,
        backgroundPositionY: 'center',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-[500px] text-gray-900">
        <h1 className="text-3xl  font-bold">Join the Bitpapy Group Today</h1>
        <p className="text-xl mt-2">
          Always there for you anytime, anywhere, and anyday
        </p>

        <div className="grid gap-4 mt-5">
          <p className="text-xl mt-2">
            Enjoy 24 hours trading with no limitation
          </p>

          <form className="flex gap-4 items-center">
            <input
              type="email"
              className="w-full max-w-70 px-4 py-3 border border-gray-800 rounded-lg bg-transparent"
              placeholder="Enter email address"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg"
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 text-4xl py-4">
          <ImFacebook2 className="blue-500" />
          <ImLinkedin className="blue-500" />
          <FaWhatsappSquare className="text-[40px]" />
          <FaSquareXTwitter className="text-[40px]" />
        </div>
      </div>
    </div>
  );
}
