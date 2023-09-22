import { useContext,useState,createContext } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)
export const AuthProvider=({children})=>{
    const [name,setName] = useState(null)
    const Navigate = useNavigate();
    const login=(name)=>{
        setName(name)
    }
    const logout=()=>{
        setName(null)
        Navigate('/')
    }
    return (
        <AuthContext.Provider value={{name,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = ()=>{
    return useContext(AuthContext)
}
