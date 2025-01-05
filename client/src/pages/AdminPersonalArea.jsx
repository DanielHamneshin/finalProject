import React from 'react'
import Header from '../components/Header'
import { useUserContext } from '../contexts/UserContext'
import UsersInfo from '../components/admin/UsersInfo';

const AdminPersonalArea = () => {
    const { user } = useUserContext();
    return (
        <>
            <Header />
            <UsersInfo />
        </>
    )
}

export default AdminPersonalArea