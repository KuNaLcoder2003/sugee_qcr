import React, { useEffect, useState } from 'react';

type User = {
  user_id: string;
  name: string;
  mobile: string;
  password:String;
  active: string; // 1 = active, 0 = inactive
};
const FETCH_USER_LIST = `${import.meta.env.VITE_FETCH_USER_LIST_URL}`;
const UPDATE_USER = `${import.meta.env.VITE_UPDATE_USER_URL}`;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    const formData = new FormData();
    formData.append("bank_code", '162');
      const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { 'Authorization': token })
      };
    try {
      const res = await fetch(FETCH_USER_LIST,{
        method: 'POST',
        headers,
        body: formData
      }); // Replace with actual API
      const data = await res.json();
      if (data.status === '1') {
      setUsers(data.data); // Adjust if response structure is different
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (user: User) => {
    const confirmChange = window.confirm(
      `Are you sure you want to ${user.active === "1" ? 'deactivate' : 'activate'} this user?`
    );
    if (!confirmChange) return;

    try {
    const formData = new FormData();
    formData.append("Status", `${user.active === "1" ? '0' : '1'}`);
    formData.append("user_id", user.user_id);
    formData.append("Mobile", user.mobile);
      const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { 'Authorization': token })
      };
      const res = await fetch(UPDATE_USER, {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        // Update the state
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.user_id === user.user_id ? { ...u, active: user.active === "1" ? "0" : "1" } : u
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) return <p>Loading users...</p>;

return (
  <div className="h-full w-full flex flex-col">
    {/* Header */}
    <div className="p-4 flex-shrink-0 border-b">
      <h2 className="text-xl font-bold">User Management</h2>
    </div>

    {/* Scrollable list */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {users.map(user => (
        <div
          key={user.user_id}
          className="flex justify-between items-center border p-3 rounded-md shadow-sm"
        >
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.mobile}</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={user.active === "1"}
              onChange={() => handleToggle(user)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>
      ))}
    </div>
  </div>
);


};

export default UserManagement;
