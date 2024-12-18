import React, { createContext, useContext, useState } from 'react'

export const User = createContext(null);

const UserContext = ({ children }) => {
    const [user, setUser] = useState(null)
    return (
        <User.Provider value={{ user, setUser }}>
            {children}
        </User.Provider>
    )
}

export default UserContext

export const useUserContext = () => {
    return useContext(User);
}