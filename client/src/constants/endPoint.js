const BASE_URL = "http://127.0.0.1:5000/";

const USER_BASE_URL = BASE_URL + "auth/";

const LOGIN_URL = USER_BASE_URL + "login/student/";

const REGISTER_URL = USER_BASE_URL + "register/"

const COURSE_URL = BASE_URL + "course/"

const MAJORS_URL = COURSE_URL + "majors/"

const OPTIONAL_COURSES_URL = COURSE_URL + "options/"

const OPTIONAL_COURSES_CHOOSE_URL = COURSE_URL + "update/"

const GET_ALL_COURSES_URL = COURSE_URL + "all/"

const MASHOV_BASE_URL = BASE_URL + "mashov/"

const GET_ATTENDANCE_URL = MASHOV_BASE_URL + "attendence/"

const GET_TESTS_URL = MASHOV_BASE_URL + "tests/"

const GET_ASSIGNMENTS_URL = MASHOV_BASE_URL + "assignments/"

//teacher

const TEACHER_BASE = BASE_URL + "teacher/"

const GET_ALL_STUDENTS = TEACHER_BASE + "students/"

export {
    USER_BASE_URL,
    LOGIN_URL,
    REGISTER_URL,
    COURSE_URL,
    MAJORS_URL,
    OPTIONAL_COURSES_URL,
    OPTIONAL_COURSES_CHOOSE_URL,
    GET_ALL_COURSES_URL,
    GET_ATTENDANCE_URL,
    GET_TESTS_URL,
    GET_ASSIGNMENTS_URL,
    GET_ALL_STUDENTS
}