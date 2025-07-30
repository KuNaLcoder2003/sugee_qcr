import  { useState } from 'react'
import SideBar from '../components/SideBar'
import DashboardContent from '../components/DashboardContent'

const DashBoard = () => {
    const [sidebarOpen , setSidebarOpen] = useState<boolean>(false)
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <SideBar sideBarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-x-hidden">
        <DashboardContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  )
}

export default DashBoard
