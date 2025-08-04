
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { type KYCEntries, type Edit, type Branch, type Customer } from '../types'
import Window from './Window';
import DropdownSearch from './DropDownSearch';

const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`
const EDIT_OCR_DATA_URL = `${import.meta.env.VITE_UPDATE_OCR_DATA}`
const FTECH_Branch_Customers = `${import.meta.env.VITE_FETCH_CUSTOMERS}`
const FETCH_BRANCHES = `${import.meta.env.VITE_GET_BANK_BRANCHES}`

const Entries = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false)
    // const [branchLoading, setBranchLoading] = useState<boolean>(false)
    const [entries, setEntries] = useState<KYCEntries[]>([]);
    // const [selectedDate, setSelectedDate] = useState<string>(sessionStorage.getItem('date') || '');
    const [bankCode, setBankCode] = useState<string>(sessionStorage.getItem('bank') || '');
    const [branches, setBranches] = useState<any[]>([])
    const [selectedBranch, setSelectedBarnch] = useState<string>("")
    const [banks, setBanks] = useState<Branch[]>([]);
    const [loadingBanks, setLoadingBanks] = useState<boolean>(false);
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)
    // const [branchCode, setBranchCode] = useState<string>(() => sessionStorage.getItem('branch') ?? '');
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
        aadhar_json: {
            aadhar_number: "",
            name: '',
            relation: '',
            relation_name: '',
            dob: '',
            address: '',
            gender: "",
        },
        pan_josn: {
            pan_number: '',
            father_name: '',
            dob: '',
            name: ''
        },
        created_on: "",
        status: "",
        user_json: {
            aadhar_no: '',
            pan_no: '',
            father_name: '',
            name: '',
            gender: '',
            dob: '',
            address: '',
            cif_number: '',
            account_number: ''
        }
    })
    useEffect(() => {
        const storedBank = sessionStorage.getItem('bank') as string
        // const storedDate = sessionStorage.getItem('date') as string
        const storedBranch = sessionStorage.getItem('branch') as string
        if (!storedBank) {
            loadBranches();

        } else {
            fetchEntries(storedBank, storedBranch);
            fetchBranchCustomers(storedBank, storedBranch)
        }
    }, [entries.length === 0, selectedBank.length == 0]);
    const loadBranches = async () => {
        setLoadingBanks(true);
        try {
            const res = await fetch(FETCH_BANKS_URL, { method: 'POST' });
            const data = await res.json();
            if (data.data) {
                setBanks(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch branches');
            }
        } catch (error: any) {
            toast.error('Error fetching branches');
        } finally {
            setLoadingBanks(false);
        }
    };
    const fetch_bank_branches = async (bankCode: string) => {
        // setBranchLoading(true)
        try {
            const formData = new FormData()
            formData.append("bank_code", bankCode)
            const bank_branches = await fetch(`${FETCH_BRANCHES}?bank_code=162`, {
                method: 'POST',
                body: formData
            })
            const bank_branches_data = await bank_branches.json()
            if (bank_branches_data.data) {
                setBranches(bank_branches_data.data)
            } else {
                toast.error(bank_branches_data.message)
                return
            }
            // setBranchLoading(false)
        } catch (error) {
            toast.error('Error fetching branch details')
            // setBranchLoading(false)
        }
    }
    const fetchBranchCustomers = async (bankCode: string, branchCode: string) => {
        console.log('Branch code is :', branchCode)
        const n = new FormData()
        n.append("bank_code", bankCode)
        n.append("branch_code", branchCode)
        setLoadingCustomers(true)
        const r = await fetch(FTECH_Branch_Customers, {
            method: 'POST',
            body: n
        })
        const d = await r.json() as any
        // console.log('kunal bhai : ', d)
        console.log(d)
        if (d.status == '1') {

            setCustomers(d.data)
        } else {
            toast.error('Error fetching customers')
            return
        }
        setLoadingCustomers(false)

    }
    const fetchEntries = async (bankCode: string, branch_code: string) => {
        try {
            setLoading(true)
            console.log("Clicked")
            const formData = new FormData();
            formData.append("bank_code", bankCode);
            formData.append("status", "0"); // fetch entry with status : 0 i.e unassigned one
            formData.append("limit", "1"); // fetch one at a time
            // const today = new Date();

            // const formatted =
            //     String(today.getMonth() + 1).padStart(2, '0') + '/' +
            //     String(today.getDate()).padStart(2, '0') + '/' +
            //     today.getFullYear();
            // formData.append("branch_code", branch_code)
            // const [year, month, day] = dateStr.split("-");
            // const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
            // console.log(formattedDate)
            formData.append("fromDate", '8/2/2025');

            const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            console.log('Aadhaar : ', JSON.parse(data.data[0].aadhar_json))
            console.log('Pan : ', JSON.parse(data.data[0].pan_json))
            if (data.status == '1') {
                setEntries(data.data);
                const new_form = new FormData()
                new_form.append("status", "-1") //   -3 -> cleared , -2 -> pending , -1 -> assigned , 0 -> not assigned , 1 -> Done
                new_form.append("bank_code", bankCode)
                new_form.append("customer_guid", data.data[0].customer_guid)
                new_form.append("gid", data.data[0].gid)
                const response = await fetch(EDIT_OCR_DATA_URL, {
                    method: 'POST',
                    body: new_form
                })
                console.log(data)
                const status_data = await response.json()
                if (status_data.status != 1) {
                    toast.error(status_data.message)
                    return
                }
                fetchBranchCustomers(bankCode, branch_code)
                setBankCode(bankCode);
                //setBranchCode(branch_code);
                setEntryToEdit({
                    aadhar_page1_url: data.data[0].aadhar_page1_url,
                    aadhar_page2_url: data.data[0].aadhar_page2_url,
                    pan_page1_url: data.data[0].pan_page1_url,
                    user_json: data.data[0].user_json.length > 0 ? JSON.parse(data.data[0].user_json) : "",
                    status: "-1",
                    aadhar_json: data.data[0].aadhar_json.length > 0 ? JSON.parse(data.data[0].aadhar_json) : "",
                    pan_josn: data.data[0].pan_json.length > 0 ? JSON.parse(data.data[0].pan_json) : "",
                    gid: data.data[0].gid,
                    customer_guid: data.data[0].customer_guid,
                    account_number: data.data[0].account_number,
                    bank_code: data.data[0].bank_code,
                    selie_url: data.data[0].selie_url,
                    sign_url: data.data[0].sign_url,
                    cif_number: data.data[0].cif_number,
                    created_on: data.data[0].created_on
                })
                sessionStorage.setItem('bank', bankCode);
                // sessionStorage.setItem('date', selectedDate)
                sessionStorage.setItem('branch', branch_code)
            } else {
                toast.error(data.message || 'No data found');
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error('Error fetching entries');
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBank || selectedBank === "Select a bank") {
            toast.error("Please select a valid branch");
            return;
        }
        if (!selectedBranch || selectedBank === "Select a bank") {
            toast.error("Please select a valid date");
            return;
        }
        fetchEntries(selectedBank, selectedBranch);
    };
    return (
        
        <>
            {!bankCode ? (
                loadingBanks ? (
                    <Loader />
                ) : (
                    <div className="w-[95%] max-w-5xl mx-auto rounded-lg p-6 bg-gray-100 shadow-md">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 md:flex-row md:flex-wrap">
                            {/* Bank Selector */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-[48%]">
                                <label htmlFor="bank-select" className="text-lg font-semibold text-gray-700 min-w-[100px]">
                                    Select Bank:
                                </label>
                                <select
                                    id="bank-select"
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedBank}
                                    onChange={(e) => {
                                        setSelectedBank(e.target.value);
                                        fetch_bank_branches(e.target.value);
                                    }}
                                >
                                    <option value="">Select a Value</option>
                                    {banks.map((bank) => (
                                        <option key={bank.bank_code} value={bank.bank_code}>
                                            {bank.bank_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Branch Selector */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-[48%]">
                                <label htmlFor="branch-select" className="text-lg font-semibold text-gray-700 min-w-[100px]">
                                    Select Branch:
                                </label>
                                <select
                                    id="branch-select"
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedBranch}
                                    onChange={(e) => {
                                        setSelectedBarnch(e.target.value);
                                        fetchBranchCustomers(selectedBank, e.target.value);
                                    }}
                                >
                                    <option value="">Select a Value</option>
                                    {branches.map((branch) => (
                                        <option key={branch.branch_code} value={branch.branch_code}>
                                            {branch.branch_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-900 transition-colors"
                                >
                                    Get Entries
                                </button>
                            </div>
                        </form>
                    </div>
                )
            ) : loading ? <Loader /> : <>
                {
                    entries.length === 0 ? (
                        <div>No record to show</div>
                    ) : (
                        <>
                            {
                                loading || loadingCustomers ? <Loader /> : (

                                    <>

                                    

                                        <div className="w-[100%] m-auto rounded-lg p-4 flex flex-col items-center gap-4">
                                            <div className='flex flex-row items-center w-full justify-between gap-6'>
                                                <div className='w-[80%] m-auto'>
                                                    <DropdownSearch items={customers} />
                                                </div>
                                                <button className='w-[20%] p-2 text-lg font-bold text-white bg-red-500 rounded-lg m-auto cursor-pointer shadow-lg' onClick={() => {
                                                            sessionStorage.removeItem("branch")
                                                            sessionStorage.removeItem("bank")
                                                            setBankCode("")
                                                            setSelectedBank("")
                                                        }}>Reset</button> 

                                            </div>

                                            <Window setEntries={setEntries} branch_code=''  {...entryToEdit} />

                                        </div>


                                    </>


                                )
                            }
                        </>
                    )
                }
            </>}
        </>
    

    );
};

export default Entries;
