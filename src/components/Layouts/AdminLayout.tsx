import { useState } from "react";
import { Outlet } from "react-router-dom";
import { contextData } from "../../context/AuthContext";
import PageLoader from "../PageLoader";
import Header from "../Header";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { fetching } = contextData();

  if (fetching) return <PageLoader />;
  
	return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
	);
}
