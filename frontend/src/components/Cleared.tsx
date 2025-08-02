// import { useEffect, useState } from 'react'
// import { toast } from 'react-hot-toast'
// import type { KYCEntries, Edit, Branch } from '../types'
// import EditWindow from './EditWindow'
// import Loader from './Loader'
// import EntryComp from './EntryComp'

// const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
// const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`



// const Cleared = () => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
//   const [entries, setEntries] = useState<KYCEntries[]>([]);
//   const [branchCode, setBranchCode] = useState<string>(sessionStorage.getItem('bank') || '');
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [loadingBanks, setLoadingBanks] = useState<boolean>(false);
//   const [selectedBranch, setSelectedBranch] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false)
//   const [entryToEdit, setEntryToEdit] = useState<Edit>({
//     gid: "",
//     pan_page1_url: "",
//     bank_code: "",
//     aadhar_page1_url: "",
//     aadhar_page2_url: "",
//     selie_url: "",
//     customer_guid: "",
//     account_number: "",
//     cif_number: "",
//     sign_url: "",
//     aadhar_json: "",
//     created_on: "",
//     status: "",
//     user_json: {
//       aadhar_no: '',
//       pan_no: '',
//       father_name: '',
//       name: '',
//       gender: '',
//       dob: '',
//       address: '',
//       account_number : '',
//       cif_number : ''
//     }
//   })

//   const loadBranches = async () => {
//     setLoadingBanks(true);
//     try {
//       const res = await fetch(FETCH_BANKS_URL, { method: 'POST' });
//       const data = await res.json();
//       if (data.data) {
//         setBranches(data.data);
//       } else {
//         toast.error(data.message || 'Failed to fetch branches');
//       }
//     } catch (error: any) {
//       toast.error('Error fetching branches');
//     } finally {
//       setLoadingBanks(false);
//     }
//   };

//   const fetchEntries = async (bankCode: string) => {
//     try {
//       setLoading(true)
//       const formData = new FormData();
//       formData.append("bank_code", bankCode);
//       formData.append("status", "-3"); // fetch entry with status : -3 i.e cleared
//       formData.append("limit", "100"); // fetch one at a time
//       formData.append("fromDate", "7/29/2025 4:23:42 PM")

//       const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
//         method: 'POST',
//         body: formData
//       });
//       const data = await res.json();
//       if (data.status == '1') {
//         setEntries(data.data);
//         setBranchCode(bankCode);
//         setEntryToEdit({
//           aadhar_page1_url: data.data[0].aadhar_page1_url,
//           aadhar_page2_url: data.data[0].aadhar_page2_url,
//           pan_page1_url: data.data[0].pan_page1_url,
//           user_json: JSON.parse(data.data[0].user_json),
//           status: "-1",
//           aadhar_json: "",
//           gid: data.data[0].gid,
//           customer_guid: data.data[0].customer_guid,
//           account_number: "",
//           bank_code: data.data[0].bank_code,
//           selie_url: data.data[0].selie_url,
//           sign_url: data.data[0].sign_url,
//           cif_number: data.data[0].cif_number,
//           created_on: data.data[0].created_on
//         })
//         sessionStorage.setItem('bank', bankCode);
//       } else {
//         toast.error(data.message || 'No data found');
//       }
//       setLoading(false)
//     } catch (error) {
//       setLoading(false)
//       toast.error('Error fetching entries');
//     }
//   }

//   useEffect(() => {
//     const storedBank = sessionStorage.getItem('bank');
//     if (!storedBank) {
//       loadBranches();

//     } else {
//       fetchEntries(storedBank);
//     }
//   }, [entries.length === 0]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedBranch || selectedBranch === "Select a branch") {
//       toast.error("Please select a valid branch");
//       return;
//     }
//     fetchEntries(selectedBranch);
//   };
//   return (
//     <>
//       {!branchCode ? (
//         loadingBanks ? (
//           <Loader />
//         ) : (
//           <div className="w-[95%] m-auto rounded-lg p-4 bg-gray-100 shadow-md">
//             <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
//               <label htmlFor="branch-select" className="text-lg font-semibold text-gray-700">
//                 Select Branch:
//               </label>
//               <select
//                 id="branch-select"
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//               >
//                 <option value="">Select a Value</option>
//                 {branches.map((branch) => (
//                   <option key={branch.bank_code} value={branch.bank_code}>
//                     {branch.bank_name}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="submit"
//                 className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-900 transition-colors"
//               >
//                 Get Entries
//               </button>
//             </form>
//           </div>

