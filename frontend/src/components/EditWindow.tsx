import { X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState, type FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Edit {
  gid: string,
  pan_page1_url: string,
  bank_code: string,
  aadhar_page1_url: string
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
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEntryToEdit: React.Dispatch<React.SetStateAction<Edit>>
}

const EditWindow: React.FC<Props> = ({ gid, customer_guid, pan_page1_url, setIsModalOpen,
  bank_code, branch_code, aadhar_page1_url, aadhar_page2_url, selie_url, sign_url, account_number, cif_number, created_on, status, setEntryToEdit }) => {

  const [images, setImages] = useState<any[]>([])
  const [enlargedImage, setEnlargedImage] = useState<number>(-1)
  const [editedValues, setEditedValues] = useState({
    aadhar_no: account_number,
    pan_no: cif_number,

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

  const handleClear = () => {
    const formData = new FormData()
    formData.append('bank_code', bank_code)
    formData.append("customer_guid", customer_guid)
    formData.append("gid", gid)
    formData.append("aadhar_json", editedValues.aadhar_no)
    formData.append("pan_json", editedValues.pan_no)
    formData.append("status", "-1")
    try {
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if(data.status == '1') {
          toast.success(data.message)
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
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
      })
    } catch (error) {
      toast.error(`${error}`)
    }
  }
  return (

    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                { label: "Account Number", placeholder: "Enter title...", value: editedValues.aadhar_no },
                { label: "CIF Number", placeholder: "Enter description...", value: editedValues.pan_no },
                { label: "Bank Code", placeholder: "Enter bank code...", value: bank_code },
                { label: "Created On", placeholder: "Enter date...", value: created_on },
                { label: "Location", placeholder: "Enter location..." }
              ].map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => {
                      if (index == 0) {
                        setEditedValues({
                          ...editedValues,
                          aadhar_no: e.target.value
                        })
                      } else if (index == 1) {
                        setEditedValues({
                          ...editedValues,
                          pan_no: e.target.value
                        })
                      } else {
                        return
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { handleClear() }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-gray-300 cursor-pointer rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Clear
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