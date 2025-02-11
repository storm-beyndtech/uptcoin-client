import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { navItems } from '@/lib/dashboardUtils';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const chatCtn = document.getElementsByTagName('jdiv')[0] as HTMLElement;
    if (chatCtn) chatCtn.style.display = 'none';

    return () => {
      if (chatCtn) chatCtn.style.display = 'block';
    };
  }, []);

  return (
    <div className="max-ctn max-w-[1400px] bg-[#fafafa] max-lg:bg-bodydark1 py-20">
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
};

export default AdminLayout;
