
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from './Loader';
import type {KYCEntries , Edit , Branch} from '../types'
import Window from './Window';
const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`
const Entries = () => {
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [entries, setEntries] = useState<KYCEntries[]>([]);
    const [branchCode, setBranchCode] = useState<string>(sessionStorage.getItem('branch') || '');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBanks, setLoadingBanks] = useState<boolean>(false);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)
    const [entryToEdit, setEntryToEdit] = useState<Edit>({
        gid: "",
        pan_page1_url: "",
        bank_code: "",
        aadhar_page1_url: "",
        aadhar_page2_url: "",
        selie_url: "",
        customer_guid: "",
        account_number: "",
        cif_number: "",
        sign_url: "",
        aadhar_json: "",
        created_on: "",
        status: "",
        user_json : {
            aadhar_no : '',
            pan_no : '',
            father_name : '',
            name : '',
            gender : '',
            dob : '',
            address : ''
        }
    })

    useEffect(() => {
        const storedBranch = sessionStorage.getItem('branch');
        if (!storedBranch) {
            loadBranches();

        } else {
            fetchEntries(storedBranch);
        }
    }, [entries.length === 0]);

    const loadBranches = async () => {
        setLoadingBanks(true);
        try {
            const res = await fetch(FETCH_BANKS_URL, { method: 'POST' });
            const data = await res.json();
            if (data.data) {
                setBranches(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch branches');
            }
        } catch (error: any) {
            toast.error('Error fetching branches');
        } finally {
            setLoadingBanks(false);
        }
    };

    const fetchEntries = async (bankCode: string) => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("bank_code", bankCode);
            formData.append("status", "0"); // fetch entry with status : 0 i.e unassigned one
            formData.append("limit", "1"); // fetch one at a time
            formData.append("fromDate" , "7/29/2025 4:23:42 PM")

            const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status == '1') {

                setEntries(data.data);
                const new_form = new FormData()
                new_form.append("status" , "-1") //   -3 -> cleared , -2 -> pending , -1 -> assigned , 0 -> not assigned , 1 -> Done
                new_form.append("bank_code" , bankCode)
                new_form.append("customer_guid" , data.data[0].customer_guid)
                new_form.append("gid" , data.data[0].gid)
                const response = await fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData' , {
                    method : 'POST',
                    body : new_form
                })
                const status_data = await response.json()
                if(status_data.status !== 1) {
                    toast.error(status_data.message)
                    return 
                }
                setBranchCode(bankCode);
                setEntryToEdit({
                    aadhar_page1_url : data.data[0].aadhar_page1_url , 
                    aadhar_page2_url : data.data[0].aadhar_page2_url , 
                    pan_page1_url : data.data[0].pan_page1_url,
                    user_json : JSON.parse(data.data[0].user_json),
                    status : "-1",
                    aadhar_json : "",
                    gid : data.data[0].gid,
                    customer_guid : data.data[0].customer_guid,
                    account_number : "",
                    bank_code : data.data[0].bank_code,
                    selie_url : data.data[0].selie_url,
                    sign_url : data.data[0].sign_url,
                    cif_number : data.data[0].cif_number,
                    created_on : data.data[0].created_on
                })
                sessionStorage.setItem('branch', bankCode);
            } else {
                toast.error(data.message || 'No data found');
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error fetching entries');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBranch || selectedBranch === "Select a branch") {
            toast.error("Please select a valid branch");
            return;
        }
        fetchEntries(selectedBranch);
    };

    return (
        <>
            {!branchCode ? (
                loadingBanks ? (
                    <Loader/>
                ) : (
                    <div className="w-[95%] m-auto rounded-lg p-4 bg-gray-100 shadow-md">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <label htmlFor="branch-select" className="text-lg font-semibold text-gray-700">
                                Select Branch:
                            </label>
                            <select
                                id="branch-select"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">Select a Value</option>
                                {branches.map((branch) => (
                                    <option key={branch.bank_code} value={branch.bank_code}>
                                        {branch.bank_code}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-900 transition-colors"
                            >
                                Get Entries
                            </button>
                        </form>
                    </div>

                )
            ) : loading ? <Loader/> : <>
                {
                    entries.length === 0 ? (
                        <div>No record to show</div>
                    ) : (
                        <div className="w-[95%] m-auto rounded-lg p-4">
                            <Window  setEntries={setEntries} branch_code='' aadhar_json='' {...entryToEdit} />
                           
                        </div>
                    )
                }
            </>}
        </>
    );
};

export default Entries;
