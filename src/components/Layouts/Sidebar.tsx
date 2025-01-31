import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LogOut, LucideIcon } from 'lucide-react';

export interface NavItems {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  navItems: NavItems[];
}

interface SidelinkProps extends NavItems {
  isActive: boolean;
}

const SidebarLink = ({ to, label, icon: Icon, isActive }: SidelinkProps) => (
  <NavLink
    to={to}
    className={`text-gray-600 relative flex items-center gap-3.5 border-l-4 border-green-500 py-3 pl-5 font-medium ${
      isActive ? 'bg-gray-100' : 'border-opacity-0'
    }`}
  >
    <Icon className="text-xl" strokeWidth={1.5} />
    {label}
  </NavLink>
);

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  navItems,
}: SidebarProps) {
  const { pathname } = useLocation();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (
      !sidebar.current ||
      !trigger.current ||
      sidebar.current.contains(target) ||
      trigger.current.contains(target)
    )
      return;
    setSidebarOpen(false);
  };

  const handleEscKeyPress = ({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) setSidebarOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscKeyPress);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [sidebarOpen]);

  // Define a function to check if a path is active
  const checkIsActive = (path: string) => pathname === path;

  return (
    <div
      className={`${
        sidebarOpen
          ? 'w-screen h-screen bg-black/20 z-[6000] fixed top-0 left-0 cursor-pointer'
          : ''
      }`}
      onClick={() => setSidebarOpen(false)}
    >
      <aside
        ref={sidebar}
        className={`w-full fixed right-0 top-0 z-[5000] flex h-[100vh] flex-col pb-3 overflow-y-hidden shadow-1 bg-white duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full no-scrollbar flex flex-col justify-between overflow-y-auto">
          <nav className="">
            <ul className="flex flex-col">
              {navItems.map(({ to, label, icon }) => (
                <SidebarLink
                  key={to}
                  to={to}
                  label={label}
                  icon={icon}
                  isActive={checkIsActive(to)}
                />
              ))}

              <button
                className={`group relative flex items-center gap-3.5 pt-7.5 pl-6 border-t border-slate-200 font-medium`}
              >
                <LogOut className="text-xl text-red-400" />
                Logout
              </button>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
