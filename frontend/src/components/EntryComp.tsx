import React from 'react'
import type { Entry } from '../types'

const EntryComp: React.FC<Entry> = ({ gid, pan_page1_url, aadhar_page1_url, aadhar_page2_url,
    selie_url, cif_number, account_number, customer_guid, branch_code, sign_url, created_on, status, aadhar_json , pan_josn , bank_code, user_json, setIsModalOpen, setEntryToEdit }) => {
    return (
        <div className='w-full mb-4 bg-white rounded-lg'>
            <div className="w-full p-1 grid grid-cols-5 items-center justify-center gap-4 text-sm text-center mb-2">
                <p className="truncate">{user_json?.aadhar_no}</p>
                <p className="truncate">{account_number}</p>
                <p className="truncate">{cif_number}</p>
                <p className="truncate">{branch_code}</p>
                <button onClick={() => {
                    setIsModalOpen(true);
                    setEntryToEdit({
                        gid: gid || '',
                        pan_page1_url: pan_page1_url || '',
                        bank_code: bank_code || '',
                        aadhar_page1_url: aadhar_page1_url || '',
                        aadhar_page2_url: aadhar_page2_url || '',
                        selie_url: selie_url || '',
                        customer_guid: customer_guid || '',
                        account_number: account_number || '',
                        cif_number: cif_number || '',
                        sign_url: sign_url || '',
                        created_on: created_on || '',
                        status: status || '',
                        user_json: {
                            aadhar_no: user_json?.aadhar_no || '',
                            pan_no: user_json?.pan_no || '',
                            father_name: user_json?.father_name || '',
                            name: user_json?.name || '',
                            gender: user_json?.gender || '',
                            dob: user_json?.dob || '',
                            address: user_json?.address || '',
                            account_number: account_number || '',
                            cif_number: cif_number || '',
                        },
                        aadhar_json: {
                            aadhar_number: aadhar_json?.aadhar_number || "",
                            name: aadhar_json?.name || '',
                            relation: aadhar_json?.relation || '',
                            relation_name: aadhar_json?.relation_name || '',
                            dob: aadhar_json?.dob || '',
                            address: aadhar_json?.address || '',
                            gender: aadhar_json?.gender || '',
                        },
                        pan_josn: {
                            pan_number: pan_josn.pan_number || '',
                            father_name: pan_josn.father_name || '',
                            dob: pan_josn.dob || '',
                            name: pan_josn.name || '',
                        },
                    });

                }} className='text-center p-1 bg-green-600 text-white rounded-full cursor-pointer'>View</button>

            </div>


        </div>
    )
}

export default EntryComp
