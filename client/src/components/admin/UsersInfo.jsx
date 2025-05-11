import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../contexts/UserContext';
import axios from 'axios';
import { STUDENTS_URL, TEACHERS_URL, UPDATE_DEBT_URL, GET_ALL_COURSES_URL } from '../../constants/endPoint';
import styles from '../../styles/usersInfo.module.css';
import CreateTeacher from './CreateTeacher';
import CreateCourse from './CreateCourse';
import CreateMajor from './CreateMajor';
import { Backdrop, Box, ClickAwayListener } from '@mui/material';
import { ChooseCourseWindow } from './ChooseCourseWindow';
import { useNavigate } from 'react-router-dom';
import { AssignCourseToMajor } from './AssignCourseToMajor';

const UsersInfo = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: 'student',
        debt: 'all'
    });
    const [editingDebt, setEditingDebt] = useState(null);
    const [newDebtValue, setNewDebtValue] = useState('');
    const [newDebtMessage, setNewDebtMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [showCreateTeacher, setShowCreateTeacher] = useState(false);
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [showCreateMajor, setShowCreateMajor] = useState(false);
    const [showAssignCourseToMajor, setShowAssignCourseToMajor] = useState(false);
    const [showCourseChoose, setShowCourseChoose] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const showSuccessNotification = (message, duration = 3000) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage('');
        }, duration);
    };

    const fetchUsers = async () => {
        try {
            if (filters.role === 'student') {
                const { data } = await axios.get(STUDENTS_URL);
                setUsers(data.map(student => ({ ...student, role: 'student' })));
            } else if (filters.role === 'teacher') {
                const { data } = await axios.get(TEACHERS_URL);
                setUsers(data.map(teacher => ({ ...teacher, role: 'teacher' })));
            } else {
                setUsers(allCourses.map(course => ({ ...course, role: 'course' })));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAllCourses = async () => {
        try {
            const { data } = await axios.get(GET_ALL_COURSES_URL + user._id + "/" + user.role);
            setAllCourses(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUsers();
        getAllCourses();
    }, [filters.role]);

    const deleteUser = async (role, id) => {
        try {
            const { data } = await axios.delete(role === "student" ? "student" : "teacher", id);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let result = [...users];

        if (filters.role !== 'course' && filters.debt !== 'all') {
            result = result.filter(user =>
                filters.debt === 'yes' ? user?.debt?.value > 0 : user?.debt?.value === 0
            );
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(item =>
                filters.role === 'course'
                    ? item.name.toLowerCase().includes(searchLower)
                    : item.name.toLowerCase().includes(searchLower)
            );
        }

        result.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredUsers(result);
    }, [users, filters.debt, searchTerm, filters.role]);

    const handleEditDebt = (userId, currentDebt, currentMessage) => {
        setEditingDebt(userId);
        setNewDebtValue(currentDebt.toString());
        setNewDebtMessage(currentMessage || '');
    };

    const handleUpdateDebt = async () => {
        try {
            await axios.put(`${UPDATE_DEBT_URL}${pendingUpdate.userId}`, {
                value: Number(pendingUpdate.newDebt),
                message: pendingUpdate.newMessage
            });

            setUsers(users.map(user =>
                user._id === pendingUpdate.userId
                    ? {
                        ...user,
                        debt: {
                            value: Number(pendingUpdate.newDebt),
                            message: pendingUpdate.newMessage
                        }
                    }
                    : user
            ));

            // Show success notification
            showSuccessNotification('Debt updated successfully!');

            // Reset states
            setEditingDebt(null);
            setNewDebtValue('');
            setNewDebtMessage('');
            setShowConfirmation(false);
            setPendingUpdate(null);
        } catch (error) {
            console.error(error);
        }
    };

    const confirmUpdate = (userId, newDebt, newMessage) => {
        setPendingUpdate({ userId, newDebt, newMessage });
        setShowConfirmation(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerPaper}>
                <h1>Users Management</h1>
                <p>Manage students and teachers</p>
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => setShowCreateTeacher(true)}>Create Teacher</button>
                <button className={styles.button} onClick={() => setShowCreateCourse(true)}>Create Course</button>
                <button className={styles.button} onClick={() => setShowCreateMajor(true)}>Create Major</button>
                <button className={styles.button} onClick={() => setShowAssignCourseToMajor(true)}>Assign Course To Major</button>
            </div>

            {showCreateTeacher && <CreateTeacher open={showCreateTeacher} close={() => setShowCreateTeacher(false)} showSuccess={showSuccessNotification} />}
            {showCreateCourse && <CreateCourse open={showCreateCourse} close={() => setShowCreateCourse(false)} showSuccess={showSuccessNotification} />}
            {showCreateMajor && <CreateMajor open={showCreateMajor} close={() => setShowCreateMajor(false)} showSuccess={showSuccessNotification} />}
            {showAssignCourseToMajor && <AssignCourseToMajor open={showAssignCourseToMajor} close={() => setShowAssignCourseToMajor(false)} showSuccess={showSuccessNotification} />}

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
                        <option value="course">Courses</option>
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
                            {filters.role === 'course' ? (
                                <>
                                    <th className={styles.emailCol}>Major</th>
                                    <th className={styles.debtCol}>Students</th>
                                </>
                            ) : (
                                <>
                                    <th className={styles.emailCol}>Email</th>
                                    {filters.role === 'student' && <th className={styles.debtCol}>Debt</th>}
                                </>
                            )}
                            <th className={styles.actionsCol}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.scrollableBody}>
                        {filteredUsers.map((item, index) => (

                            <tr key={item._id} onClick={() => {
                                filters.role === 'course' && navigate(`/teacherpersonal/feedback/students/${item._id}`, {
                                    state: { course: item, student_id: null, isAdminStudent: false, isAdminCourse: true }
                                })
                            }}>
                                <td className={styles.numberCol}>{index + 1}</td>
                                <td className={styles.nameCol} onClick={() => {
                                    filters.role === 'student' && setShowCourseChoose(true);
                                    filters.role === 'student' && setSelectedStudent(item);
                                }}>
                                    <div className={styles.userInfo}>
                                        {filters.role !== "course" && <img
                                            src={user.image || `https://avatar.iran.liara.run/username?username=${item.name}`}
                                            alt={user.name}
                                            className={styles.avatar}
                                        />}
                                        <span>{item.name}</span>

                                    </div>
                                </td>
                                {filters.role === 'course' ? (
                                    <>
                                        <td className={styles.emailCol}>{item.majortitle}</td>
                                        <td className={styles.debtCol}>{item.students_id?.length || 0}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className={styles.emailCol}>{item.email}</td>
                                        {filters.role === 'student' && (
                                            <td className={styles.debtCol}>
                                                {editingDebt === item._id ? (
                                                    <div className={styles.debtEditContainer}>
                                                        <input
                                                            type="number"
                                                            value={newDebtValue}
                                                            onChange={(e) => setNewDebtValue(e.target.value)}
                                                            className={styles.debtInput}
                                                            min="0"
                                                            placeholder="Debt amount"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={newDebtMessage}
                                                            onChange={(e) => setNewDebtMessage(e.target.value)}
                                                            className={styles.debtInput}
                                                            placeholder="Debt message"
                                                        />
                                                        <button
                                                            className={styles.applyButton}
                                                            onClick={() => confirmUpdate(item._id, newDebtValue, newDebtMessage)}
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
                                                        <span>₪{item?.debt?.value || '0'}</span>
                                                        {item?.debt?.message && <p className={styles.debtMessage}>({item?.debt?.message})</p>}
                                                        <button
                                                            className={styles.editDebtButton}
                                                            onClick={() => handleEditDebt(item._id, item?.debt?.value || 0, item?.debt?.message)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </>
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
                        <p>Are you sure you want to update the debt to ₪{pendingUpdate.newDebt} with message: "{pendingUpdate.newMessage}"?</p>
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
            {
                showCourseChoose &&
                <ChooseCourseWindow isOpen={showCourseChoose} close={() => setShowCourseChoose(false)} courses={selectedStudent.courses} major={selectedStudent.majortitle} student_id={selectedStudent._id} student_name={selectedStudent.name} />
            }
            {showSuccess && (
                <div className={styles.successNotification}>
                    <span className={styles.successText}>{successMessage}</span>
                </div>
            )}
        </div>
    );
};

export default UsersInfo