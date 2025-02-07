import { useLocation, Link } from 'react-router-dom';
import { TiHome } from 'react-icons/ti';
import { RiBarChartFill, RiTokenSwapFill } from 'react-icons/ri';
import { HiWallet } from 'react-icons/hi2';

const MobileNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className={`fixed bottom-0 z-999999 w-full p-4 flex justify-between items-center lg:hidden customBlur font-semibold
         transition-all bg-bodydark1/85 text-white`}
    >
      <NavItem
        to="/"
        icon={<TiHome />}
        label="Home"
        active={pathname === '/'}
      />
      <NavItem
        to="/market"
        icon={<RiTokenSwapFill />}
        label="Market"
        active={pathname === '/market'}
      />
      <NavItem
        to="/exchange"
        icon={<RiBarChartFill />}
        label="Trade"
        active={pathname.includes('/exchange')}
      />
      <NavItem
        to="/margin"
        icon={<RiTokenSwapFill />}
        label="Futures"
        active={pathname.includes('/margin')}
      />
      <NavItem
        to="/dashboard"
        icon={<HiWallet />}
        label="Assets"
        active={pathname === '/dashboard'}
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
    className={`flex flex-col items-center space-y-1.5 text-2xl transition-all 
    ${active ? 'text-green-400' : 'text-white/80'}`}
  >
    {icon}
    <span className="text-[10px] tracking-wider font-medium leading-none">
      {label}
    </span>
  </Link>
);

export default MobileNav;
