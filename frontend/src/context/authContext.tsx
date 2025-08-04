import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
    children: ReactNode
}

interface AuthContextType {
    user_name: string,
    loggedIn: boolean,
    loading: boolean,
    login: (cred: UserCred) => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user_name: '',
    loggedIn: false,
    loading: false,
    login: function (cred: UserCred): void { console.log(cred.email) },
    logout: function (): void { }
})

interface UserCred {
    email: string,
    password: string
}

const LOGIN_URL = `${import.meta.env.VITE_LOGIN_URL}`

export const AuthProvider = ({ children }: Props) => {
    const [user_name, setUserName] = useState<string>("")
    const [loggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    const login = async (cred: UserCred) => {
        console.log('Clicked')
        try {
            // login api
            console.log(LOGIN_URL)
            const formData = new FormData()
            formData.append("Username", cred.email)
            formData.append("Password", cred.password)
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
            console.log(data)
            if (data.token) {
                navigate('/dashboard')
                localStorage.setItem('token', `Bearer ${data.token}`)
                setUserName("")
                setLoading(false)
            } else {
                toast.error(data.message || "Unbale to login")
                return
            }

        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    }
    const logout = () => {
        sessionStorage.clear()
        navigate('/')
        localStorage.clear()
        setIsLoggedIn(false)
    }
    return (
        <AuthContext.Provider value={{ user_name, login, logout, loading, loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);