import React from 'react';

const UserManagement: React.FC = () => {
  function handleToggle() {

  }
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[{user_id : 1 , name : 'Kunal' , mobile : '8302988' , active : '1'}].map(user => (
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
                onChange={() => handleToggle()}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>
        ))}
      </div>
   
   </>

   
);


};

export default UserManagement;
