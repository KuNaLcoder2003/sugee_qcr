import React, { useEffect, useState } from 'react';
import { type Member } from '../types';
import Loader from './Loader';
import toast from 'react-hot-toast';
import SearchBarDropdown from './AdminUserSearch';
import { Plus } from 'lucide-react';
import AddUserModal from './AddUserModal';

const GET_ALL_USERS = `${import.meta.env.VITE_ADMIN_GET_ALL_USERS}`
const UPDATE_USER = `${import.meta.env.VITE_ADMIN_UPDATE_USER}`
const UserManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [searchValue, setSearchValue] = useState<string>("")
  // const [userChanged , setUserChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const fetchUsers = async () => {
    try {
      const formData = new FormData();
      formData.append('bank_code', '162');

      setLoading(true);
      const res = await fetch(GET_ALL_USERS, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.status === '1') {
        setMembers(data.data);
        setAllMembers(data.data)
      } else {
        setMembers([]);
        setAllMembers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allMembers.filter(obj =>
      obj.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setMembers(filtered);

  }, [searchValue, allMembers])

  // const fruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry'];


  const updateUser = async (userMobile: string, activeStatus: string, role: string, status: string) => {
    const updateForm = new FormData()
    updateForm.append("Mobile", userMobile)
    updateForm.append("Password", userMobile)
    updateForm.append("active", activeStatus)
    updateForm.append("role", role)
    updateForm.append("status", status)
    const response = await fetch(UPDATE_USER, {
      method: 'POST',
      body: updateForm
    })
    const data = await response.json()
    return data;
  }

  const handleToggle = (userMobile: string, activeStatus: string, role: string) => {
    let data: any;

    if (activeStatus == '1') {
      console.log('inactive kar rha hu ')
      data = updateUser(userMobile, '0', role, '0')
      setMembers(val => val.map(obj => {
        if (obj.mobile == userMobile) {
          obj.active = '0'
          return obj
        } else {
          return obj
        }
      }))
    } else {
      data = updateUser(userMobile, '1', role, '1')
      setMembers(val => val.map(obj => {
        if (obj.mobile == userMobile) {
          obj.active = '1'
          return obj
        } else {
          return obj
        }
      }))
    }
    if (data.status == '1') {
      // setUserChanged(true)
      toast.success(data.message)

    } else {
      toast.error(data.error)
    }
    // setUserChanged(false)
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-h-screen overflow-x-hidden px-4 py-6">
          <div className='p-2 mb-4 flex items-center justify-between'>
            <div className='w-full'>
              <SearchBarDropdown items={members} setSearchValue={setSearchValue} />
            </div>
            <div className='w-[50px] h-[50px] flex items-center justify-center bg-blue-600 rounded-full cursor-pointer'>
              <Plus color="white" className='font-bold' size={24} onClick={()=>setIsModalOpen(true)}  />
            </div>
          </div>

          {
            isModalOpen ? <AddUserModal setIsModalOpen={setIsModalOpen} bank_code={"162"} /> : null
          }

          {members.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">No members added yet</p>
            </div>
          ) : (
            <div className="space-y-4">

              {members.map((user) => (
                <div
                  key={user.user_id}
                  className="flex justify-between items-center border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.mobile}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.active === '1'}
                      onChange={() => handleToggle(user.mobile, user.active, user.role)}
                      aria-label={`Toggle user ${user.name}`}
                    />
                    <div className={`w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300 ease-in-out ${user.active == '1' ? "justify-start" : "justify-end"}`}>
                      <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full ${user.active == '1' ? "" : "transform translate-x-5"}`}></span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserManagement;
