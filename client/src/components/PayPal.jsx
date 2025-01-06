import React, { useEffect, useRef, useState } from 'react'
import { useUserContext } from '../contexts/UserContext';
import axios from 'axios';
import { UPDATE_DEBT_URL } from '../constants/endPoint';
import styles from '../styles/payDebt.module.css';

const PayPal = () => {
    const { user } = useUserContext();
    const paypal = useRef();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Test",
                            amount: {
                                currency_code: "USD",
                                value: user?.debt,
                            },
                        },
                    ],
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log(order);
                try {
                    await axios.put(`${UPDATE_DEBT_URL}${user?._id}`, {
                        debt: 0
                    });
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 3000);
                } catch (error) {
                    console.error(error);
                }
            },
            onError: (err) => {
                console.log(err);
            },
        }).render(paypal.current);
    }, [])

    return (
        <div className={styles.container}>
            {showSuccess && (
                <div className={styles.successAlert}>
                    Payment successful! Your debt has been cleared.
                </div>
            )}
            <div ref={paypal}></div>
        </div>
    )
}

export default PayPal