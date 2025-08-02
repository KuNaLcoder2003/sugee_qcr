import React from 'react'
import type {Entry} from '../types'

const EntryComp: React.FC<Entry> = ({ gid, pan_page1_url, aadhar_page1_url, aadhar_page2_url,
    selie_url, cif_number, account_number, customer_guid, branch_code, sign_url, created_on, status, bank_code, user_json ,setIsModalOpen, setEntryToEdit }) => {
    return (
        <div className='w-full mb-4 bg-white rounded-lg'>
            <div className="w-full p-1 grid grid-cols-5 items-center justify-center gap-4 text-sm text-center mb-2">
                <p className="truncate">{user_json.aadhar_no}</p>
                <p className="truncate">{account_number}</p>
                <p className="truncate">{cif_number}</p>
                <p className="truncate">{branch_code}</p>
                <button onClick={() => {
                    setIsModalOpen(true);
                    setEntryToEdit({
                        gid,
                        pan_page1_url,
                        bank_code,
                        aadhar_page1_url,
                        aadhar_page2_url,
                        selie_url,
                        customer_guid,
                        account_number,
                        cif_number,
                        sign_url,
                        created_on,
                        status,
                        user_json: {
                            aadhar_no: user_json.aadhar_no,
                            pan_no: user_json.pan_no,
                            father_name: user_json.father_name,
                            name: user_json.name,
                            gender: user_json.gender,
                            dob: user_json.dob,
                            address: user_json.address,
                            account_number : account_number,
                            cif_number : cif_number
                        }
                    })
                }} className='text-center p-1 bg-green-600 text-white rounded-full cursor-pointer'>View</button>

            </div>

            
        </div>
    )
}

export default EntryComp
