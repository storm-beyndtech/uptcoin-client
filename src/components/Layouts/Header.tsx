import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';
import {
  Bell,
  Search,
  User,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [pendingKycUsers, setPendingKycUsers] = useState([]);
  const { logout } = contextData();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const usersData = await sendRequest('/auth/users', 'GET');
      setPendingKycUsers(
        usersData.filter((user: any) => user.kycStatus === 'pending'),
      );
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.pathname]);

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationDropdown(false);
    setShowProfileDropdown(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowUserDropdown(false);
    setShowNotificationDropdown(false);
  };

  return (
    <header className="bg-white dark:bg-bodydark1/40 shadow-sm z-10">
      <div className="flex items-center gap-2 justify-between h-16 px-6">
        <button
          aria-controls="sidebar"
          onClick={(e) => {
            e.stopPropagation();
            props.setSidebarOpen(!props.sidebarOpen);
          }}
          className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-gray-950 lg:hidden"
        >
          <span className="relative block h-5.5 w-5.5 cursor-pointer">
            <span className="du-block absolute right-0 h-full w-full">
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!w-full delay-300'
                }`}
              ></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && 'delay-400 !w-full'
                }`}
              ></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!w-full delay-500'
                }`}
              ></span>
            </span>
            <span className="absolute right-0 h-full w-full rotate-45">
              <span
                className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!h-0'
                }`}
              ></span>
              <span
                className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                  !props.sidebarOpen && '!h-0 !delay-200'
                }`}
              ></span>
            </span>
          </span>
        </button>

        {/* Search */}
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-bodydark2 rounded-md bg-gray-50 dark:bg-bodydark2/30 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Notifications with Dropdown */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              onClick={toggleNotificationDropdown}
            >
              <Bell size={20} />
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-bodydark1/90 customBlur rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                <div className="py-2">
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                    Notifications
                  </h3>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <Link
                      to="/admin/manage-deposits"
                      className="block px-4 py-2 text-sm text-green-600 dark:text-green-400 font-medium"
                    >
                      View all deposits
                    </Link>
                    <Link
                      to="/admin/manage-withdrawals"
                      className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium"
                    >
                      View all withdrawals
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Management */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              onClick={toggleUserDropdown}
            >
              <ShieldCheck size={20} />
              {pendingKycUsers.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {pendingKycUsers.length}
                </span>
              )}
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-bodydark1/90 customBlur rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <div className="max-h-64 overflow-y-auto">
                    {pendingKycUsers.length > 0 ? (
                      <>
                        <h4 className="px-4 py-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                          Pending KYC Requests ({pendingKycUsers.length})
                        </h4>
                        {pendingKycUsers.map((user: any) => (
                          <Link
                            key={user.uid}
                            to={`/admin/manage-user/${user._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-800"
                          >
                            <span className="font-medium">ID: {user.uid}</span>
                            <div className="text-xs mt-2">
                              Status:{' '}
                              <span className="text-[10px] text-orange-500 border border-orange-400 rounded-full px-2 py-[2px] ml-3">
                                {user.kycStatus}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No pending KYC requests
                      </p>
                    )}
                  </div>

                  <Link
                    to="/admin/manage-users"
                    className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="hidden md:inline-block">Admin</span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-bodydark1/90 customBlur rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Link>
                  <div
                    onClick={() => logout()}
                    className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
