import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { navItems } from '../../lib/dashboardUtils';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';
import { contextData } from '../../context/AuthContext';
import PageLoader from '../PageLoader';

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, fetching } = contextData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetching && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [fetching, user, navigate]);

  if (fetching || user?.role === 'admin') return <PageLoader />;

  return (
    <div className="max-ctn max-w-[1400px] min-h-screen bg-[#fafafa] max-lg:bg-bodydark1 py-20">
      {/* Fixed Header */}
      <Navbar />

      {/* Layout container */}
      <div className="grid grid-cols-9 gap-5 relative">
        {/* Fixed Sidebar */}
        <div className="col-span-2 max-lg:hidden">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            navItems={navItems}
          />
        </div>

        {/* Scrollable Main content */}
        <main className="col-span-9 lg:col-span-7 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
