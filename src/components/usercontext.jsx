import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);  

    return (
        <UserContext.Provider value={{ userDetails, setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUser = () => {
    return useContext(UserContext);
};