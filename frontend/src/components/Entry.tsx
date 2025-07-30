import React from 'react'

interface Entry {
    gid: string,
    pan_page1_url: string,
    bank_code: string,
    aadhar_page1_url: string,
    aadhar_page2_url: string,
    selie_url: string,
    customer_guid: string,
    account_number: string,
    branch_code: string,
    cif_number: string,
    sign_url: string,
    aadhar_json?: string,
    created_on: string,
    status: string,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setEntryToEdit: React.Dispatch<React.SetStateAction<EntryEdit>>
}

interface EntryEdit {
    gid: string,
    pan_page1_url: string,
    bank_code: string,
    aadhar_page1_url: string,
    aadhar_page2_url: string,
    selie_url: string,
    customer_guid: string,
    account_number: string,
    branch_code?: string,
    cif_number: string,
    sign_url: string,
    aadhar_json?: string,
    created_on: string,
    status: string,
}

const Entry: React.FC<Entry> = ({ gid, pan_page1_url, aadhar_page1_url, aadhar_page2_url,
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
                    })
                }} className='text-center p-1 bg-green-600 text-white rounded-full cursor-pointer'>View</button>
                
            </div>

            {/* <div className='w-[90%] m-auto flex items-center justify-end gap-6 mb-2'>

            </div> */}
        </div>
    )
}

export default Entry
