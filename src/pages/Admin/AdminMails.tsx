import { useEffect, useState } from 'react';
import { Send, Users, User, Mail } from 'lucide-react';
import { sendRequest } from '@/lib/sendRequest';
import Alert from '@/components/UI/Alert';
import { User as IUser } from '@/types/types';

const AdminMails = () => {
  // State for form data
  const [emailType, setEmailType] = useState<'bulk' | 'singleUser'>('bulk');
  const [singleEmail, setSingleEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);

  //Fetch all users
  const fetchUsers = async () => {
    try {
      const usersData = await sendRequest('/auth/users', 'GET');
      setUsers(usersData);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    try {
      // Determine recipients based on emailType
      const recipients =
        emailType === 'singleUser'
          ? singleEmail
          : users.map((user) => user.email);

      // Create the payload
      const payload = {
        recipients,
        subject: emailSubject,
        message: emailBody,
      };

      const { message } = await sendRequest(
        '/admin/send-emails',
        'POST',
        payload,
      );

      setSuccess(message);

      // Reset form fields
      if (emailType === 'singleUser') {
        setSingleEmail('');
      }
      setEmailSubject('');
      setEmailBody('');
    } catch (error: any) {
      setError('Failed to send email(s): ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-bodydark2/40 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
      <div className="flex items-center mb-6">
        <Mail className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Email Communication
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Email Type Selection */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Type
          </label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="bulk"
                name="emailType"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                checked={emailType === 'bulk'}
                onChange={() => setEmailType('bulk')}
              />
              <label
                htmlFor="bulk"
                className="ml-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Users size={18} className="mr-1" />
                All Users
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="singleUser"
                name="emailType"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                checked={emailType === 'singleUser'}
                onChange={() => setEmailType('singleUser')}
              />
              <label
                htmlFor="singleUser"
                className="ml-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <User size={18} className="mr-1" />
                Single User
              </label>
            </div>
          </div>
        </div>

        {/* Single User Email Field */}
        {emailType === 'singleUser' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-800/50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Email Subject */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject Line
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            required
            placeholder="Enter email subject"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-800/50 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Content
          </label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            required
            placeholder="Enter email content"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-800/50 focus:ring-blue-500 focus:border-blue-500 resize-y"
          ></textarea>
        </div>

        {/* Action Buttons */}
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {sending
              ? 'Sending...'
              : emailType === 'bulk'
                ? 'Send to All Users'
                : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMails;
