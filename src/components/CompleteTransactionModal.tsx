import { Eye, EyeOff } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';

interface ModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (password: string) => void;
  title: string;
}

export default function CompleteTransactionModal({
  setIsModalOpen,
  onSubmit,
  title,
}: ModalProps) {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg space-y-5">
        <div className="relative mb-4">
          <h2 className="text-xl font-medium">Enter {title} Password</h2>
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

        {/* Buttons */}
        <div className="flex space-x-5 text-sm">
          <button
            className="px-5 py-1 bg-gray-600 text-white rounded-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-1 bg-green-600 text-white rounded-sm"
            onClick={() => {
              onSubmit(password);
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
