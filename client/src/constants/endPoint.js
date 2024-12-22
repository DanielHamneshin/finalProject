const BASE_URL = "http://127.0.0.1:5000/";

const USER_BASE_URL = BASE_URL + "auth/";

const LOGIN_URL = USER_BASE_URL + "login/student";

const REGISTER_URL = USER_BASE_URL + "register"

const COURSE_URL = BASE_URL + "course/"

const MAJORS_URL = COURSE_URL + "majors"

const OPTIONAL_COURSES_URL = COURSE_URL + "options/"

const OPTIONAL_COURSES_CHOOSE_URL = COURSE_URL + "update/"

export {
    BASE_URL,
    USER_BASE_URL,
    LOGIN_URL,
    REGISTER_URL,
    COURSE_URL,
    MAJORS_URL,
    OPTIONAL_COURSES_URL,
    OPTIONAL_COURSES_CHOOSE_URL
}