import React from 'react'
import { MenuIcon, User2Icon } from 'lucide-react'

interface Prop {
    sidebarOpen: boolean,
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<Prop> = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <div className="w-[95%] rounded-lg m-auto mt-4 py-2 px-6 flex items-center justify-between bg-green-700 text-white">
            <div className="flex items-center gap-4">
                <div className="block lg:hidden">
                    {!sidebarOpen && <MenuIcon onClick={() => setSidebarOpen(true)} className="cursor-pointer" />}
                </div>
                <div className="text-lg font-bold">Welcome to QC Dashboard</div>
            </div>
            <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full border border-white">
                <User2Icon size={28} />
            </div>
        </div>
    )
}

export default Header
