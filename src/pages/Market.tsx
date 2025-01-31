import Footer from '@/components/Footer';
import MarketTable from '@/components/MarketTable';
import Navbar from '@/components/Navbar';

export default function Market() {
  return (
    <div className='pt-20'>
      <Navbar />
      <div className="max-ctn grid place-content-center py-6">
        <h1 className="text-7xl font-bold">Trusted Markets</h1>
      </div>
      <MarketTable />
      <Footer />
    </div>
  );
}
