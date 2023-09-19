import { createContext, useEffect, useState } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if(window.localStorage.getItem('user') === null) return null;
        return JSON.parse(window.localStorage.getItem('user'))
    });
    

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext;