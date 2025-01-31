import BannerSlides from '@/components/BannerSlides';
import Footer from '@/components/Footer';
import Guide from '@/components/Guide';
import Hero from '@/components/Hero';
import Join from '@/components/Join';
import Journey from '@/components/Journey';
import MarketTable from '@/components/MarketTable';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="relative pt-20">
      <Navbar />
      <Hero />
      <BannerSlides />
      <MarketTable />
      <Journey />
      <Guide />
      <Join />
      <Footer />
    </div>
  );
}
