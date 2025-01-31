import heroBg from '../assets/home_head_bg.png';

export default function Hero() {
  return (
    <div
      className="max-ctn h-[70vh] flex items-center p-10"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundPositionY: 'center',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-[500px] text-gray-900">
        <h1 className="text-5xl  font-bold">Join over 26 million</h1>
        <p className="text-xl mt-2">
          worldwide who have already chosen the{' '}
          <span className="font-bold">Uptcoin Group</span>
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
      </div>
    </div>
  );
}
