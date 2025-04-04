import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RxChevronDown } from 'react-icons/rx';

interface SidebarDropdownProps {
  title: string;
  icon: React.ReactNode;
  links: { label: string; href: string }[];
}

export default function SidebarDropdown({
  title,
  icon,
  links,
}: SidebarDropdownProps) {
  const location = useLocation();
  const { pathname } = location;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className={`text-xs group relative flex w-full items-center gap-2.5 rounded-sm py-2.5 px-7.5 text-gray-300 font-montserrat duration-300 ease-in-out hover:bg-black dark:hover:bg-black ${
          links.some((link) => pathname.includes(link.href)) ? 'bg-black' : ''
        }`}
        onClick={() => setOpen(!open)}
      >
        {icon}
        {title}
        <RxChevronDown
          className={`ml-auto transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="text-xs translate transform overflow-hidden">
          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
            {links.map((link, i) => (
              <li key={i}>
                <NavLink
                  to={`/admin/${link.href}`}
                  className={({ isActive }) =>
                    'group relative flex items-center gap-2.5 rounded-md px-7.5 text-white/30 duration-300 ease-in-out hover:text-white ' +
                    (isActive && '!text-white')
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
