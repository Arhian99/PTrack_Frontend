import { createContext, useEffect, useState } from "react";


const AuthContext = createContext({});

/* This component provides the application with the global authenticated user
It provides the rest of the application with the currently authenticated user (user state variable)
and the method to change the currently authenticated user (setUser) */
export const AuthProvider = ({ children }) => {
    /* Every time this component is mounted it checks if there is a user object in localStorage,
    if so, it initializes the user state variable with the user object in localStorage, otherwise it initializes 
    the user state variable with null.
    */
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