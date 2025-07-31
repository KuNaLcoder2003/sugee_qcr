import React from 'react'
import type {Entry} from '../types'

const EntryComp: React.FC<Entry> = ({ gid, pan_page1_url, aadhar_page1_url, aadhar_page2_url,
    selie_url, cif_number, account_number, customer_guid, branch_code, sign_url, created_on, status, bank_code, setIsModalOpen, setEntryToEdit }) => {
    return (
        <div className='w-full mb-4 bg-white rounded-lg'>
            <div className="w-full p-1 grid grid-cols-5 items-center justify-center gap-4 text-sm text-center mb-2">
                <p className="truncate">{gid}</p>
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
                            aadhar_no: '',
                            pan_no: '',
                            father_name: '',
                            name: '',
                            gender: '',
                            dob: '',
                            address: ''
                        }
                    })
                }} className='text-center p-1 bg-green-600 text-white rounded-full cursor-pointer'>View</button>

            </div>

            
        </div>
    )
}

export default EntryComp
