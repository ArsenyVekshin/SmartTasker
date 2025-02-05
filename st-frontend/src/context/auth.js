import React, {createContext, useState, useContext, useEffect} from 'react';
import {auth as authApi, register as registerApi, changeToken, getMyBoards} from '../services/api.js';
const AuthContext = createContext();

export function AuthProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'));
    changeToken(token);
    function handleResponse(response) {
        setToken(response.data.token);
        setIsAdmin(response.data.adminRole);
    }
    function login(username, password) {
        return authApi(username, password)
        .then(handleResponse);
    }
    function register(username, password) {
        return registerApi(username, password)
        .then(handleResponse);
    }
    function reset() {
        setToken(null);
        setIsAdmin(false);
    }
    const isIn = getMyBoards;
    useEffect(()=>{
        changeToken(token);
        if(token)
            localStorage.setItem('token', token);
        else
            localStorage.removeItem('token');
    }, [token]);
    useEffect(() => {
        localStorage.setItem('isAdmin', isAdmin);
    }, [isAdmin]);
    return (
        <AuthContext.Provider value={{isAdmin, login, register, reset, isIn}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);