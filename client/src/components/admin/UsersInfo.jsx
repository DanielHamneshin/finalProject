import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext';
import axios from 'axios';
import { STUDENTS_URL, TEACHERS_URL } from '../../constants/endPoint';
import styles from '../../styles/usersInfo.module.css';

const UsersInfo = () => {
    const { user } = useUserContext();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: 'all',
        debt: 'all'
    });

    const fetchUsers = async () => {
        try {
            const [studentsRes, teachersRes] = await Promise.all([
                axios.get(STUDENTS_URL),
                axios.get(TEACHERS_URL)
            ]);

            const allUsers = [
                ...studentsRes.data.map(student => ({ ...student, role: 'student' })),
                ...teachersRes.data.map(teacher => ({ ...teacher, role: 'teacher' }))
            ];

            setUsers(allUsers);
            setFilteredUsers(allUsers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = [...users];

        // Filter by role
        if (filters.role !== 'all') {
            result = result.filter(user => user.role === filters.role);
        }

        // Filter by debt (only for students)
        if (filters.role === 'student' && filters.debt !== 'all') {
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
    }, [users, filters, searchTerm]);

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className={styles.select}
                >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                </select>

                {filters.role === 'student' && (
                    <select
                        value={filters.debt}
                        onChange={(e) => setFilters(prev => ({ ...prev, debt: e.target.value }))}
                        className={styles.select}
                    >
                        <option value="all">All Students</option>
                        <option value="yes">With Debt</option>
                        <option value="no">No Debt</option>
                    </select>
                )}
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            {filters.role === 'student' && <th>Debt</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div className={styles.userInfo}>
                                        <img
                                            src={user.avatar || '/default-avatar.png'}
                                            alt={user.name}
                                            className={styles.avatar}
                                        />
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.role}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[user.status]}`}>
                                        {user.status}
                                    </span>
                                </td>
                                {filters.role === 'student' && (
                                    <td>{user.debt ? `$${user.debt}` : '$0'}</td>
                                )}
                                <td>
                                    <button className={styles.actionButton}>Edit</button>
                                    <button className={`${styles.actionButton} ${styles.delete}`}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersInfo