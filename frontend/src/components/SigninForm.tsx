import React, { useState } from 'react'
import { useAuth } from '../context/authContext'

interface Props {
    styles?: string
}


const SigninForm: React.FC<Props> = ({ }) => {
    const [val, setVal] = useState({
        phone_no : "",
        password : "",
    })
    const {login } = useAuth()

    return (
        <div className='w-[80%]'>
            <form className='flex flex-col gap-4 p-1'>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>Email : </p>
                    <input onChange={(e)=> {
                        setVal({
                            ...val ,
                            phone_no : e.target.value
                        })
                    }} value={val.phone_no} placeholder='Enter your email...' type="text" className='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <div className='flex flex-col gap-4 items-baseline'>
                    <p className='text-xl font-bold'>Password : </p>
                    <input onChange={(e)=> {
                        setVal({
                            ...val ,
                            password : e.target.value
                        })
                    }} value={val.password} placeholder='Enter your password...' type="password" className='w-[100%] p-2 border-2 border-gray-300 rounded-lg' />
                </div>
                <button className='w-[100%] m-auto p-2 bg-green-700 text-lg font-bold cursor-pointer rounded-lg text-white' onClick={()=>{
                    login({
                        email : val.phone_no,
                        password : val.password
                    })
                }}>Login</button>
            </form>
        </div>
    )
}

export default SigninForm
