
import { useEffect, useState } from 'react';
import Entry from './Entry';
import toast from 'react-hot-toast';
import EditWindow from './EditWindow';

const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`
interface KYCEntries {
    gid: string;
    pan_page1_url: string;
    bank_code: string;
    aadhar_page1_url: string;
    aadhar_page2_url: string;
    selie_url: string;
    customer_guid: string;
    account_number: string;
    branch_code: string;
    cif_number: string;
    sign_url: string;
    aadhar_page1_path: string;
    aadhar_page2_path: string;
    aadhar_json: string;
    created_on: string;
    pan_page1_path: string;
    selfie_path: string;
    sign_path: string;
    status: string;
}
interface Edit {
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
interface Branch {
    bank_code: string;
    bank_name: string;
    active: string;
}

const Entries = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
    })

    useEffect(() => {
        const storedBranch = sessionStorage.getItem('branch');
        if (!storedBranch) {
            loadBranches();

        } else {
            fetchEntries(storedBranch);
        }
    }, []);

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
            formData.append("status", "0");
            formData.append("limit", "10");

            const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.data) {
                setEntries(data.data);
                setBranchCode(bankCode);
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
                    <div>Loading...</div>
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
            ) : loading ? <div className='text-xl font-bold'>Loading...</div> : <>
                {
                    entries.length === 0 ? (
                        <div>No record to show</div>
                    ) : (
                        <div className="w-[95%] m-auto rounded-lg p-4">
                            {
                                isModalOpen ? <div className='fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50'>
                                    <EditWindow setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} branch_code='' aadhar_json='' {...entryToEdit} />
                                </div> : null
                            }
                            <div className="w-full p-2 flex flex-col items-center gap-2 bg-gray-100 rounded-lg">
                                <div className="w-full text-center p-2 grid grid-cols-5 gap-4 text-lg font-bold">
                                    <p className='truncate'>Customer Guid</p>
                                    <p className='truncate'>Account Number</p>
                                    <p className='truncate'>CIF Number</p>
                                    <p className='truncate'>Branch Code</p>
                                    <p className='truncate'>Edit</p>
                                </div>
                                {entries.map((obj) => (
                                    <Entry setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} key={obj.gid} {...obj} />
                                ))}
                            </div>
                        </div>
                    )
                }
            </>}
        </>
    );
};

export default Entries;
