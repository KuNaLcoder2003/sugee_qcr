import React, { useState } from 'react'
import { LogOut, User, X , ClipboardClock  } from "lucide-react"
import { useAuth } from '../context/authContext'

type tabs = "Entries" | "Pending" | "Cleared"

interface Prop {
  sideBarOpen: boolean,
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentTab : React.Dispatch<React.SetStateAction<tabs>>
}

const sidebarItems = [
  {
    icon: <User />,
    label: 'Dashboard',
    name : 'Entries' as tabs,
  },
  {
    icon: <ClipboardClock />,
    label: 'Pending',
    name : 'Pending' as tabs,
  },
  // {
  //   icon: <Settings />,
  //   label: 'Cleared',
  //   name : 'Cleared' as tabs
  // },
  {
    icon: <LogOut />,
    label: 'Logout',
    name : '' as tabs
  },
]
const SideBar: React.FC<Prop> = ({ sideBarOpen, setSidebarOpen , setCurrentTab }) => {

  const [active, setActive] = useState<number>(Number(sessionStorage.getItem('tabIndex')) || 0)
  const {logout} = useAuth()
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 h-screen w-64 p-4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
      ${sideBarOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">QC Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-6">
        {sidebarItems.map((item, index) => (
          <p
            key={index}
            onClick={() => {
              if(index == 3) {
                logout()
              } else {
                setActive(index)
                setCurrentTab(item.name)
                sessionStorage.setItem('tab' , item.name)
                sessionStorage.setItem('tabIndex' , `${index}`)
              }
            }}
            className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${active === index
                ? 'bg-green-700 text-white rounded-lg'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <div className="w-5 h-5 mr-3">{item.icon}</div>
            {item.label}
          </p>
        ))}
      </nav>
    </div>
  )
}

export default SideBar
