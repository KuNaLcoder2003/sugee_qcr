import { Loader } from 'lucide-react'
import React, { useEffect, useState, type FormEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { type Branch } from '../types';


const ADD_USER = `${import.meta.env.VITE_ADMIN_ADD_USER}`
const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`;
interface NewUser {
    name: string,
    email: string,
    mobile: string,
}


const AddUserModal: React.FC = () => {
    const [userDetails, setUserDetails] = useState<NewUser>({
        name: '',
        email: '',
        mobile: ''
    });

    const [loading, setLoading] = useState<boolean>(false)
    const [bankCode, setBankCode] = useState<string>("")
    const [banks, setBanks] = useState<Branch[]>([])

    useEffect(() => {
        try {

            fetch(FETCH_BANKS_URL, {
                method: 'POST',
            }).then(async (response: Response) => {
                const data = await response.json()
                if (data.status == '1') {
                    setBanks(data.data)
                } else {
                    setBanks([])
                    toast.error(data.message)
                }
            })
        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (bankCode.length == 0) {
            toast.error('Please select bank')
            return
        }
        console.log('Submitting')
        try {
            const formData = new FormData()
            console.log('Bank code is : ', bankCode)
            formData.append("Name", userDetails.name)
            formData.append("email", "")
            formData.append("Mobile", userDetails.mobile)
            formData.append("Password", userDetails.mobile)
            formData.append("role", "2")
            formData.append("status", "0")
            formData.append("bank_code", bankCode)
            setLoading(true)
            const response = await fetch(ADD_USER, {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
            if (data.status == '1') {
                toast.success(data.message ? data.message : "User added")
                setUserDetails({
                    email: '',
                    name: '',
                    mobile: ''
                })
                setLoading(false)

            } else {
                toast.error(data.message)
                setLoading(false)
            }

        } catch (error) {
            toast.error('Something went wrong')
            setLoading(false)
        }
    }
    return (
        <div className="realtive bg-stone-300 w-screen h-screen overflow-hidden flex items-center justify-center px-4">
            <Toaster />
            <div className="w-full max-w-md md:max-w-xl bg-white rounded-lg p-6">
                <div className="w-full flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700">Add a new user</h2>

                </div>
                {
                    loading ? <Loader /> : <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="bank-select" className="text-xs font-medium text-gray-600 mb-1">
                                    Bank
                                </label>
                                <select
                                    id="bank-select"
                                    className="w-[180px] lg:min-w-[180px] h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={bankCode}
                                    onChange={(e) => {
                                        const bank = e.target.value;
                                        setBankCode(bank);
                                        // fetchBankBranches(bank);
                                    }}
                                >
                                    <option value="">Choose Bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank.bank_code} value={bank.bank_code}>
                                            {bank.bank_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm md:text-base text-gray-600">Name:</label>
                                <input
                                    required={true}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's name..."
                                    value={userDetails.name}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm md:text-base text-gray-600">Email:</label>
                                <input
                                    required={true}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's email..."
                                    value={userDetails.email}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm md:text-base text-gray-600">Mobile Number:</label>
                                <input
                                    required={true}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's mobile number..."
                                    value={userDetails.mobile}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, mobile: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-1/2 self-start bg-blue-600 text-white rounded-md py-2 px-4 text-center hover:bg-blue-700 transition-colors"
                        >
                            Add User
                        </button>
                    </form>
                }
            </div>
        </div>
    );
};

export default AddUserModal;
