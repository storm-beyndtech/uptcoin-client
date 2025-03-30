import Alert from '@/components/UI/Alert';
import { useState } from 'react';
import { sendRequest } from '@/lib/sendRequest';
import { contextData } from '@/context/AuthContext';

export default function ChangePassword() {
  const { user } = contextData();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Submit password update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (currentPassword.length < 3) {
      setError('Current password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      const { message } = await sendRequest('/auth/update-password', 'PUT', {
        userId: user._id,
        currentPassword,
        newPassword,
      });

      setSuccess(message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
    <div className="w-full max-w-lg bg-white p-5 rounded">
      <h3 className="font-semibold">Change Account Password</h3>

      <Alert
        type="simple"
        message="For security, withdrawals are disabled for 24 hours after changing your login password."
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
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Confirm New Password</label>
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
