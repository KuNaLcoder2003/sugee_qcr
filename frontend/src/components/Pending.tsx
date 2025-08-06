import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import type { KYCEntries, Edit, Branch } from '../types'
import EditWindow from './EditWindow'
import Loader from './Loader'
import EntryComp from './EntryComp'

const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`

const Pending = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [entries, setEntries] = useState<KYCEntries[]>([]);
  const [branchCode, setBranchCode] = useState<string>(sessionStorage.getItem('bank') || '');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBanks, setLoadingBanks] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const [entryToEdit, setEntryToEdit] = useState<Edit>({
    gid: '',
    account_number: '',
    cif_number: '',
    customer_guid: '',
    pan_page1_url: '',
    aadhar_page1_url: '',
    aadhar_page2_url: '',
    bank_code: '',
    branch_code: '',
    sign_url: '',
    selie_url: '',
    created_on : '',
    status : '',
    user_json: {
      account_number: '',
      cif_number: '',
      name: '',
      aadhar_no: '',
      father_name : '',
      pan_no: '',
      dob: '',
      gender: '',
      address: ''
    },
    aadhar_json: {
      aadhar_number: '',
      dob: '',
      address: '',
      gender: '',
      name: ''
    },
    pan_josn: {
      pan_number: '',
      name: '',
      father_name: '',
      dob: '',
    }
  })

  const loadBranches = async () => {
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
      setLoading(true);
      const formData = new FormData();
      formData.append("bank_code", bankCode);
      formData.append("status", "-2");
      formData.append("limit", "100");
      // const today = new Date();
      // const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      // formData.append("fromDate", formattedDate);
           const token = localStorage.getItem('authtoken'); // this could return null or a string

      const headers: HeadersInit = {
        ...(token && { 'Authorization': token })
      };
      const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();

      if (data.status === '1') {
        const parsedEntries: KYCEntries[] = data.data.map((entry: any) => ({
          ...entry,
          user_json: JSON.parse(entry.user_json),
          aadhar_json: JSON.parse(entry.aadhar_json),
          pan_josn: JSON.parse(entry.pan_josn)
        }));
        setEntries(parsedEntries);
        setBranchCode(bankCode);
        sessionStorage.setItem('bank', bankCode);
      } else {
        toast.error(data.message || 'No data found');
      }
    } catch (error) {
      toast.error('Error fetching entries');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedBank = sessionStorage.getItem('bank');
    if (!storedBank) {
      loadBranches();
    } else {
      fetchEntries(storedBank);
    }
  }, []);

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
          <Loader />
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
      ) : loading ? <Loader /> : (
        <>
          {entries.length === 0 ? (
            <div>No record to show</div>
          ) : (
            <div className="w-[95%] m-auto rounded-lg p-4">
              {isModalOpen && entryToEdit && (
                <div className='fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50'>
                  <EditWindow
                    entries={entries}
                    setIsModalOpen={setIsModalOpen}
                    setEntryToEdit={setEntryToEdit}
                    
                    setEntries={setEntries}
                    branch_code={entryToEdit.bank_code}
                    {...entryToEdit}
                  />
                </div>
              )}
              <div className="w-full p-2 flex flex-col items-center gap-2 bg-gray-100 rounded-lg">
                <div className="w-full text-center p-2 grid grid-cols-5 gap-4 text-lg font-bold">
                  <p className='truncate'>Aadhaar Number</p>
                  <p className='truncate'>Account Number</p>
                  <p className='truncate'>CIF Number</p>
                  <p className='truncate'>Branch Code</p>
                  <p className='truncate'>Edit</p>
                </div>
                {entries.map((entry) => (
                  <EntryComp
                    key={entry.gid}
                    {...entry}
                    setIsModalOpen={setIsModalOpen}
                    setEntryToEdit={setEntryToEdit}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Pending;
