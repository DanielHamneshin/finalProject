import React from 'react'
import { useUserContext } from '../contexts/UserContext';
import { Backdrop, ClickAwayListener } from '@mui/material';

const DebtMessage = ({ isOpen, close }) => {
    const { user } = useUserContext();
    return (
        <>
            <Backdrop open={isOpen}>
                <ClickAwayListener onClickAway={close}>

                    {user && user.debt > 0 && <p>You have a debt of {user.debt}</p>}

                </ClickAwayListener>
            </Backdrop>
        </>
    )
}

export default DebtMessage