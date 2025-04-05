import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import logoMobile from '../assets/fav.svg';
import { LogOut, X } from 'lucide-react';
import DropdownUser from './UI/DropdownUser';
import { contextData } from '@/context/AuthContext';
import { navItems } from '@/lib/dashboardUtils';
import { FaCaretDown } from 'react-icons/fa';
import { UserProfile } from './OverviewComps';

export default function Navbar() {
  const { user, logout } = contextData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links array
  const navLinks = [
    {
      title: 'Buy Crypto',
      link: '',
      submenu: [
        { title: 'Banxa', link: '' },
        { title: 'Simplex', link: '' },
      ],
    },
    { title: 'Exchange', link: '/exchange' },
    { title: 'Wallet', link: '/wallet' },
    { title: 'Quick Margin', link: '/margin' },
    { title: 'Market', link: '/market' },
    { title: 'Support', link: '/support' },
  ];

  return (
    <header
      id="navBar"
      className="w-full top-0 left-0 z-40 bg-[#151617] font-inter transition-all fixed"
    >
      <nav className="max-ctn flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/">
          <img className="h-6 w-auto hidden lg:block" src={logo} alt="Logo" />
          <img className="h-8 w-auto lg:hidden" src={logoMobile} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navLinks.map((link, index) => (
            <div key={index} className="relative group">
              {link.submenu ? (
                <>
                  <button className="text-white text-sm font-medium flex items-center gap-1">
                    <span>{link.title}</span>
                    <FaCaretDown />
                  </button>
                  <div className="w-30 absolute left-0 top-2 hidden overflow-hidden mt-2 bg-gray-900 text-white rounded-lg shadow-sm group-hover:block">
                    {link.submenu.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subLink.link}
                        className="block p-3 text-sm hover:bg-green-500"
                      >
                        {subLink.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.link}
                  className="text-white text-sm font-medium hover:text-green-600"
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {user && (
            <div onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <DropdownUser />
            </div>
          )}
          {!user && (
            <div className="flex items-center gap-3 text-xs font-semibold">
              <Link
                to="/login"
                className="py-1.5 px-4 border-[1px] border-white/50 text-white rounded-md"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="py-2 px-4 bg-green-600 text-white rounded-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 z-999999 w-[95%] h-screen overflow-y-scroll bg-bodydark1/95 customBlur pt-14 pl-5 transform transition-transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            className="text-white absolute top-5 right-5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>

          <div className="space-y-8 mb-30 pl-3">
            {user && (
              <UserProfile
                email={user.email}
                verified={user.kycStatus === 'approved' ? true : false}
                uid={user?.uid}
                tradingStatus={user.tradingStatus}
                tradingLevel={user.tradingLevel}
                tradingLimit={user.tradingLimit}
              />
            )}
            {navItems.map(({ icon: Icon, label, to }, i) => (
              <Link
                onClick={() => setMobileMenuOpen(false)}
                key={i}
                to={to}
                className="flex items-center gap-3 text-lg text-white/70 hover:text-green-600 space-x-2"
              >
                <Icon /> {label}
              </Link>
            ))}

            <button
              className="flex items-center gap-3 text-lg text-white/70 hover:text-green-600 space-x-2"
              onClick={logout}
            >
              <LogOut className="text-xl text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
