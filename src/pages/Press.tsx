import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Press() {
  return (
    <div className='pt-20'>
      <Navbar />
      <div className="max-ctn max-w-[1000px] grid">
        <h1 className="text-7xl font-bold py-7">Press</h1>

        <div className="grid gap-2 mb-10">
          <h3 className="font-bold text-lg">ONE TRADER AT A TIME</h3>
          <p className="text-sm text-gray-700 leading-6 mb-4">
            We're Uptcoin, a financial service that makes it fast, safe and fun
            to buy digital currency, anywhere in the world. We believe that the
            future of money is one where we, the people, are in control of our
            own economy. A future where there's no place for middle-men, hidden
            fees and fine print.
          </p>
          <p className="text-sm text-gray-700 leading-6">
            To deliver on that promise, we have come to work every day since
            2019 to create the simplest financial service out there — spoken in
            a language you can understand, and backed by customer service you
            can count on.
          </p>
        </div>

        <div className="grid gap-2 mb-10">
          <h3 className="font-bold text-lg">BECOME A TRADER</h3>
          <p className="text-sm text-gray-700 leading-6 mb-4">
            We intend to make Uptcoin, a platform for all day traders, we intend
            to maintain speedy fill of trade orders. Due to this, we have put a
            limit to the amount and number of times one can trade on our
            platform per day. A trader is required to trade with minimum amount
            of $2000 worth of any cryptocurrency listed on our exchange.
            However, We offer two trading levels which are the individual level
            and institutional level, the individual level allow users to buy and
            sell on and outside our exchange, this has a minimum trade amount of
            $10,000 and it allows you trade up to 5 times a day as it maintains
            a trade fee of 0.075% while the institutional trade level allow
            institutions buy from other exchanges in bulk quantity and sell to
            us (usually minimum of $30,000). Institutions can trade up to 10
            times a day and it maintains a trade fee of 0.0525%.
          </p>
          <p className="text-sm text-gray-700 leading-6">
            Note that, when you trade more than five times in a day as an
            individual trader, there will be an automatic upgrade of account
            which would require you trade $30,000 worth of any coin listed on
            our exchange so as to be able to trade as an institution .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
