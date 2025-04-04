import AdminUsersList, { IUser } from '@/components/AdminUsersList';
import { sendRequest } from '@/lib/sendRequest';
import { useEffect, useState } from 'react';

export default function ManageUsers() {
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

  return (
    <div>
      <AdminUsersList allUsers={users} />
    </div>
  );
}
