import { CgSpinner } from 'react-icons/cg';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

type dataProp = {
  type?: 'primary' | 'small' | 'auth';
  label?: string;
  disabled?: boolean;
  btnAction?: 'button' | 'submit' | 'reset' | undefined;
  direction?: 'left' | 'right';
  onClick?: () => void;
  enabled?: boolean;
  className?: string;
};

export default function Btn({
  type,
  label,
  disabled,
  btnAction,
  direction,
  onClick,
  enabled,
  className,
}: dataProp) {
  switch (type) {
    case 'primary':
      return (
        <button
          onClick={onClick}
          aria-label={label}
          disabled={disabled}
          type={btnAction}
          className={`${className} text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold rounded-lg px-5 py-2.5 text-center inline-flex items-center justify-center whitespace-nowrap ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {disabled ? <CgSpinner className="w-5 h-5 text-white spin mx-auto" /> : label}
        </button>
      );

    case 'auth':
      return (
        <button
          onClick={onClick}
          aria-label={label}
          disabled={disabled}
          type={btnAction}
          className={`${className} bg-blue-600 text-white py-3 px-7.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {disabled ? <CgSpinner className="w-5 h-5 text-white spin mx-auto" /> : label}
        </button>
      );

    case 'small':
      return (
        <div
          onClick={enabled ? onClick : undefined}
          className={`w-12 h-12 grid place-content-center rounded-xl cursor-pointer 
              bg-blue-500/5 text-xl transition-colors duration-200
              ${
                enabled
                  ? 'text-brandBlue1 hover:bg-blue-500/10'
                  : 'text-brandBlue1/20 cursor-not-allowed'
              }`}
        >
          {direction === 'left' ? <FaArrowLeftLong /> : <FaArrowRightLong />}
        </div>
      );

    default:
      return;
  }
}
