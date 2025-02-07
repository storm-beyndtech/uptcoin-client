import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa'; // Import icons
import logo from '../assets/logo.svg';
import logoMobile from '../assets/fav.svg';
import { X } from 'lucide-react';
import DropdownUser from './UI/DropdownUser';
// import DarkModeSwitcher from './DarkModeSwitcher';

export default function Navbar() {
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
    { title: 'Quick Margin', link: '/margin' },
    { title: 'Market', link: '/market' },
    { title: 'Support', link: '/support' },
    { title: 'Rewards', link: '/rewards' },
    { title: 'Press', link: '/press' },
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
          <img className="h-7 w-auto lg:hidden" src={logoMobile} alt="Logo" />
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

        <DropdownUser />

        <div className="hidden items-center gap-5">
          <div className="flex items-center gap-3 text-xs font-semibold max-lg:hidden">
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

          {/* <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button> */}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 z-50 w-3/4 h-full bg-bodydark2/90 customBlur p-10 transform transition-transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <button className="text-white absolute top-10 right-10">
            <X size={24} />
          </button>

          <div className="space-y-6">
            {navLinks.map((link, index) => (
              <div key={index}>
                {link.submenu ? (
                  <>
                    <span className="text-white/90 block mb-3 text-lg">
                      {link.title}
                    </span>
                    {link.submenu.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subLink.link}
                        className="block px-4 py-3 text-lg text-white/70 font-light hover:bg-bodydark1 rounded-md"
                      >
                        {subLink.title}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={link.link}
                    className="block text-white/70 text-lg font-light hover:text-green-600"
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
