import { Eye, EyeOff } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Alert from './UI/Alert';
import { Link } from 'react-router-dom';

interface ModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (password: string) => void;
  title: string;
  isSubmitting: boolean;
  error?: string;
  success?: string;
}

export default function CompleteTransactionModal({
  setIsModalOpen,
  onSubmit,
  isSubmitting,
  error,
  success,
  title,
}: ModalProps) {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur px-2">
      <div className="bg-white max-lg:bg-bodydark2 p-6 rounded-lg w-96 shadow-lg space-y-5">
        <div className="relative mb-4 max-lg:text-white/90">
          <h2 className="text-xl max-sm:text-lg font-medium">Enter {title} Password</h2>
          <CgClose
            className="absolute right-2 top-[50%] translate-y-[-50%] text-xl cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input !text-sm"
              placeholder="* * * * * * * *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <Link to="/dashboard/withdrawal-password">
            <button
              className="px-5 py-1.5 bg-bodydark1 text-white rounded-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Change Password
            </button>
          </Link>

          <button
            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm"
            onClick={() => {
              onSubmit(password);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
