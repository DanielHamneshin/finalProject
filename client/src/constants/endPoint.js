const BASE_URL = "http://127.0.0.1:5000/";

const USER_BASE_URL = BASE_URL + "auth/";

const LOGIN_URL = USER_BASE_URL + "login/student";

const REGISTER_URL = USER_BASE_URL + "register"

const COURSE_URL = BASE_URL + "corse/"

const MAJORS_URL = COURSE_URL + "majors"

export { BASE_URL, USER_BASE_URL, LOGIN_URL, REGISTER_URL, COURSE_URL, MAJORS_URL }