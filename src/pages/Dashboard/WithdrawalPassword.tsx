import Alert from '@/components/UI/Alert';
import { useState } from 'react';

export default function WithdrawalPassword() {
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  // Validate the form
  const validateForm = (): boolean => {
    const validationErrors: string[] = [];
    if (password1.length < 3) validationErrors.push('Invalid Password.');
    if (password2.length < 3) validationErrors.push('Invalid Password.');
    if (password1 !== password2)
      validationErrors.push("Passwords Doesn't Match.");
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        password1,
      };
      console.log(formData);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
      <h3 className="font-semibold">Setup withdrawal password</h3>
      <Alert
        type="simple"
        message="For fund security, withdrawals are disabled for 24 hours after changing
        your login password."
      />

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter New Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Re-type New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="text-sm px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
