import React  from 'react'
import Header from './Header'
import Entries from './Entries'

interface Prop {
    sidebarOpen : boolean, 
    setSidebarOpen : React.Dispatch<React.SetStateAction<boolean>>
}
const DashboardContent : React.FC<Prop> = ({sidebarOpen , setSidebarOpen}) => {
  return (
    <div className="w-full h-full">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='p-4'>
        <Entries/>
      </div>
    </div>
  )
}

export default DashboardContent
