'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType{
    user: User | null;
    setUser: (user: User | null)=> void;
}

interface User{
    email: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children} : {children : ReactNode}) {
    const [user, setUser] = useState<User | null>(null);

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