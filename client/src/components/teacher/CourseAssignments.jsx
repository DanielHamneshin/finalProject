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
  IconButton
} from "@mui/material";
import { 
  Add as AddIcon,
  Assignment as AssignmentIcon,
  KeyboardReturn as KeyboardReturnIcon,
  Announcement as AnnouncementIcon
} from "@mui/icons-material";

const CourseAssignments = () => {
  const { courseName } = useParams();
  const { courses } = useOutletContext();

  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  // Find the course object that matches the courseName from the URL
  const currentCourse = courses.find((course) => course.name === courseName);

  useEffect(() => {
    const getAssignments = async () => {
      if (currentCourse) {
        try {
          const { data } = await axios.get(
            `${CLASSROOM_BASE_URL}/courseassignments/${currentCourse._id}`
          );
          console.log(data);
          setAssignments(data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getAssignments();
  }, [currentCourse]);

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
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

      {/* Stream */}
      <Box sx={{ mt: 4 }}>
        {assignments.map((assignment, index) => (
          <Card 
            key={index} 
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
    </Box>
  );
};

export default CourseAssignments;
