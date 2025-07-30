import React from 'react'
import FormInput from './FormInput'

interface Props {
    styles?: string
}

const SignupForm : React.FC<Props> = ({}) => {
//   const [val, setVal] = useState("")
    

    return (
        <div className='w-[80%]'>
            <form className='flex flex-col gap-4 p-1'>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>First Name : </p>
                    <FormInput value={""} placeholder='Enter your first name...' type="text" styles='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>Last Name : </p>
                    <FormInput value={""} placeholder='Enter your last name...' type="text" styles='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>Password : </p>
                    <FormInput value={""} placeholder='Enter your email...' type="text" styles='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>Password : </p>
                    <FormInput value={""} placeholder='Enter your password...' type="password" styles='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <button className='w-[100%] m-auto p-2 bg-green-700 text-lg font-bold cursor-pointer rounded-lg text-white'>Signup</button>
            </form>
        </div>
    )
}

export default SignupForm
