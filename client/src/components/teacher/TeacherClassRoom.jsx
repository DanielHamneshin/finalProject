import React from "react";
import { useUserContext } from "../../contexts/UserContext";
import { Navigate, useOutletContext, useNavigate } from 'react-router-dom';

const TeacherClassRoom = () => {
  const { courses } = useOutletContext();
  const navigate = useNavigate();
  
  const handleClick = (course) => {
    navigate(`/teacherpersonal/classroom/${course.name}`);
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/teacherpersonal')}
        style={{ marginTop: "100px" }}
      >
        Back to Personal Area
      </button>

      <ul style={{marginTop: "20px"}}>
        {courses.map((course) => {
          return (
            <li onClick={() => handleClick(course)} key={course._id} style={{cursor: 'pointer'}}>
              {course.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeacherClassRoom;
