import React  from 'react'
import Header from './Header'
import Entries from './Entries'
import Pending from './Pending'
import Cleared from './Cleared'

type tabs = "Entries" | "Pending" | "Cleared"

interface Prop {
    sidebarOpen : boolean, 
    setSidebarOpen : React.Dispatch<React.SetStateAction<boolean>> , 
    currentTab : tabs
}

interface TabProp {
  tab : tabs
}

const Element : React.FC<TabProp> = ({tab})=> {
  if(tab == "Entries" ) {
    return <Entries/>
  } else if (tab == "Cleared" ) {
    return <Cleared/>
  } else if (tab == "Pending" ) {
    return <Pending/>
  } else {
    return null
  }
}
const DashboardContent : React.FC<Prop> = ({sidebarOpen , setSidebarOpen , currentTab}) => {

  return (
    <div className="w-full h-full">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='p-4'>
        <Element tab={currentTab} />
      </div>
    </div>
  )
}

export default DashboardContent
