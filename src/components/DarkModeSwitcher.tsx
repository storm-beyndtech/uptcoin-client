import { useEffect, useState } from 'react';
import useColorMode from '../hooks/useColorMode';
import { MdOutlineLightMode } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [isDark, setIsDark] = useState(colorMode === 'dark');

  useEffect(() => {
    setIsDark(colorMode === 'dark');
  }, [colorMode]);

  return (
    <div>
      <label
        className={`relative block h-7.5 w-14 rounded-full transition-colors duration-300 cursor-pointer border border-customGreen/15 ${
          isDark ? 'bg-bodydark2' : 'bg-gray-300'
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            const newMode = isDark ? 'light' : 'dark';
            if (typeof setColorMode === 'function') setColorMode(newMode);
          }}
          className="absolute top-0 z-50 m-0 h-full w-full opacity-0 cursor-pointer"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 ${
            isDark
              ? 'translate-x-full bg-bodydark1 text-customGreen'
              : 'bg-white text-gray-700'
          }`}
        >
          {isDark ? <FaMoon size={16} /> : <MdOutlineLightMode size={16} />}
        </span>
      </label>
    </div>
  );
};

export default DarkModeSwitcher;
