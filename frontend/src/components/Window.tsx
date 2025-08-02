import { Loader, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState, type FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from '../types'
import { AnimatePresence, motion } from 'framer-motion';


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
  user_json: User,
  setEntries: React.Dispatch<React.SetStateAction<any>>,
}
interface image {
  src: string,
  name: string
}


const Window: React.FC<Props> = ({ gid, customer_guid, pan_page1_url,
  bank_code, aadhar_page1_url, aadhar_page2_url, selie_url, sign_url, user_json,cif_number, account_number , setEntries }) => {

  const [images, setImages] = useState<image[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [editedValues, setEditedValues] = useState<User>({
    aadhar_no: user_json.aadhar_no,
    father_name: user_json.father_name || "",
    pan_no: user_json.pan_no,
    address: user_json.address,
    name: user_json.name,
    dob: user_json.dob,
    gender: user_json.gender , 
    cif_number : cif_number,
    account_number :account_number
  })
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<number>(-1);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((val) => val === 0 ? images.length - 1 : val - 1)
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((val) => val === images.length - 1 ? 0 : val + 1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };
  useEffect(() => {
    console.log(aadhar_page1_url, aadhar_page2_url, pan_page1_url, sign_url, selie_url)
    setLoading(true)
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
    setLoading(false)
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
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          toast.success(data.message)
          setEntries([])
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
    formData.append("aadhar_json", editedValues.aadhar_no ||'')
    formData.append("pan_json", editedValues.pan_no|| '')
    formData.append("status", "1")

    try {
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          // DO something
          toast.success(data.message)
          setEntries([])
        }
      })
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  return (

    <>
      <Toaster />
      {
        loading ? <Loader /> : (
          <div className="bg-white m-auto rounded-lg shadow-xl w-[90%] max-h-auto overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">KYC Details</h2>

            <div className="flex flex-col items-center lg:flex-row gap-8 w-[90%]">
              {/* Image Slider */}
              <div className="flex flex-col items-center w-full lg:w-1/2">
                <div className="flex items-center justify-center gap-4 w-full">
                  <button
                    onClick={handlePrevious}
                    className="text-3xl text-gray-600 hover:text-black transition-colors"
                  >
                    ❮
                  </button>

                  <div className="relative w-[400px] h-[250px] overflow-hidden rounded-lg shadow-md">
                    <AnimatePresence custom={direction}>
                      {images.length > 0 && images[currentIndex] && (
                        <motion.img
                          key={currentIndex}
                          src={images[currentIndex].src}
                          custom={direction}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.5 }}
                          className="absolute w-full h-full object-cover cursor-pointer"
                          onClick={() => {
                            setEnlargedImage(currentIndex);
                          }}
                        />
                      )}

                    </AnimatePresence>
                  </div>

                  <button
                    onClick={handleNext}
                    className="text-3xl text-gray-600 hover:text-black transition-colors"
                  >
                    ❯
                  </button>
                </div>

                {/* Enlarged Image */}
                {enlargedImage >= 0 && (
                  <div className="w-[400px] mt-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">{images[enlargedImage].name}</p>
                      <X className="cursor-pointer" onClick={() => setEnlargedImage(-1)} />
                    </div>
                    <img src={images[enlargedImage].src} className="w-full rounded-lg shadow" />
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="w-full m-auto lg:w-1/2 space-y-6">
                <div className="space-y-4">
                  <div className='w-full flex justify-center lg:justify-start items-center gap-2'>
                    {
                      [{ label: "Aadhar Number", placeholder: "Enter user aadhaar number...", value: editedValues.aadhar_no, name: "aadhar_no" },
                      { label: "Pan Number", placeholder: "Enter user pan number...", value: editedValues.pan_no, name: "pan_no" },].map((field, index) => {
                        return (
                          <div key={index} className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className='w-full flex justify-center lg:justify-start items-center gap-2'>
                    {
                      [{ label: "Name", placeholder: "Enter user's name...", value: editedValues.name, name: "name" },
                      { label: "Father's Name", placeholder: "Enter user's father's name...", value: editedValues.father_name, name: "father_name" },].map((field, index) => {
                        return (
                          <div key={index} className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className='w-full flex justify-center lg:justify-start items-center gap-2'>
                    {
                      [
                        { label: "Gender", placeholder: "Enter user's gender", value: editedValues.gender, name: "gender" },
                        { label: "DOB", placeholder: "Enter user's dob", value: editedValues.dob, name: "dob" }
                      ].map((field, index) => {
                        return (
                          <div key={index} className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className='w-full flex justify-center lg:justify-start items-center gap-2'>
                    {
                      [
                        { label: "Account Number", placeholder: "Enter user's account number", value: editedValues.account_number, name: "account_number" },
                        { label: "CIF Number", placeholder: "Enter user's CIF Number", value: editedValues.cif_number, name: "cif_number" }
                      ].map((field, index) => {
                        return (
                          <div key={index} className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) =>
                                setEditedValues({
                                  ...editedValues,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  {[
                    { label: "Address", placeholder: "Enter user's address...", value: editedValues.address, name: "address" },
                  ].map((field, index) => (
                    <div key={index} className="space-y-2 flex flex-col items-center lg:items-start">
                      <label className="block text-center lg:text-start text-sm font-medium text-gray-700">{field.label}</label>
                      <textarea
                        rows={5}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            [field.name]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleClear("-3")}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("-2")}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Mark as Pending
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
export default Window