//         )
//       ) : loading ? <Loader /> : <>
//         {
//           entries.length === 0 ? (
//             <div>No record to show</div>
//           ) : (
//             <div className="w-[95%] m-auto rounded-lg p-4">

//               {
//                 isModalOpen ? <div className='fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50'>
//                   <EditWindow entries={entries} setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} branch_code='' setEntries={setEntries} aadhar_json='' {...entryToEdit} />
//                 </div> : null
//               }
//               <div className="w-full p-2 flex flex-col items-center gap-2 bg-gray-100 rounded-lg">
//                 <div className="w-full text-center p-2 grid grid-cols-5 gap-4 text-lg font-bold">
//                   <p className='truncate'>Customer Guid</p>
//                   <p className='truncate'>Account Number</p>
//                   <p className='truncate'>CIF Number</p>
//                   <p className='truncate'>Branch Code</p>
//                   <p className='truncate'>Edit</p>
//                 </div>
//                 {entries.map((obj) => (
//                   <EntryComp setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} key={obj.gid} {...obj} user_json={entryToEdit.user_json} />
//                 ))}
//               </div>
//             </div>
//           )
//         }
//       </>}
//     </>
//   )
// }

// export default Cleared

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns' // ✅ Added for formatting date
import type { KYCEntries, Edit, Branch } from '../types'
import EditWindow from './EditWindow'
import Loader from './Loader'
import EntryComp from './EntryComp'

const FETCH_BANKS_URL = `${import.meta.env.VITE_FETCH_BANKS_URL}`
const FETCH_OCR_KYC_ENTRIES_URL = `${import.meta.env.VITE_FETCH_Entries_URL}`

const Cleared = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [entries, setEntries] = useState<KYCEntries[]>([]);
  const [branchCode, setBranchCode] = useState<string>(sessionStorage.getItem('bank') || '');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBanks, setLoadingBanks] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd'); // For <input type="date" />
  });
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
    user_json: {
      aadhar_no: '',
      pan_no: '',
      father_name: '',
      name: '',
      gender: '',
      dob: '',
      address: '',
      account_number : '',
      cif_number : ''
    }
  })

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
      formData.append("status", "-3");
      formData.append("limit", "100");

      const formattedDate = format(new Date(selectedDate), 'M/dd/yyyy h:mm:ss a');
      formData.append("fromDate", formattedDate); // ✅ uses selectedDate

      const res = await fetch(FETCH_OCR_KYC_ENTRIES_URL, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status == '1') {
        setEntries(data.data);
        setBranchCode(bankCode);
        setEntryToEdit({
          aadhar_page1_url: data.data[0].aadhar_page1_url,
          aadhar_page2_url: data.data[0].aadhar_page2_url,
          pan_page1_url: data.data[0].pan_page1_url,
          user_json: JSON.parse(data.data[0].user_json),
          status: "-1",
          aadhar_json: "",
          gid: data.data[0].gid,
          customer_guid: data.data[0].customer_guid,
          account_number: "",
          bank_code: data.data[0].bank_code,
          selie_url: data.data[0].selie_url,
          sign_url: data.data[0].sign_url,
          cif_number: data.data[0].cif_number,
          created_on: data.data[0].created_on
        })
        sessionStorage.setItem('bank', bankCode);
      } else {
        toast.error(data.message || 'No data found');
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error fetching entries');
    }
  }

  useEffect(() => {
    const storedBank = sessionStorage.getItem('bank');
    if (!storedBank) {
      loadBranches();
    } else {
      fetchEntries(storedBank);
    }
  }, [entries.length === 0]);

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
                    {branch.bank_name}
                  </option>
                ))}
              </select>

              {/* ✅ Date Picker Added */}
              <label htmlFor="date" className="text-lg font-semibold text-gray-700">
                Select Date:
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-900 transition-colors"
              >
                Get Entries
              </button>
            </form>
          </div>
        )
      ) : loading ? <Loader /> : <>
        {
          entries.length === 0 ? (
            <div>No record to show</div>
          ) : (
            <div className="w-[95%] m-auto rounded-lg p-4">
              {
                isModalOpen ? <div className='fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50'>
                  <EditWindow entries={entries} setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} branch_code='' setEntries={setEntries} aadhar_json='' {...entryToEdit} />
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
                  <EntryComp setIsModalOpen={setIsModalOpen} setEntryToEdit={setEntryToEdit} key={obj.gid} {...obj} user_json={entryToEdit.user_json} />
                ))}
              </div>
            </div>
          )
        }
      </>}
    </>
  )
}

export default Cleared

