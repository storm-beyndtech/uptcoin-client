import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import Navbar from '@/components/Navbar';
import SupportForm from '@/components/supportForm';

export default function Support() {
  return (
    <div className="pt-20 max-lg:bg-bodydark1 max-lg:min-h-screen">
      <Navbar />
      <SupportForm />

      <div className="lg:hidden">
        <MobileNav />
      </div>

      <div className="max-lg:hidden">
        <Footer />
      </div>
    </div>
  );
}
