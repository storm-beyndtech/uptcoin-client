import Alert from '@/components/UI/Alert';
import { contextData } from '@/context/AuthContext';
import { sendRequest } from '@/lib/sendRequest';
import { FormEvent, useState } from 'react';

export default function ChangePassword() {
  const { user } = contextData();
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  //Submit password
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (newPassword.length < 3) {
      setError('New password is too short.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const requestData: any = {
      userId: user._id,
      newPassword: newPassword,
      currentPassword: currentPassword,
    };

    try {
      setLoading(true);
      const { message } = await sendRequest(
        '/auth/update-account-password',
        'PUT',
        requestData,
      );
      setSuccess(message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white max-lg:bg-transparent p-5 max-lg:pt-10 rounded">
      <h3 className="font-semibold max-lg:text-white">Change Password</h3>
      <Alert
        type="simple"
        message="For fund security, withdrawals are disabled for 24 hours after changing
        your login password."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            className="input"
            placeholder="Re-type New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

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
