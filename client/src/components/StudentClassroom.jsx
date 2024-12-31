import React from 'react'

const StudentClassroom = ({ courses }) => {

    return (
        <div>
            {courses.map((course) => (
                <div key={course.id}>
                    <h2>{course.name}</h2>
                </div>
            ))}
            {courses.map((course) => (
                <div key={course.id}>
                    <h2>{course.name}</h2>
                </div>
            ))}
        </div>
    )
}

export default StudentClassroom