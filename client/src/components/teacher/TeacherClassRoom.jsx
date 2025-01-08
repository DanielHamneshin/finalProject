import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from "axios";
import { GET_ALL_STUDENTS } from "../../constants/endPoint";
import {
  Box,
  Container,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  KeyboardReturn as KeyboardReturnIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const TeacherClassRoom = () => {
  const { courses } = useOutletContext();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getallStudentsinallCourses = async (course) => {
    try {
      courses.map(async (course) => {
        const { data } = await axios.get(`${GET_ALL_STUDENTS}${course._id}`);
        setStudents((prev) => [...prev, { len: data.length, courseName: course.name, _id: course._id }]);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (course) => {
    console.log(course);
    navigate(`/teacherpersonal/classroom/${course.name}`);
  }
  console.log(students);

  useEffect(() => {
    getallStudentsinallCourses();
  }, [courses]);

  // Filter courses based on search text
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container sx={{ marginTop: "150px" }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          mt: 8,
          borderRadius: '8px',
          background: '#1a73e8',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h4">My Classroom</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Welcome, {user?.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/teacherpersonal')}
          startIcon={<KeyboardReturnIcon />}
          sx={{
            color: '#1a73e8',
            bgcolor: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
        >
          Back
        </Button>
      </Paper>

      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses..."
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

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {filteredCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              onClick={() => handleClick(course)}
              sx={{
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-4px)',
                  borderColor: '#1a73e8'
                }
              }}
            >
              <Typography variant="h6" color="primary">
                {course.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {students.find((student) => student._id === course._id)?.len || 0} Students enrolled
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TeacherClassRoom;
