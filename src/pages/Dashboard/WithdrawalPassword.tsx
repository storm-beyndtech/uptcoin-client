import Alert from '@/components/UI/Alert';
import { useState } from 'react';

export default function WithdrawalPassword() {
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [loading, setLoading] = useState(false);
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

      setLoading(true)
    }
  };

  return (
    <div className="w-full max-w-lg bg-white max-lg:bg-transparent p-5 max-lg:pt-10 rounded">
      <h3 className="font-semibold max-lg:text-white">
        Setup withdrawal password
      </h3>
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
          <label className="label">Password</label>
          <input
            type="text"
            className="input"
            placeholder="Enter New Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input
            type="text"
            className="input"
            placeholder="Re-type New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
