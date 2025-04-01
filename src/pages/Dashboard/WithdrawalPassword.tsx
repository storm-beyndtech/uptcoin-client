import Alert from '@/components/UI/Alert';
import { useState, useEffect } from 'react';
import { sendRequest } from '@/lib/sendRequest'; // Function to send API requests
import { contextData } from '@/context/AuthContext'; // User context

export default function WithdrawalPassword() {
  const { user, refreshUser } = contextData();
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  // Fetch withdrawal password status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await sendRequest(
          `/auth/check-withdrawal-password/${user._id}`,
          'GET',
        );
        setHasPassword(data.hasWithdrawalPassword);
      } catch (error) {
        console.error('Error fetching withdrawal password status:', error);
      }
    };

    fetchStatus();
  }, [user._id]);

  //Submit password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (hasPassword && currentPassword.length < 3) {
      setError('Current password is required.');
      return;
    }

    if (password1.length < 3) {
      setError('New password is too short.');
      return;
    }

    if (password1 !== password2) {
      setError("Passwords don't match.");
      return;
    }

    const requestData: any = {
      userId: user._id,
      withdrawalPassword: password1,
    };

    if (hasPassword) {
      requestData.currentPassword = currentPassword;
    }

    try {
      setLoading(true);
      const { message } = await sendRequest(
        '/auth/set-withdrawal-password',
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
        refreshUser()
      }, 3000);
    }
  };

  // Show loading state until we confirm password status
  if (hasPassword === null) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-lg bg-white max-lg:bg-transparent p-5 rounded">
      <h3 className="font-semibold max-lg:text-white">
        {hasPassword
          ? 'Change Withdrawal Password'
          : 'Setup Withdrawal Password'}
      </h3>

      <Alert
        type="simple"
        message="For security, withdrawals are disabled for 24 hours after changing your login password."
      />

      <form className="space-y-4">
        {hasPassword && (
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
        )}

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter New Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Re-type New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}

        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? 'Updating...'
            : hasPassword
              ? 'Change Password'
              : 'Set Password'}
        </button>
      </form>
    </div>
  );
}
