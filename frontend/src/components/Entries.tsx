import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { type KYCEntries, type Edit, type Branch, type Customer } from '../types';
import Window from './Window';
import DropdownSearch from './DropDownSearch';

const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`;
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`;
const EDIT_OCR_DATA_URL = `${import.meta.env.VITE_UPDATE_OCR_DATA}`;
const FETCH_BRANCH_CUSTOMERS = `${import.meta.env.VITE_FETCH_CUSTOMERS}`;
const FETCH_BRANCHES = `${import.meta.env.VITE_GET_BANK_BRANCHES}`;

const Entries = () => {
    const lastFetchedBranch = useRef<string>('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [entries, setEntries] = useState<KYCEntries[]>([]);
    const [banks, setBanks] = useState<Branch[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState<string>(sessionStorage.getItem('bank') || '');
    const [selectedBranch, setSelectedBranch] = useState<string>(sessionStorage.getItem('branch') || '');
    const [entryToEdit, setEntryToEdit] = useState<Edit>({
        gid: '',
        pan_page1_url: '',
        bank_code: '',
        aadhar_page1_url: '',
        aadhar_page2_url: '',
        selie_url: '',
        customer_guid: '',
        account_number: '',
        cif_number: '',
        sign_url: '',
        aadhar_json: {
            aadhar_number: '',
            name: '',
            relation: '',
            relation_name: '',
            dob: '',
            address: '',
            gender: '',
        },
        pan_josn: {
            pan_number: '',
            father_name: '',
            dob: '',
            name: '',
        },
        created_on: '',
        status: '',
        user_json: {
            aadhar_no: '',
            pan_no: '',
            father_name: '',
            name: '',
            gender: '',
            dob: '',
            address: '',
            cif_number: '',
            account_number: '',
        },
    });

    const [loadingBanks, setLoadingBanks] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedBank = sessionStorage.getItem('bank') || '';
        const storedBranch = sessionStorage.getItem('branch') || '';

        // Always fetch banks if empty
        if (banks.length === 0) {
            loadBanks();
        }

        // If bank is already selected and branches not loaded, load branches
        if (storedBank && branches.length === 0) {
            fetchBankBranches(storedBank);
        }

        // If entries not loaded but bank and branch exist, fetch entries
        if (storedBank && storedBranch && entries.length === 0) {
            setSelectedBank(storedBank);
            setSelectedBranch(storedBranch);
            fetchEntries(storedBank, storedBranch);
            fetchBranchCustomers(storedBank, storedBranch);
        }
    }, []);

    const loadBanks = async () => {
        setLoadingBanks(true);
        try {
            const res = await fetch(FETCH_BANKS_URL, { method: 'POST' });
            const data = await res.json();
            if (data.data) {
                setBanks(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch banks');
            }
        } catch (error) {
            toast.error('Error fetching banks');
        } finally {
            setLoadingBanks(false);
        }
    };

    const fetchBranchCustomers = async (bankCode: string, branchCode: string) => {
        const form = new FormData();
        form.append('bank_code', bankCode);
        form.append('branch_code', branchCode);
        console.log('Calling Customers')
        setLoadingCustomers(true);
        try {
            const res = await fetch(FETCH_BRANCH_CUSTOMERS, {
                method: 'POST',
                body: form,
            });
            const data = await res.json();
            if (data.status === '1') {
                setCustomers(data.data);
            } else {
                toast.error('Error fetching customers');
            }
        } catch (err) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchBankBranches = async (bankCode: string) => {
        const formData = new FormData();
        formData.append('bank_code', bankCode);
        try {
            const res = await fetch(`${FETCH_BRANCHES}?bank_code=${bankCode}`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.data) {
                setBranches(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch branches');
            }
        } catch (err) {
            toast.error('Error fetching branches');
        }
    };

    const fetchEntries = async (bankCode: string, branchCode: string) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('bank_code', bankCode);
            formData.append('status', '0');
            formData.append('limit', '1');
           

            const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.status === '1' && data.data.length > 0) {
                setEntries(data.data);

                const updateForm = new FormData();
                updateForm.append('status', '-1');
                updateForm.append('bank_code', bankCode);
                updateForm.append('customer_guid', data.data[0].customer_guid);
                updateForm.append('gid', data.data[0].gid);

                await fetch(EDIT_OCR_DATA_URL, {
                    method: 'POST',
                    body: updateForm,
                });

                setEntryToEdit({
                    aadhar_page1_url: data.data[0].aadhar_page1_url,
                    aadhar_page2_url: data.data[0].aadhar_page2_url,
                    pan_page1_url: data.data[0].pan_page1_url,
                    user_json: data.data[0].user_json.length > 0 ? JSON.parse(data.data[0].user_json) : '',
                    status: '-1',
                    aadhar_json: data.data[0].aadhar_json.length > 0 ? JSON.parse(data.data[0].aadhar_json) : '',
                    pan_josn: data.data[0].pan_json.length > 0 ? JSON.parse(data.data[0].pan_json) : '',
                    gid: data.data[0].gid,
                    customer_guid: data.data[0].customer_guid,
                    account_number: data.data[0].account_number,
                    bank_code: data.data[0].bank_code,
                    selie_url: data.data[0].selie_url,
                    sign_url: data.data[0].sign_url,
                    cif_number: data.data[0].cif_number,
                    created_on: data.data[0].created_on,
                });

                sessionStorage.setItem('bank', bankCode);
                sessionStorage.setItem('branch', branchCode);
                fetchBranchCustomers(bankCode, branchCode);
            } else {
                toast.error(data.message || 'No entries found');
            }
        } catch (err) {
            toast.error('Error fetching entries');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loadingBanks)
        if (!selectedBank) {
            toast.error('Please select a valid bank');
            return;
        }

        if (!selectedBranch) {
            toast.error('Please select a valid branch');
            return;
        }

        sessionStorage.setItem('bank', selectedBank);
        sessionStorage.setItem('branch', selectedBranch);

        fetchEntries(selectedBank, selectedBranch);

        if (lastFetchedBranch.current !== selectedBranch) {
            fetchBranchCustomers(selectedBank, selectedBranch);
            lastFetchedBranch.current = selectedBranch; // update the ref
        }
    };



return (
    <>
        {/* Always-visible Bank & Branch selectors */}
        <div className="w-[95%] max-w-5xl mx-auto rounded-lg p-6 bg-gray-100 shadow-md">

            <form onSubmit={handleSubmit} className="w-full flex flex-col lg:flex-row flex-wrap items-center justify-around gap-4">
                {/* Bank Selector */}
                <div className="flex items-center gap-2 w-full sm:w-[32%] min-w-[260px]">
                    <label htmlFor="bank-select" className="whitespace-nowrap text-sm font-medium text-gray-700">
                        Select Bank:
                    </label>
                    <select
                        id="bank-select"
                        className="flex-1 h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        value={selectedBank}
                        onChange={(e) => {
                            const bank = e.target.value;
                            setSelectedBank(bank);
                            fetchBankBranches(bank);
                        }}
                    >
                        <option value="">Select</option>
                        {banks.map((bank) => (
                            <option key={bank.bank_code} value={bank.bank_code}>
                                {bank.bank_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Branch Selector */}
                <div className="flex items-center gap-2 w-full sm:w-[32%] min-w-[260px]">
                    <label htmlFor="branch-select" className="whitespace-nowrap text-sm font-medium text-gray-700">
                        Select Branch:
                    </label>
                    <select
                        id="branch-select"
                        className="flex-1 h-9 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">Select</option>
                        {branches.map((branch) => (
                            <option key={branch.branch_code} value={branch.branch_code}>
                                {branch.branch_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <div className="w-full sm:w-auto">
                    <button
                        type="submit"
                        className="h-9 px-4 bg-green-700 text-white text-sm rounded hover:bg-green-900 transition-colors w-full sm:w-auto"
                    >
                        Get Entries
                    </button>
                </div>
            </form>

        </div>

        {/* Main Content */}
        {loading || loadingCustomers ? (
            <Loader />
        ) : entries.length === 0 ? (
            <div className="text-center mt-10 text-gray-600">No record to show</div>
        ) : (
            <div className="w-full m-auto rounded-lg p-4 flex flex-col items-center gap-4">
                <div className="w-full">
                    <DropdownSearch items={customers} />
                </div>
                <Window setEntries={setEntries} branch_code={selectedBranch} {...entryToEdit} />
            </div>
        )}
    </>
);
};

export default Entries;

