import { Coins, Shield, User, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Guide() {
  const steps = [
    {
      icon: <User />,
      title: 'Create Account',
      desc: 'Sign up with your email and get started instantly.',
    },
    {
      icon: <Shield />,
      title: 'Verify Identity',
      desc: 'Secure your account with quick identity verification.',
    },
    {
      icon: <Wallet />,
      title: 'Fund Wallets',
      desc: 'Deposit funds and access 50+ cryptocurrencies.',
    },
    {
      icon: <Coins />,
      title: 'Start Trading',
      desc: 'Buy, sell, and swap crypto anytime, anywhere.',
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-bodydark1">
      <div className="max-ctn mx-auto flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white/90 mb-4">
          Beginner's Guide 🚀
        </h3>
        <p className="text-white/60 text-sm">
          Start your crypto journey in a few simple steps.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-6 bg-bodydark2 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="w-full relative text-green-400 text-3xl">
                <h4 className="text-xl font-semibold tracking-wide text-white/90 mt-4">
                  {step.title}
                </h4>
                <div className="absolute  inset-y-0 right-3 "> {step.icon}</div>
              </div>
              <p className="text-white/50 text-sm mt-2">{step.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/exchange">
          <button className="mt-14 px-6 py-1.5 bg-green-500 hover:bg-green-600 text-white/90 font-semibold text-sm rounded-sm">
            Start Trading
          </button>
        </Link>
      </div>
    </section>
  );
}
