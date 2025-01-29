import React, {createContext, useState, useContext} from 'react';
import {auth as authApi, register as registerApi} from '../services/api.js';
const AuthContext = createContext();

export function AuthProvider({children}) {
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    function login(username, password) {
        return authApi(username, password)
        .then((resp)=>{
            setToken(resp.data.token);
            setIsAdmin(resp.data.isAdmin);
        })
    }
    function register(username, password) {
        return registerApi(username, password)
        .then((resp) => {
            setToken(resp.data.token);
            setIsAdmin(resp.data.isAdmin);
        })
    }
    function reset() {
        setToken(null);
        setIsAdmin(false);
    }
    function isIn() {
        return token != null;
    }
    return (
        <AuthContext.Provider value={{token, isAdmin, login, register, reset, isIn}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);