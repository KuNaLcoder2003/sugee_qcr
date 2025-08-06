import { useEffect, useState} from 'react';
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
    // const lastFetchedBranch = useRef<string>('');
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
    const [loading, setLoading] = useState(false)
    const [isBranchChange, setIsBranchChange] = useState<boolean>(sessionStorage.getItem('isCahnge') ? true : false);

    useEffect(() => {
        const storedCheck = sessionStorage.getItem('isCahnge');
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
        if(storedBank && storedBranch && sessionStorage.getItem('isCahnge') === 'true') {
            console.log('Fetching customers due to branch change , kunal');
            
        }

        // If entries not loaded but bank and branch exist, fetch entries
        if (storedBank && storedBranch && entries.length === 0) {
            setSelectedBank(storedBank);
            setSelectedBranch(storedBranch);
            fetchEntries(storedBank, storedBranch);
            if (storedCheck === 'true') {
                console.log('Check hai idhar');
                console.log(isBranchChange)
                // fetchBranchCustomers(storedBank, storedBranch);
            }
        }
    }, [entries]);

    const loadBanks = async () => {
        setLoadingBanks(true);
           const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token })
      };
        try {
            const res = await fetch(FETCH_BANKS_URL, { method: 'POST',headers });
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
        setLoadingCustomers(true);
        const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { Authorization: token })
      };
        try {
            const res = await fetch(FETCH_BRANCH_CUSTOMERS, {
                method: 'POST',
                headers,
                body: form,
            });
            const data = await res.json();
            if (data.status === '1') {
                setCustomers(data.data);
                sessionStorage.setItem('isCahnge', 'false');
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
         const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { 'Authorization': token })
      };
        try {
            const res = await fetch(`${FETCH_BRANCHES}?bank_code=${bankCode}`, {
                method: 'POST',
                headers,
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
            console.log('Fetching entries for bank:', bankCode, 'branch:', branchCode);
            formData.append('branch_code', branchCode); 
             const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { 'Authorization': token })
      };

            const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
                method: 'POST',
                headers,
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
                const token = localStorage.getItem('authtoken'); // this could return null or a string

                const headers: HeadersInit = {
                    ...(token && { 'Authorization': token })
                };
                await fetch(EDIT_OCR_DATA_URL, {
                    method: 'POST',
                    headers,
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

        if (sessionStorage.getItem('isCahnge') === 'true') {
            console.log('true hai ');

            fetchBranchCustomers(selectedBank, selectedBranch);
        } else {
            console.log(' false hai ');
        }
    };



    return (
        <>
            {/* Always-visible Bank & Branch selectors */}
            <div className="w-[95%] max-w-5xl mx-auto rounded-lg p-6 bg-gray-100 shadow-md">
                <div className="w-full  flex items-center justify-center lg:block overflow-x-auto lg:overflow-visible hide-scrollbar">
                    <form onSubmit={handleSubmit} className="lg:min-w-[700px] m-auto lg:m-0 flex flex-col lg:flex-row items-baseline lg:items-center gap-4 px-2">
                        {/* Bank Selector */}
                        <div className="flex flex-col">
                            <label htmlFor="bank-select" className="text-xs font-medium text-gray-600 mb-1">
                                Bank
                            </label>
                            <select
                                id="bank-select"
                                className="w-[180px] lg:min-w-[180px] h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={selectedBank}
                                onChange={(e) => {
                                    const bank = e.target.value;
                                    setSelectedBank(bank);
                                    fetchBankBranches(bank);
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

                        {/* Branch Selector */}
                        <div className="flex flex-col">
                            <label htmlFor="branch-select" className="text-xs font-medium text-gray-600 mb-1">
                                Branch
                            </label>
                            <select
                                id="branch-select"
                                className="w-[180px] lg:min-w-[180px] h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={selectedBranch}
                                onChange={(e) => { setSelectedBranch(e.target.value); setIsBranchChange(true); sessionStorage.setItem('isCahnge', 'true'); }}
                            >
                                <option value="">Choose Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.branch_code} value={branch.branch_code}>
                                        {branch.branch_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end pt-5 w-[180px] lg:w-auto">
                            <button
                                type="submit"
                                className="w-full h-10 px-6 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-all"
                            >
                                Get Entries
                            </button>
                        </div>
                    </form>
                </div>


            </div>






            {/* Main Content */}
            {
                loading || loadingCustomers ? (
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
                )
            }
        </>
    );
};

export default Entries;

