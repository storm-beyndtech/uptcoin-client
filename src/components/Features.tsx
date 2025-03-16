import {
  BarChart,
  Puzzle,
  Zap,
  Globe2,
  FileText,
  Headset,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Headset />,
      title: 'User Support',
      desc: 'Get dedicated support from our team around the clock for all your trading needs.',
    },
    {
      icon: <BarChart />,
      title: 'Smart Organization',
      desc: 'Effortlessly manage and track your trading portfolios with intuitive tools.',
    },
    {
      icon: <Puzzle />,
      title: 'Adaptable Strategies',
      desc: 'Customize trading strategies to align with your financial goals and risk tolerance.',
    },
    {
      icon: <Zap />,
      title: 'Swift Execution',
      desc: 'Experience lightning-fast trade execution for optimal market performance.',
    },
    {
      icon: <Globe2 />,
      title: 'Quality Investments',
      desc: 'Access a diverse range of high-quality investment opportunities globally.',
    },
    {
      icon: <FileText />,
      title: 'Resource Optimization',
      desc: 'Maximize your trading efficiency with our advanced resource management tools.',
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-bodydark1">
      <div className="max-ctn mx-auto flex flex-col items-center">
        <h3 className="w-full text-3xl font-bold text-white/90 mb-3 text-center">
          Key Features
        </h3>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-bodydark2 rounded-xl shadow-xl transform hover:-translate-y-2 transition duration-300"
            >
              <div className="flex items-center justify-between text-green-400 text-4xl">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-white/90 mt-5">
                {feature.title}
              </h4>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
