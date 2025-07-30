import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    children: ReactNode
}

interface AuthContextType {
    user_name: string,
    loggedIn: boolean,
    loading: boolean,
    login: (cred : UserCred) => void,
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user_name: '',
    loggedIn : false,
    loading : false,
    login : function(cred : UserCred):void {console.log(cred.email)},
    logout : function():void {}
})

interface UserCred {
    email : string,
    password : string
}

export const AuthProvider = ({ children }: Props) => {
    const [user_name , setUserName] = useState<string>("")
    const [loggedIn, setIsLoggedIn] = useState<boolean>(false)
    const[loading , setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token') || "hi"
        if(token) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])

    const login = (cred:UserCred) => {
        try {
            // login api
            console.log(cred.email)
            navigate('/dashboard')
            setUserName("")
            setLoading(false)

        } catch (error) {
            
        }
    }
    const logout = ()=> {
        sessionStorage.clear()
        navigate('/')
        setIsLoggedIn(false)
    }
    return (
    <AuthContext.Provider value={{ user_name, login, logout, loading , loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);