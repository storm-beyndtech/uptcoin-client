import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Search,
  Settings,
  Home,
  ScrollText,
  Users,
  ChartCandlestick,
  Globe,
  MessageSquare,
  ChevronDown,
  Coins,
  Gift,
} from 'lucide-react';

type NavItemType = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
};

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({
    analytics: false,
    users: false,
    ecommerce: false,
  });

  const navItems: NavItemType[] = [
    {
      icon: <Globe size={20} />,
      label: 'Main Website',
      href: '/',
    },
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      href: '/admin',
    },
    {
      icon: <Users size={20} />,
      label: 'Users',
      subItems: [
        { label: 'Add User', href: '/admin/add-user' },
        { label: 'Manage Users', href: '/admin/manage-users' },
        { label: 'Users Account', href: '/admin/users-account' },
        { label: 'User Account Limit', href: '/admin/account-limit' },
      ],
    },
    {
      icon: <ScrollText size={20} />,
      label: 'Transactions',
      subItems: [
        { label: 'Deposit', href: '/admin/deposit' },
        { label: 'Withdraw', href: '/admin/withdraw' },
      ],
    },
    {
      icon: <ChartCandlestick size={20} />,
      label: 'Trader',
      subItems: [
        { label: 'Manage Traders', href: '/admin/manage-traders' },
        { label: 'Trade History', href: '/admin/trade-history' },
      ],
    },
    {
      icon: <Coins size={20} />,
      label: 'Manage Assets',
      href: '/admin/manage-assets',
    },
    {
      icon: <Gift size={20} />,
      label: 'Affiliates',
      href: '/admin/affiliates',
    },
    {
      icon: <MessageSquare size={20} />,
      label: 'Messages',
      href: '/admin/messages',
    },
  ];

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 bg-indigo-500 rounded text-white font-bold text-lg">
              A
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 font-semibold text-lg">Admin</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="mt-4 px-2 overflow-y-auto"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                {!item.subItems ? (
                  // Regular nav item
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                  >
                    <span className="inline-flex items-center justify-center">
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </a>
                ) : (
                  // Group with subitems
                  <div>
                    <button
                      onClick={() => toggleGroup(item.label.toLowerCase())}
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center">
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            expandedGroups[item.label.toLowerCase()]
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Subitems */}
                    {(expandedGroups[item.label.toLowerCase()] ||
                      sidebarCollapsed) && (
                      <ul
                        className={`mt-1 pl-8 space-y-1 ${
                          sidebarCollapsed
                            ? 'absolute left-16 top-auto z-10 w-48 bg-gray-800 p-2 rounded-md shadow-lg'
                            : ''
                        }`}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={subItem.href}
                              className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors text-sm"
                            >
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Search */}
            <div className="flex items-center flex-1">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                <Settings size={20} />
              </button>

              {/* User Profile */}
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="hidden md:inline-block">Admin User</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Dashboard Overview
            </h1>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {['Total Users', 'Revenue', 'Orders', 'Products'].map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  >
                    <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      {item}
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {index === 0
                        ? '12,345'
                        : index === 1
                          ? '$34,567'
                          : index === 2
                            ? '1,234'
                            : '567'}
                    </p>
                    <div className="flex items-center mt-4 text-sm">
                      <span
                        className={`text-${
                          index % 2 === 0 ? 'green' : 'red'
                        }-500`}
                      >
                        {index % 2 === 0 ? '+12.5%' : '-4.3%'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        from last month
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>

              {/* Sample content */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      <User size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        User {1000 + item} performed an action
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item} hour{item !== 1 ? 's' : ''} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
