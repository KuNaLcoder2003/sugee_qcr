import { X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState, type FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Edit, KYCEntries, User } from '../types'


const EDIT_OCR_DATA_URL = `${import.meta.env.VITE_UPDATE_OCR_DATA}`
// interface Edit {
//   gid: string,
//   pan_page1_url: string,
//   bank_code: string,
//   aadhar_page1_url: string
//   aadhar_page2_url: string,
//   selie_url: string,
//   customer_guid: string,
//   account_number: string,
//   branch_code?: string,
//   cif_number: string,
//   sign_url: string,
//   aadhar_json?: string,
//   user_json: User
//   created_on: string,
//   status: string,
// }

interface Props {
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
  aadhar_json: string;
  created_on: string;
  status: string;
  setEntryToEdit: React.Dispatch<React.SetStateAction<Edit>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  user_json: User,
  setEntries: React.Dispatch<React.SetStateAction<any>>,
  entries: KYCEntries[]
}


const EditWindow: React.FC<Props> = ({ gid, customer_guid, pan_page1_url,
  bank_code, aadhar_page1_url, aadhar_page2_url, selie_url, sign_url, user_json, setEntries, setIsModalOpen, setEntryToEdit, entries }) => {

  const [images, setImages] = useState<any[]>([])
  const [enlargedImage, setEnlargedImage] = useState<number>(-1)
  const [editedValues, setEditedValues] = useState<User>({
    aadhar_no: user_json.aadhar_no,
    father_name: user_json.father_name || "",
    pan_no: user_json.pan_no,
    address: user_json.address,
    name: user_json.name,
    dob: user_json.dob,
    gender: user_json.gender
  })

  useEffect(() => {
    setImages([{
      name: 'Aadhaar Card - 1',
      src: aadhar_page1_url
    },
    {
      name: 'Aadhaar Card -2',
      src: aadhar_page2_url
    },
    {
      name: 'Pan Card',
      src: pan_page1_url
    },
    {
      name: 'Selfie',
      src: selie_url
    },
    {
      name: 'Signature',
      src: sign_url
    }
    ])
  }, [])


  const handleClear = (status: string) => {
    const formData = new FormData()
    formData.append('user_json', JSON.stringify(editedValues))
    formData.append("customer_guid", customer_guid)
    formData.append("gid", gid)
    formData.append("bank_code", bank_code)
    // formData.append("aadhar_json", editedValues.aadhar_no)
    // formData.append("pan_json", editedValues.pan_no)
    formData.append("status", status)
    try {
      fetch(EDIT_OCR_DATA_URL, {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          toast.success(data.message)
          let filtered = entries.filter(obj => obj.customer_guid !== customer_guid)
          setEntries(filtered)
        }
      })
    } catch (error) {
      toast.error(`${error}`)
    }

  }



  const handleSubmit = (e: FormEvent) => {

    e.preventDefault()
    const formData = new FormData()
    formData.append('bank_code', bank_code)
    formData.append("customer_guid", customer_guid)
    formData.append("gid", gid)
    formData.append("aadhar_json", editedValues.aadhar_no)
    formData.append("pan_json", editedValues.pan_no)
    formData.append("status", "1")

    try {
      fetch(EDIT_OCR_DATA_URL, {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          // DO something
          toast.success(data.message)
          let filtered = entries.filter(obj => obj.customer_guid !== customer_guid)
          setEntries(filtered)

        }
      })
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (

    <>
      <Toaster />
      <div className="bg-white m-auto rounded-lg shadow-xl w-full max-w-2xl max-h-auto overflow-y-auto">
        <form onSubmit={(e) => handleSubmit(e)} className="p-6">
          {/* Modal Header */}
          <div className='flex items-center justify-between'>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 ">
              KYC Details
            </h2>

            <X className='cursor-pointer' onClick={() => {
              setIsModalOpen(false)
              setEntryToEdit({
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
                  address: ''
                }
              })
            }} />

          </div>

          {
            enlargedImage < 0 ? null : (
              <div className='w-[70%] m-auto'>
                <div className='flex items-center justify-between'>
                  <p>{images[enlargedImage].name}</p>
                  <X className='cursor-pointer' onClick={() => setEnlargedImage(-1)} />

                </div>
                <img src={images[enlargedImage].src} className='w-full h-auto' />
              </div>
            )
          }

          {/* Image Placeholders Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((obj, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setEnlargedImage(index)
                  }}
                  className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <img src={obj.src} alt='Error' className='cursor-pointer' />
                  <span className="text-sm text-gray-500 font-medium">
                    {obj.name}
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* Text Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Details</h3>
            <div className="space-y-4">
              {[
                { label: "Aadhar Number", placeholder: "Enter user aadhaar number...", value: editedValues.aadhar_no, name: "aadhar_no" },
                { label: "Pan Number", placeholder: "Enter user pan number...", value: editedValues.pan_no, name: "pan_no" },
                { label: "Name", placeholder: "Enter user's name...", value: editedValues.name, name: "name" },
                { label: "Father's Name", placeholder: "Enter user's father's name...", value: editedValues.father_name, name: "father_name" },
                { label: "Address", placeholder: "Enter user's address...", value: editedValues.address, name: "address" },
                { label: "Gender", placeholder: "Enter user's gender", value: editedValues.gender, name: "gender" },
                { label: "DOB", placeholder: "Enter user's dob", value: editedValues.dob, name: "dob" }
              ].map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {
                    index == 4 ? <textarea
                      rows={5}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => {
                        setEditedValues({
                          ...editedValues,
                          [field.name]: e.target.value
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"/> : <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => {
                        setEditedValues({
                          ...editedValues,
                          [field.name]: e.target.value
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  }

                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { handleClear("-3") }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-gray-300 cursor-pointer rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => { handleClear("-2") }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-gray-300 cursor-pointer rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Mark Pending
            </button>
            <button
              type="submit"
              className="px-6 py-2 cursor-pointer text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default EditWindow