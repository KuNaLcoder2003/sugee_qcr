import { ChevronDown, ChevronUp, Loader } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Aadhaar, Pan, User, USER_AADHAAR_PAN } from '../types'
import { AnimatePresence, motion } from 'framer-motion';
import ImageModal from './ImageModal';

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
  aadhar_json: Aadhaar;
  pan_josn: Pan
  created_on: string;
  status: string;
  user_json: User,
  setEntries: React.Dispatch<React.SetStateAction<any>>,
}
interface image {
  src: string,
  name: string
}
interface Relation {
  data: string,
  value: string
}


const Window: React.FC<Props> = ({ gid, customer_guid, pan_page1_url,
  bank_code, aadhar_page1_url, aadhar_page2_url, selie_url, sign_url, user_json, aadhar_json, pan_josn, cif_number, account_number, setEntries }) => {

  const [images, setImages] = useState<image[]>([])
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>(
    images.map(() => ({ status: '', reason: '', key: '' }))
  );
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [remarks, setRemarks] = useState<any[]>([])
  const handleCheckboxChange = (status: string) => {
    const updatedStatuses = [...imageStatuses];
    updatedStatuses[currentIndex].status = status;

    if (status === 'not_ok') {
      const formData = new FormData()
      formData.append('bank_code', bank_code)
      fetch('https://sugee.io/KYCServiceAPI/kycapi/getQCRemarks', {
        method: 'POST',
        body: formData
      }).then(async (response: Response) => {
        const data = await response.json()
        if (data.status == '1') {
          setRemarks(data.data)
        } else {
          setRemarks([])
        }
      })
      setShowReasonPopup(true);
    } else {
      updatedStatuses[currentIndex].reason = '';
    }

    setImageStatuses(updatedStatuses);
  };
  useEffect(() => {
    if (images.length > 0) {
      setImageStatuses(images.map((img) => ({ status: '', reason: '', key: img.name })));
    } 
  }, [images])

  const handleReasonSubmit = (reason: any) => {
    const updatedStatuses = [...imageStatuses];
    updatedStatuses[currentIndex].reason = reason;
    setImageStatuses(updatedStatuses);
    setShowReasonPopup(false);
  };
  // const [reason, setReason] = useState<string>('');
  // const [isReasonOpen, setIsReasonOpen] = useState<boolean>(false)
  const [relations, setRelations] = useState<Relation[]>([])
  const [boxOpen, setBoxOpen] = useState<"Aadhaar" | "Pan">("Aadhaar")
  const [loading, setLoading] = useState<boolean>(false)
  const [editedValues, setEditedValues] = useState<USER_AADHAAR_PAN>({
    user_json: {
      account_number: account_number,
      cif_number: cif_number,
      name: user_json.name,
      father_name: user_json.father_name,
      aadhar_no: user_json.aadhar_no,
      pan_no: user_json.pan_no,
      dob: user_json.dob,
      gender: user_json.gender,
      address: user_json.address
    },
    aadhar_json: {
      aadhar_number: aadhar_json.aadhar_number,
      dob: aadhar_json.dob,
      address: aadhar_json.address,
      gender: aadhar_json.gender,
      name: aadhar_json.name,
      relation: aadhar_json.relation,
      relation_name: aadhar_json.relation_name
    },
    pan_josn: {
      pan_number: pan_josn.pan_number,
      name: pan_josn.name,
      father_name: pan_josn.father_name,
      dob: pan_josn.dob
    }
  })
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<number>(-1);


  const handlePrevious = () => {
    setDirection(-1);
    console.log(direction)
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
    setLoading(true)
    try {
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
      const formData = new FormData()
      formData.append('bank_code', bank_code)
      fetch('https://sugee.io/KYCServiceAPI/kycapi/getRelationList', {
        method: 'POST',
        body: formData
      }).then(async (response) => {
        const data = await response.json()
        if (data.status == '1') {
          setRelations(data.data)
        } else {
          setRelations([])
        }
      })
      setLoading(false)

    } catch (error) {
      setLoading(false)
    }
  }, [])
  interface ImageStatus {
    status : string,
    reason : string,
    key : string,
  }
  const handleClear = (status: string, imageStatus : ImageStatus[]) => {
    const formData = new FormData()
    formData.append('user_json', JSON.stringify(editedValues.user_json))
    formData.append("customer_guid", customer_guid)
    formData.append("gid", gid)
    formData.append("bank_code", bank_code)
    formData.append("aadhar_json", JSON.stringify(editedValues.aadhar_json))
    formData.append("pan_json", JSON.stringify(editedValues.pan_josn))
    formData.append("status", status)
    console.log('image status recvd as params : ' , imageStatus)
    if(imageStatus?.length > 0) {
      formData.append("aadhaar_status" , `${imageStatus[0].status == 'ok' ? 1 : 0}`)
      formData.append("aadhaar_status_remarks" , `${imageStatus[0].reason}`)
      formData.append("pan_status" , `${imageStatus[2].status == 'ok' ? 1 : 0}`)
      formData.append("pan_status_remarks" , `${imageStatus[2].reason}`)
      formData.append("sign_status" , `${imageStatus[3].status == 'ok' ? 1 : 0}`)
      formData.append("sign_status_remarks" , `${imageStatus[3].reason}`)
      formData.append("selfi_status" , `${imageStatus[4].status == 'ok' ? 1 : 0}`)
      formData.append("selfie_status_remarks" , `${imageStatus[4].reason}`)

    }
    // console.log(imageStatus)
   
    try {
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          toast.success(data.message)
          console.log('Api ka response on hold' , data)
          setEntries([])
        }
      })
    } catch (error) {
      toast.error(`${error}`)
    }

  }
  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('bank_code', bank_code)
    formData.append("customer_guid", customer_guid)
    formData.append("gid", gid)
    formData.append("aadhar_json", JSON.stringify(editedValues.aadhar_json))
    formData.append('user_json', JSON.stringify(editedValues.user_json))
    formData.append("pan_json", JSON.stringify(editedValues.pan_josn))
    formData.append("status", "1")
    // console.log('this is the aadhr_josn being submited : ', JSON.stringify(editedValues.aadhar_json), '\n', editedValues.aadhar_json)
    // console.log('this is the pan_josn being submited : ', JSON.stringify(editedValues.pan_josn), '\n', editedValues.pan_josn)
    // console.log('this is the user_josn being submited : ', JSON.stringify(editedValues.user_json), '\n', editedValues.user_json)

    try {
      fetch('https://sugee.io/KYCServiceAPI/kycapi/updateOCRData', {
        method: 'POST',
        body: formData
      }).then(async (res: Response) => {
        const data = await res.json()
        if (data.status == '1') {
          // DO something
          toast.success(data.message)
          console.log('Data after submitting(from backend) : ', data.data)
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
            <div className="w-full flex flex-col flex-wrap md:flex-row items-center justify-between p-2 gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 text-center md:text-left">
                KYC Details
              </h2>

              <div className="flex flex-col m-auto flex-wrap overflow-x-hidden sm:flex-row items-center gap-4 w-full md:w-auto">
                {/* Account Number */}
                <div className="flex flex-col lg:flex-row items-center gap-2 w-full sm:w-auto">
                  <p className="whitespace-nowrap">Account Number :</p>
                  <input
                    type="text"
                    placeholder="Enter account number..."
                    value={editedValues.user_json.account_number}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        user_json: {
                          ...editedValues.user_json,
                          account_number: e.target.value
                        },
                      })
                    }
                    className="w-full sm:w-48 md:w-56 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* CIF Number */}
                <div className="flex flex-col lg:flex-row items-center gap-2 w-full sm:w-auto">
                  <p className="whitespace-nowrap">CIF Number : &nbsp; &nbsp; &nbsp; &nbsp; </p>
                  <input
                    type="text"
                    placeholder="Enter CIF number..."
                    value={editedValues.user_json.cif_number}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        user_json: {
                          ...editedValues.user_json,
                          cif_number: e.target.value
                        },
                      })
                    }
                    className="w-full sm:w-48 md:w-56 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {enlargedImage >= 0 &&
              <ImageModal
                imageUrl={images[enlargedImage].src}
                image_name={images[enlargedImage].name}
                setIsMoadlOpen={setEnlargedImage} />
            }


            <div className="flex flex-col items-center m-auto lg:flex-row gap-8 w-[90%]">
              {/* Image Slider */}
              <div className="flex flex-col items-center w-full lg:w-1/2">
                <div className="flex items-center justify-center gap-4 w-full">
                  <button
                    onClick={handlePrevious}
                    className="text-3xl text-gray-600 hover:text-black transition-colors"
                  >
                    ❮
                  </button>

                  {/* <div className="relative w-[400px] h-[250px] overflow-hidden rounded-lg shadow-md">
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
                  </div> */}
                  <div className="relative w-[400px] h-[250px] overflow-hidden rounded-lg shadow-md">
                    <AnimatePresence>
                      {images.length > 0 && images[currentIndex] && (
                        <motion.img
                          key={currentIndex}
                          src={images[currentIndex].src}
                          variants={variants}

                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.5 }}
                          className="absolute w-full h-full object-cover cursor-pointer"
                          onClick={() => setEnlargedImage(currentIndex)}
                        />
                      )}
                    </AnimatePresence>


                    <div className="absolute bottom-2 left-2 bg-white/80 px-4 py-1 rounded shadow flex gap-4 z-10">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={imageStatuses[currentIndex]?.status === 'ok'}
                          onChange={() => handleCheckboxChange('ok')}
                        />
                        OK
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={imageStatuses[currentIndex]?.status === 'not_ok'}
                          onChange={() => handleCheckboxChange('not_ok')}
                        />
                        Not OK
                      </label>
                    </div>


                    {showReasonPopup && (
                      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                          <h2 className="text-lg font-semibold mb-2">Please select a reason</h2>

                          <select
                            className="w-full p-2 border rounded"
                            value={imageStatuses[currentIndex].reason}
                            onChange={(e) =>
                              setImageStatuses((prev) => {
                                const newStatuses = [...prev];
                                newStatuses[currentIndex].reason = e.target.value;
                                console.log(imageStatuses)
                                return newStatuses;
                              })
                            }
                          >
                            <option value="">Select a reason</option>
                            {
                              remarks.map(remark => {
                                return <option
                                  value={remark.remarks}
                                  key={remark.category}
                                >{remark.remarks}</option>
                              })
                            }
                            {/* <option value="Blurry image">Blurry image</option>
                            <option value="Wrong angle">Wrong angle</option>
                            <option value="Incomplete object">Incomplete object</option>
                            <option value="Poor lighting">Poor lighting</option>
                            <option value="Other">Other</option> */}
                          </select>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={() => setShowReasonPopup(false)}
                              className="px-4 py-2 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleReasonSubmit(imageStatuses[currentIndex].reason)
                              }
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={handleNext}
                    className="text-3xl text-gray-600 hover:text-black transition-colors"
                  >
                    ❯
                  </button>
                </div>

                {/* Enlarged Image */}


              </div>

              {/* Form Inputs */}
              <div className="w-full m-auto lg:w-1/2 space-y-6">
                <div className="flex flex-col gap-4 items-baseline">
                  {/* Aadhaar box */}

                  <div className='space-y-4 w-full mt-4 p-1 border border-gray-300 rounded-md shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-xl font-bold'>Aadhaar Details</h3>
                      {
                        (boxOpen == "Aadhaar") ? <ChevronUp className='cursor-pointer' onClick={() => setBoxOpen("Pan")} /> : <ChevronDown className='cursor-pointer' onClick={() => setBoxOpen("Aadhaar")} />
                      }
                    </div>
                    {
                      boxOpen == "Aadhaar" && (
                        <>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [{ label: "Aadhar Number", placeholder: "Enter user aadhaar number...", value: editedValues.aadhar_json.aadhar_number, name: "aadhar_number" }].map((field, index) => {
                                return (
                                  <div key={`${index}_${field.name}`} className='flex flex-col'>
                                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                    <input
                                      type="text"
                                      required
                                      placeholder={field.placeholder}
                                      value={field.value}
                                      onChange={(e) => {
                                        setEditedValues({
                                          ...editedValues,
                                          user_json: {
                                            ...editedValues.user_json,
                                            aadhar_no: e.target.value
                                          },
                                          aadhar_json: {
                                            ...editedValues.aadhar_json,
                                            [field.name]: e.target.value
                                          },

                                        })
                                        console.log(editedValues)
                                      }
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                  </div>
                                )
                              })
                            }
                          </div>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [{ label: "Name", placeholder: "Enter user's name...", value: editedValues.aadhar_json.name, name: "name" }].map((field, index) => {
                                return (
                                  <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                    <input
                                      type="text"
                                      required
                                      placeholder={field.placeholder}
                                      value={field.value}
                                      onChange={(e) =>
                                        setEditedValues({
                                          ...editedValues,
                                          user_json: {
                                            ...editedValues.user_json,
                                            ...(field.name === "name" && { name: e.target.value }),
                                          },
                                          aadhar_json: {
                                            ...editedValues.aadhar_json,
                                            [field.name]: e.target.value,
                                          }

                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                  </div>
                                )
                              })
                            }
                          </div>

                          <div className='w-full flex items-center gap-2'>
                            {
                              [
                                {
                                  label: "relation",
                                  placeholder: "Select relation...",
                                  value: editedValues.aadhar_json.relation,
                                  name: "relation",
                                  options: relations,
                                }
                              ].map((field, index) => {
                                return (
                                  <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                    <select
                                      required
                                      value={field.value}
                                      onChange={(e) =>
                                        setEditedValues({
                                          ...editedValues,
                                          aadhar_json: {
                                            ...editedValues.aadhar_json,
                                            [field.name]: e.target.value,
                                          }
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                      <option value="" disabled>{field.placeholder}</option>
                                      {field.options.map((opt) => (
                                        <option key={opt.data} value={opt.value}>
                                          {opt.value}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })
                            }
                          </div>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [
                                { label: "Relation Name", placeholder: "Enter relation's name...", value: editedValues.aadhar_json.relation_name, name: "relation_name" },].map((field, index) => {
                                  return (
                                    <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                      <input
                                        type="text"
                                        required
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={(e) =>
                                          setEditedValues({
                                            ...editedValues,
                                            // user_json: {
                                            //   ...editedValues.user_json,
                                            //   ...(field.name === "name" && { name: e.target.value }),
                                            // },
                                            aadhar_json: {
                                              ...editedValues.aadhar_json,
                                              [field.name]: e.target.value,
                                            }

                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  )
                                })
                            }
                          </div>

                          {/* <div className='w-full flex items-center gap-2'>
                            {
                              [
                                { label: "Gender", placeholder: "Enter user's gender", value: editedValues.aadhar_json.gender, name: "gender" },
                                { label: "DOB", placeholder: "Enter user's dob", value: editedValues.aadhar_json.dob, name: "dob" }
                              ].map((field, index) => {
                                return (
                                  <div key={`${index}_${field.name}`} className='flex flex-col'>
                                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                    <input
                                      required
                                      type="text"
                                      placeholder={field.placeholder}
                                      value={field.value}
                                      onChange={(e) =>
                                        setEditedValues({
                                          ...editedValues,
                                          user_json: {
                                            ...editedValues.user_json,
                                            [field.name]: e.target.value
                                          },
                                          aadhar_json: {
                                            ...editedValues.aadhar_json,
                                            [field.name]: e.target.value,
                                          }
                                        })
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                  </div>
                                )
                              })
                            }
                          </div> */}
                          <div className='w-full flex items-center gap-6'>
                            {
                              [
                                {
                                  label: "Gender & DOB",
                                  placeholder: "Select user's gender",
                                  value: editedValues.aadhar_json.gender,
                                  name: "gender",
                                  type: "gender"
                                },
                                {
                                  label: "DOB",
                                  name: "dob",
                                  type: "dob"
                                }
                              ].map((field, index) => {
                                if (field.type === "dob") {
                                  // Extract and manage DOB values
                                  const [year, month, day] = (editedValues.aadhar_json.dob?.split("-") || ["", "", ""]);

                                  const currentYear = new Date().getFullYear();
                                  const years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);
                                  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
                                  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

                                  const handleDobChange = (newVal: string, part: "year" | "month" | "day") => {
                                    const newYear = part === "year" ? newVal : year;
                                    const newMonth = part === "month" ? newVal : month;
                                    const newDay = part === "day" ? newVal : day;

                                    // Only update if all are selected, else keep partial
                                    const dobString = `${newYear}-${newMonth}-${newDay}`;
                                    setEditedValues(prev => ({
                                      ...prev,
                                      aadhar_json: {
                                        ...prev.aadhar_json,
                                        dob: dobString
                                      }
                                    }));
                                  };

                                  return (
                                    <div key={field.name} className='flex flex-col'>
                                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label> */}
                                      <div className="flex gap-4">
                                        {/* Year */}
                                        <div className="flex flex-col">
                                          <label htmlFor="dob-year" className="text-xs text-gray-500 mb-1">Year</label>
                                          <select
                                            id="dob-year"
                                            value={year}
                                            onChange={(e) => handleDobChange(e.target.value, "year")}
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                          >
                                            <option value="">YYYY</option>
                                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                                          </select>
                                        </div>

                                        {/* Month */}
                                        <div className="flex flex-col">
                                          <label htmlFor="dob-month" className="text-xs text-gray-500 mb-1">Month</label>
                                          <select
                                            id="dob-month"
                                            value={month}
                                            onChange={(e) => handleDobChange(e.target.value, "month")}
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                          >
                                            <option value="">MM</option>
                                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                                          </select>
                                        </div>

                                        {/* Day */}
                                        <div className="flex flex-col">
                                          <label htmlFor="dob-day" className="text-xs text-gray-500 mb-1">Day</label>
                                          <select
                                            id="dob-day"
                                            value={day}
                                            onChange={(e) => handleDobChange(e.target.value, "day")}
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                          >
                                            <option value="">DD</option>
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (field.type === "gender") {
                                  return (
                                    <div key={`${index}_${field.name}`} className='flex flex-col'>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                      <select
                                        required
                                        value={field.value}
                                        onChange={(e) =>
                                          setEditedValues(prev => ({
                                            ...prev,
                                            user_json: {
                                              ...prev.user_json,
                                              [field.name]: e.target.value
                                            },
                                            aadhar_json: {
                                              ...prev.aadhar_json,
                                              [field.name]: e.target.value
                                            }
                                          }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                      </select>
                                    </div>
                                  );
                                }

                                return null;
                              })
                            }
                          </div>



                          {[
                            { label: "Address", placeholder: "Enter user's address...", value: editedValues.aadhar_json.address, name: "address" },
                          ].map((field, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                              <textarea
                                required
                                rows={5}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={(e) =>
                                  setEditedValues({
                                    ...editedValues,
                                    aadhar_json: {
                                      ...editedValues.aadhar_json,
                                      [field.name]: e.target.value,
                                    }
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                          ))}
                        </>
                      )
                    }
                  </div>
                  {/* Pan Box */}
                  <div className='space-y-4 w-full mt-4 p-1 border border-gray-300 rounded-md shadow-sm'>
                    <div className='flex w-full items-center justify-between'>
                      <h3 className='text-xl font-bold'>Pan Details</h3>
                      {
                        (boxOpen == "Pan") ? <ChevronUp className='cursor-pointer' onClick={() => setBoxOpen("Aadhaar")} /> : <ChevronDown className='cursor-pointer' onClick={() => setBoxOpen("Pan")} />
                      }
                    </div>
                    {
                      boxOpen == "Pan" && (
                        <>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [
                                { label: "Pan Number", placeholder: "Enter user pan number...", value: editedValues.pan_josn.pan_number, name: "pan_number" },].map((field, index) => {
                                  return (
                                    <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                      <input
                                        required
                                        type="text"
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={(e) =>
                                          setEditedValues({
                                            ...editedValues,
                                            user_json: {
                                              ...editedValues.user_json,
                                              pan_no: e.target.value
                                            },
                                            pan_josn: {
                                              ...editedValues.pan_josn,
                                              [field.name]: e.target.value,
                                            }
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  )
                                })
                            }
                          </div>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [
                                { label: "Name on Pan", placeholder: "Enter user name...", value: editedValues.pan_josn.name, name: "name" },].map((field, index) => {
                                  return (
                                    <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                      <input
                                        required
                                        type="text"
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={(e) =>
                                          setEditedValues({
                                            ...editedValues,
                                            pan_josn: {
                                              ...editedValues.pan_josn,
                                              [field.name]: e.target.value,
                                            }
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  )
                                })
                            }
                          </div>
                          <div className='w-full flex items-center gap-2'>
                            {
                              [
                                { label: "Father Name on Pan", placeholder: "Enter user father's name...", value: editedValues.pan_josn.father_name, name: "father_name" },].map((field, index) => {
                                  return (
                                    <div key={`${index}_${field.name}`} className='flex flex-col w-full'>
                                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                      <input
                                        required
                                        type="text"
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={(e) =>
                                          setEditedValues({
                                            ...editedValues,
                                            user_json: {
                                              ...editedValues.user_json,
                                              father_name: e.target.value
                                            },
                                            pan_josn: {
                                              ...editedValues.pan_josn,
                                              [field.name]: e.target.value,
                                            }
                                          })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  )
                                })
                            }
                          </div>
                          <div className="w-full flex items-center gap-2">
                            {[
                              {
                                label: "DOB",
                                name: "dob"
                              }
                            ].map((field, index) => {
                              // Extract parts from editedValues.pan_josn.dob
                              const dobParts = editedValues.pan_josn.dob?.split("-") || ["", "", ""];
                              const [month, day, year] = dobParts;

                              // Generate options
                              const currentYear = new Date().getFullYear();
                              const years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);
                              const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
                              const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

                              const handleDobChange = (value: string, part: "year" | "month" | "day") => {
                                const updated = {
                                  year: part === "year" ? value : year,
                                  month: part === "month" ? value : month,
                                  day: part === "day" ? value : day
                                };

                                const formattedDob = `${updated.month}-${updated.day}-${updated.year}`;

                                setEditedValues({
                                  ...editedValues,
                                  user_json: {
                                    ...editedValues.user_json,
                                    dob: formattedDob
                                  },
                                  pan_josn: {
                                    ...editedValues.pan_josn,
                                    dob: formattedDob
                                  }
                                });
                              };

                              return (
                                <div key={`${index}_${field.name}`} className="flex flex-col w-full">
                                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                  <div className="flex gap-4 mt-1">
                                    {/* Year */}
                                    <div className="flex flex-col">
                                      <label className="text-xs text-gray-500 mb-1" htmlFor="dob-year">Year</label>
                                      <select
                                        id="dob-year"
                                        value={year}
                                        onChange={(e) => handleDobChange(e.target.value, "year")}
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                      >
                                        <option value="">YYYY</option>
                                        {years.map((y) => (
                                          <option key={y} value={y}>{y}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Month */}
                                    <div className="flex flex-col">
                                      <label className="text-xs text-gray-500 mb-1" htmlFor="dob-month">Month</label>
                                      <select
                                        id="dob-month"
                                        value={month}
                                        onChange={(e) => handleDobChange(e.target.value, "month")}
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                      >
                                        <option value="">MM</option>
                                        {months.map((m) => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Day */}
                                    <div className="flex flex-col">
                                      <label className="text-xs text-gray-500 mb-1" htmlFor="dob-day">Day</label>
                                      <select
                                        id="dob-day"
                                        value={day}
                                        onChange={(e) => handleDobChange(e.target.value, "day")}
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                      >
                                        <option value="">DD</option>
                                        {days.map((d) => (
                                          <option key={d} value={d}>{d}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => handleClear("-3" , imageStatuses)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleClear("-2" ,imageStatuses)}
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Hold
                  </button>
                  {/* <button
                    type="submit"
                    disabled={imageStatuses.find(obj => obj.status=="not_ok") ? true : false}
                    onClick={handleSubmit}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button> */}
                  <button
                    type="submit"
                    disabled={imageStatuses.some(obj => obj.status === 'not_ok')}
                    onClick={handleSubmit}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
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
