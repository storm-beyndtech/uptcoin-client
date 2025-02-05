import { useLocation, Link } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiBriefcase,
  FiLayers,
  FiCreditCard,
} from 'react-icons/fi';

const MobileNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className={`fixed bottom-0 w-full p-4 flex justify-between items-center lg:hidden customBlur font-semibold
         transition-all bg-white/85 text-gray-800 dark:bg-bodydark1/85 dark:text-white`}
    >
      <NavItem
        to="/"
        icon={<FiHome />}
        label="Home"
        active={pathname === '/'}
      />
      <NavItem
        to="/market"
        icon={<FiBarChart2 />}
        label="Market"
        active={pathname === '/market'}
      />
      <NavItem
        to="/trade"
        icon={<FiLayers />}
        label="Trade"
        active={pathname === '/trade'}
      />
      <NavItem
        to="/margin"
        icon={<FiBriefcase />}
        label="Margin"
        active={pathname === '/margin'}
      />
      <NavItem
        to="/assets"
        icon={<FiCreditCard />}
        label="Assets"
        active={pathname === '/assets'}
      />
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center space-y-1 text-sm transition-all 
    ${active ? 'text-white font-semibold' : 'text-gray-400'}`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default MobileNav;
