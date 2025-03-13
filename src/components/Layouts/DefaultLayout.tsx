import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { navItems } from '../../lib/dashboardUtils';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
