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
    logout: () => void,
    isAdmin : boolean,
}

const AuthContext = createContext<AuthContextType>({
    user_name: '',
    loggedIn: false,
    loading: false,
    login: function (cred: UserCred): void { console.log(cred.email) },
    logout: function (): void { },
    isAdmin : false,
})

interface UserCred {
    email: string,
    password: string
}
const TOKEN_KEY = "authtoken";
const ROLE_KEY = "role";
const LOGIN_URL = `${import.meta.env.VITE_LOGIN_URL}`

export const AuthProvider = ({ children }: Props) => {
    const [user_name, setUserName] = useState<string>("")
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [loggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('authtoken')
        const role = localStorage.getItem('role') as string
        if (token) {
            console.log(isAdmin)
            setIsLoggedIn(true)
            if (role == '1') {
                setIsAdmin(true)
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [])

    const login = async (cred: UserCred) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("Username", cred.email);
            formData.append("Password", cred.password);

            const response = await fetch(LOGIN_URL, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem(TOKEN_KEY, `Bearer ${data.token}`);
                localStorage.setItem(ROLE_KEY, data.role);
                setUserName(data.username || cred.email); // fallback to email if no username returned
                setIsLoggedIn(true);
                setIsAdmin(data.role === "1");
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Unable to login");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear()
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName("");
        navigate("/");
    };
    return (
        <AuthContext.Provider value={{ user_name, login, logout, loading, loggedIn , isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);