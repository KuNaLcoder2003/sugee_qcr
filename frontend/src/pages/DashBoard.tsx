import  { useState } from 'react'
import SideBar from '../components/SideBar'
import DashboardContent from '../components/DashboardContent'


type tabs = "Entries" | "Pending" | "Cleared"

const DashBoard = () => {
    const [sidebarOpen , setSidebarOpen] = useState<boolean>(false)
    const [currentTab , setCurrentTab] = useState<tabs>(sessionStorage.getItem('tab') as tabs || "Entries")
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <SideBar setCurrentTab={setCurrentTab}  sideBarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-x-hidden">
        <DashboardContent currentTab={currentTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  )
}

export default DashBoard
