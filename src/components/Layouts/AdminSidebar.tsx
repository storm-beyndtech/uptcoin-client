import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../assets/fav.svg';
import { CiGrid42, CiLogout } from 'react-icons/ci';
import { PiUsersFourLight } from 'react-icons/pi';
import { HiOutlineKey } from 'react-icons/hi2';
import { VscMenu } from 'react-icons/vsc';
import { contextData } from '../../context/AuthContext';
import DarkModeSwitcher from './DarkModeSwitcher';
import SidebarDropdown from './SidebarDropdown';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const location = useLocation();
  const { pathname } = location;
  const { logout } = contextData();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`text-xs absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-boxdark duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="h-9 w-auto" />
        </NavLink>
        <DarkModeSwitcher />
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <VscMenu className="fill-current" />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <ul className="mb-10 flex flex-col gap-1.5">
            <li>
              <NavLink
                to="/admin"
                className={`text-xs group relative flex items-center gap-2.5 rounded-sm py-2.5 px-7.5 text-gray-300 font-montserrat duration-300 ease-in-out hover:bg-black dark:hover:bg-black ${
                  pathname === '/admin' && 'bg-black'
                }`}
              >
                <CiGrid42 className="text-xl" />
                Dashboard
              </NavLink>
            </li>

            {/* Users Dropdown Menu */}
            <SidebarDropdown
              title="Users"
              icon={<PiUsersFourLight className="text-xl" />}
              links={[
                { label: 'Add User', href: 'add-user' },
                { label: 'Manage Users', href: 'manage-users' },
                { label: 'Users Account', href: 'users-account' },
                { label: 'Users Account Limit', href: 'users-account-limit' },
              ]}
            />

            {/* Future Groups (Example) */}
            {/* <SidebarDropdown title="Transactions" icon={<TransactionIcon />} links={[...]} /> */}
          </ul>

          <ul className="flex flex-col gap-1.5">
            <li>
              <NavLink
                to="/admin/settings"
                className={`text-xs group relative flex items-center gap-2.5 rounded-sm py-2.5 px-7.5 text-gray-300 font-montserrat duration-300 ease-in-out hover:bg-black dark:hover:bg-black ${
                  pathname.includes('settings') && 'bg-black'
                }`}
              >
                <HiOutlineKey className="text-xl" />
                Settings
              </NavLink>
            </li>
            <NavLink
              to="#"
              className="text-xs group relative flex items-center gap-2.5 rounded-sm py-2.5 px-7.5 text-gray-300 font-montserrat duration-300 ease-in-out hover:bg-black dark:hover:bg-black"
              onClick={() => logout()}
            >
              <CiLogout className="text-xl" />
              Sign out
            </NavLink>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
