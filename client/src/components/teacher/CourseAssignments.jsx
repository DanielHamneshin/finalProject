import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { CLASSROOM_BASE_URL } from "../../constants/endPoint";
import {
  Box,
  Paper,
  Typography,
  Button,
  Fab,
  Divider,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  KeyboardReturn as KeyboardReturnIcon,
  Announcement as AnnouncementIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import CreateAssignment from "./CreateAssignment";

const CourseAssignments = () => {
  const { courseName } = useParams();
  const { courses } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Find the course object that matches the courseName from the URL
  const currentCourse = courses.find((course) => course.name === courseName);

  useEffect(() => {
    const getAssignments = async () => {
      if (currentCourse && !isOpen) {
        try {
          const { data } = await axios.get(
            `${CLASSROOM_BASE_URL}courseassignments/${currentCourse._id}`
          );
          setAssignments(data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getAssignments();
  }, [currentCourse, isOpen]);

  const handleAssignmentClick = (assignment) => {
    navigate(`/teacherpersonal/classroom/${courseName}/assignment/${assignment._id}`, {
      state: {
        assignment,
        course: currentCourse,
        allCourses: courses
      }
    });
  };

  // Filter assignments based on search text
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleClose = () => {
    setIsOpen(false);
    // Show success message
    setSuccessMessage('Assignment created successfully!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // console.log(assignments);
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3, marginTop: "50px" }}>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          marginTop: '200px',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {successMessage}
        </div>
      )}
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          mt: 8,
          borderRadius: '8px',
          background: '#1a73e8',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{courseName}</Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate("/teacherpersonal/classroom")}
          >
            <KeyboardReturnIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1">Teacher's Class</Typography>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          sx={{ borderRadius: '20px' }}
          onClick={() => setIsOpen(true)}
        >
          Create Assignment
        </Button>
        <Button
          variant="contained"
          startIcon={<AnnouncementIcon />}
          sx={{ borderRadius: '20px' }}
        >
          Create Announcement
        </Button>
      </Box>

      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search assignments..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#1a73e8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1a73e8',
              },
            },
          }}
        />
      </Box>

      {/* Stream */}
      <Box sx={{ mt: 4 }}>
        {filteredAssignments.map((assignment, index) => (
          <Card
            key={index}
            onClick={() => handleAssignmentClick(assignment)}
            sx={{
              mb: 2,
              '&:hover': {
                boxShadow: 3,
                cursor: 'pointer'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#1a73e8' }} />
                <Typography variant="h6" component="div">
                  {assignment.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Posted: {new Date(assignment.uploadDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Due: {new Date(assignment.finishDate).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">
                {assignment.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
      >
        <AddIcon />
      </Fab>
      {isOpen && <CreateAssignment currentCourse={currentCourse} close={handleClose} isOpen={isOpen} />}
    </Box>
  );
};

export default CourseAssignments;
