import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { navItems } from '../../lib/dashboardUtils';
// import { contextData } from '../../context/AuthContext';
// import PageLoader from '../PageLoader';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(Navigate);
  // const { user, fetching } = contextData(); // Fetch profile from context

  // // Show loading while fetching user or profile data
  // if (fetching) return <PageLoader />;

  // if (!user.isCompletedProfile) {
  //   return <Navigate to="/auth/patient/update-profile" replace />;
  // }

  // if (!user.isHRABooked) {
  //   return <Navigate to="/auth/patient/HRA" replace />;
  // }

  return (
    <div className="max-ctn max-w-[1400px] bg-[#fafafa] pt-18">
      {/* Fixed Header */}
      <Navbar />

      {/* Layout container */}
      <div className="grid grid-cols-9 gap-5 relative">
        {/* Fixed Sidebar */}
        <div className="col-span-2">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            navItems={navItems}
          />
        </div>

        {/* Scrollable Main content */}
        <main className="col-span-7 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
