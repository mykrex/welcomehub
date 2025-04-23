'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType{
    user: User | null;
    setUser: (user: User | null)=> void;
}

interface User{
    email: string;
    rol: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children} : {children : ReactNode}) {
    const [user, setUserState] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    };

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
};

export function useUser(){
    const context = useContext(UserContext);
    if(context === undefined){
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}