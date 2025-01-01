import React from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';

const CourseAssignments = () => {
  const { courseName } = useParams();
  const { courses } = useOutletContext();
  const navigate = useNavigate();
  
  // Find the course object that matches the courseName from the URL
  const currentCourse = courses.find(course => course.name === courseName);

  return (
    <div>
      <button 
        onClick={() => navigate('/teacherpersonal/classroom')}
        style={{ marginTop: "100px" }}
      >
        Back to Classroom
      </button>

      <div style={{ marginTop: "20px" }}>
        <h2>Course: {courseName}</h2>
        <ul></ul>
        {/* Add your assignments list or other course content here */}
      </div>
    </div>
  );
};

export default CourseAssignments;