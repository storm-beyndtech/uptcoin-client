import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const whatWeOffer = [
  'Secure Trading Environment: We prioritize the security of your assets. Our platform employs state-of-the-art security measures, including advanced encryption, two-factor authentication (2FA), and cold storage for the majority of our assets to ensure your funds are always safe.',
  'User-Friendly Interface: Whether you are a beginner or an experienced trader, our intuitive platform is designed to cater to your needs. With easy navigation, comprehensive tools, and real-time data, we make trading straightforward and accessible',
  'Wide Range of Cryptocurrencies: We support a diverse selection of cryptocurrencies, from popular coins like Bitcoin and Ethereum to promising altcoins. Our continuously expanding portfolio ensures that you have access to the latest and most exciting digital assets.',
  'Competitive Fees: Enjoy trading with some of the lowest fees in the industry. Our transparent fee structure ensures that there are no hidden costs, allowing you to maximize your profits.',
  'Arbitrage Trading Opportunities: At Bitpapy, we encourage arbitrage trading, enabling you to take advantage of price differences across various markets. Our platform is designed to facilitate efficient arbitrage strategies, helping you to capitalize on market inefficiencies and increase your profitability',
  'Customer Support: Our dedicated support team is available 24/7 to assist you with any questions or issues you may encounter. We are committed to providing prompt and effective support to ensure a smooth trading experience.',
];

export default function About() {
  return (
    <div className="pt-20">
      <Navbar />
      <div className="max-ctn max-w-[1000px] grid">
        <h1 className="text-7xl font-bold py-7">About Us</h1>

        <div className="grid gap-2 mb-10">
          <p className="text-sm text-gray-700 leading-6 mb-4">
            Welcome to Bitpapy, your trusted partner in the world of
            cryptocurrency trading. Founded with the vision of creating a
            secure, user-friendly, and innovative platform, we are committed to
            providing exceptional services to our global community of traders,
            investors, and crypto enthusiasts.
          </p>
        </div>

        <div className="grid gap-2 mb-10">
          <h3 className="font-bold text-lg">Our Mission</h3>
          <p className="text-sm text-gray-700 leading-6">
            At Bitpapy, our mission is to democratize access to the world of
            digital currencies and empower individuals to achieve financial
            freedom. We strive to simplify the complexities of cryptocurrency
            trading while ensuring a secure and seamless experience for our
            users.
          </p>
        </div>

        <div className="grid gap-2 mb-10">
          <h3 className="font-bold text-lg">What We Offer</h3>
          <ul>
            {whatWeOffer.map((offer, i) => (
              <li key={i} className="text-sm text-gray-700 leading-6">
                {offer}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2 mb-10">
          <h3 className="font-bold text-lg"> Our Values</h3>
          <ul>
            <li className="text-sm text-gray-700 leading-6"><b>Transparency: </b>We believe in maintaining open and honest communication with our users. Transparency in our operations, fees, and policies is a cornerstone of our exchange</li>
            <li className="text-sm text-gray-700 leading-6"><b>Innovation: </b>The cryptocurrency landscape is ever-evolving, and so are we. We continuously strive to innovate and enhance our platform with the latest technological advancements to provide you with cutting-edge trading solutions.</li>
            <li className="text-sm text-gray-700 leading-6"><b>Community: </b>We value our community and are dedicated to fostering a collaborative and inclusive environment. Your feedback is crucial in helping us improve and grow.</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
