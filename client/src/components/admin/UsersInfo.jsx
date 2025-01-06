import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext';
import axios from 'axios';
import { STUDENTS_URL, TEACHERS_URL, UPDATE_DEBT_URL } from '../../constants/endPoint';
import styles from '../../styles/usersInfo.module.css';

const UsersInfo = () => {
    const { user } = useUserContext();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: 'student',
        debt: 'all'
    });
    const [editingDebt, setEditingDebt] = useState(null);
    const [newDebtValue, setNewDebtValue] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState(null);

    const fetchUsers = async () => {
        try {
            if (filters.role === 'student') {
                const { data } = await axios.get(STUDENTS_URL);
                setUsers(data.map(student => ({ ...student, role: 'student' })));
            } else {
                const { data } = await axios.get(TEACHERS_URL);
                setUsers(data.map(teacher => ({ ...teacher, role: 'teacher' })));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.role]);

    useEffect(() => {
        let result = [...users];

        // Filter by debt
        if (filters.debt !== 'all') {
            result = result.filter(user =>
                filters.debt === 'yes' ? user.debt > 0 : user.debt === 0
            );
        }

        // Filter by search term
        if (searchTerm) {
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort alphabetically by name
        result.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredUsers(result);
    }, [users, filters.debt, searchTerm]);

    const handleEditDebt = (userId, currentDebt) => {
        setEditingDebt(userId);
        setNewDebtValue(currentDebt.toString());
    };

    const handleUpdateDebt = async () => {
        try {
            await axios.put(`${UPDATE_DEBT_URL}${pendingUpdate.userId}`, {
                debt: Number(pendingUpdate.newDebt)
            });

            setUsers(users.map(user =>
                user._id === pendingUpdate.userId
                    ? { ...user, debt: Number(pendingUpdate.newDebt) }
                    : user
            ));

            // Reset states
            setEditingDebt(null);
            setNewDebtValue('');
            setShowConfirmation(false);
            setPendingUpdate(null);
        } catch (error) {
            console.error(error);
        }
    };

    const confirmUpdate = (userId, newDebt) => {
        setPendingUpdate({ userId, newDebt });
        setShowConfirmation(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerPaper}>
                <h1>Users Management</h1>
                <p>Manage students and teachers</p>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            role: e.target.value,
                            debt: 'all'
                        }))}
                        className={styles.select}
                    >
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                    </select>

                    {filters.role === 'student' && (
                        <select
                            value={filters.debt}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                debt: e.target.value
                            }))}
                            className={styles.select}
                        >
                            <option value="all">All Students</option>
                            <option value="yes">With Debt</option>
                            <option value="no">No Debt</option>
                        </select>
                    )}
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.numberCol}>#</th>
                            <th className={styles.nameCol}>Name</th>
                            <th className={styles.emailCol}>Email</th>
                            {filters.role === 'student' && <th className={styles.debtCol}>Debt</th>}
                            <th className={styles.actionsCol}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td className={styles.numberCol}>{index + 1}</td>
                                <td className={styles.nameCol}>
                                    <div className={styles.userInfo}>
                                        <img
                                            src={user.image || `https://avatar.iran.liara.run/username?username=${user.name}`}
                                            alt={user.name}
                                            className={styles.avatar}
                                        />
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td className={styles.emailCol}>{user.email}</td>
                                {filters.role === 'student' && (
                                    <td className={styles.debtCol}>
                                        {editingDebt === user._id ? (
                                            <div className={styles.debtEditContainer}>
                                                <input
                                                    type="number"
                                                    value={newDebtValue}
                                                    onChange={(e) => setNewDebtValue(e.target.value)}
                                                    className={styles.debtInput}
                                                    min="0"
                                                />
                                                <button
                                                    className={styles.applyButton}
                                                    onClick={() => confirmUpdate(user._id, newDebtValue)}
                                                >
                                                    Apply
                                                </button>
                                                <button
                                                    className={styles.cancelButton}
                                                    onClick={() => setEditingDebt(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.debtDisplay}>
                                                <span>${user.debt || '0'}</span>
                                                <button
                                                    className={styles.editDebtButton}
                                                    onClick={() => handleEditDebt(user._id, user.debt || 0)}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                                <td className={styles.actionsCol}>
                                    <button className={`${styles.actionButton} ${styles.delete}`}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmationModal}>
                        <h3>Confirm Debt Update</h3>
                        <p>Are you sure you want to update the debt to ${pendingUpdate.newDebt}?</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.confirmButton}
                                onClick={handleUpdateDebt}
                            >
                                Confirm
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setPendingUpdate(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersInfo