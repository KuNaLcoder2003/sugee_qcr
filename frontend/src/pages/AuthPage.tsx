
import SigninForm from '../components/SigninForm'
import { CheckIcon } from 'lucide-react'

const AuthPage = () => {
    return (
        <div className='h-screen w-screen overflow-x-hidden p-4 bg-gray-100'>
            <div className='h-[100%] w-[100%] p-2 flex items-center justify-center'>
                <div className='block lg:grid lg:grid-cols-2 lg:grid-rows-1 w-[60%] h-auto p-4 rounded-lg-left '>
                    <div  className='hidden bg-green-700 text-white lg:flex lg:items-center lg:justify-center lg:flex-col gap-4 p-8 rounded-bl-lg rounded-tl-lg'>
                        <div className='w-[100px] h-[100px] rounded-full border-2 border-white flex items-center justify-center'>
                            <CheckIcon color='white' size={32} />
                        </div>


                        <div className="text-center space-y-2">
                            <h3 className='text-3xl font-bold'>Quality Control Portal</h3>
                            <p className='font-medium text-lg'>
                                Streamline your quality assurance processes with our comprehensive management system designed for manufacturing excellence.
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-full justify-center bg-white rounded-br-lg rounded-tr-lg'>
                        <div className='flex flex-col items-center'>
                            <div className='p-2 w-[150px] text-center text-lg'>
                                <img className='w-[100%] object-cover' src='https://static.wixstatic.com/media/b307e6_4b21cddba5ec4a9a8265a810003ee874~mv2.png/v1/fill/w_256,h_121,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SugeeLogo.png' />
                            </div>
                            {/* <div className="flex w-fit rounded-full bg-[#f8fafd] p-1 shadow-inner">
                                <button
                                    onClick={() => setActiveTab("login")}
                                    className={clsx(
                                        "px-6 py-2 text-sm font-medium rounded-full transition-all cursor-pointer",
                                        activeTab === "login"
                                            ? "bg-white shadow text-gray-800"
                                            : "text-gray-500"
                                    )}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setActiveTab("signup")}
                                    className={clsx(
                                        "px-6 py-2 text-sm font-medium rounded-full transition-all cursor-pointer",
                                        activeTab === "signup"
                                            ? "bg-white shadow text-gray-800"
                                            : "text-gray-500"
                                    )}
                                >
                                    Sign Up
                                </button>
                            </div> */}
                        </div>
                        <div className='flex items-center justify-center w-full mb-8'>
                            <div className="w-full flex items-center justify-center mb-8">
                                <SigninForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
