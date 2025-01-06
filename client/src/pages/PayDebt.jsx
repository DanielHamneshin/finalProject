import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import styles from '../styles/payDebt.module.css'

const PayDebt = ({ onClose }) => {
    const { user } = useUserContext();
    const navigate = useNavigate();

    const handlePayNow = () => {
        onClose();
        navigate('/personal/paydebt');
    };

    return (
        <div className={styles.payDebtModal}>
            <div className={styles.modalHeader}>
                <h2>Outstanding Debt Notice</h2>
                <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
            <div className={styles.modalContent}>
                <p className={styles.debtAmount}>
                    Current Debt: <span>${user?.debt}</span>
                </p>
                <p className={styles.debtMessage}>
                    Please settle your outstanding debt to continue accessing all features.
                </p>
                <div className={styles.buttonContainer}>
                    <button className={styles.payButton} onClick={handlePayNow}>
                        Pay Now
                    </button>
                    <button className={styles.laterButton} onClick={onClose}>
                        Later
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PayDebt