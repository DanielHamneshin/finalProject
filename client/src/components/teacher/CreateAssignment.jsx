import React, { useState } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { CREATE_ASSIGNMENT, UPLOAD_FILE } from '../../constants/endPoint';
import axios from 'axios';
import { Backdrop, ClickAwayListener } from '@mui/material';
import style from '../../styles/createAssignment.module.css';
import { useNavigate } from 'react-router-dom';

const CreateAssignment = ({ currentCourse, close, isOpen }) => {
  const { user } = useUserContext();
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    finishDate: new Date().toISOString().split('T')[0],
    course_id: currentCourse._id,
    teacher_id: user._id,
    file: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLarge, setIsLarge] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        // Set the file in assignment state
        setAssignment({
          ...assignment,
          file: e.target.result.split(',')[1]  // Store just the base64 data
        });
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(currentCourse);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          const { data } = await axios.post(CREATE_ASSIGNMENT, assignment);

          console.log(data);
          close();
          // Show success message or refresh data
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Backdrop open={isOpen}>
      <ClickAwayListener onClickAway={() => close()}>
        <form onSubmit={handleSubmit} className={style.uploadSection}>
          <h3>Create Assignment</h3>

          <div className={style.inputGroup}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={assignment.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label>Description:</label>
            <textarea
              name="description"
              value={assignment.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label>Due Date:</label>
            <input
              type="date"
              name="finishDate"
              value={assignment.finishDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label className={style.fileInputLabel}>
              Choose File
              <input
                type="file"
                onChange={handleFileChange}
                className={style.fileInput}
                accept="image/*"
              />
            </label>
            {selectedFileName && (
              <p className={style.fileName}>
                Selected file: {selectedFileName}
              </p>
            )}
          </div>

          {/* Preview Section */}
          {previewImage && (
            <div className={style.previewImage}>
              <img
                onClick={(e) => {
                  setImageUrl(e.target.src);
                  setIsLarge(true);
                }}
                src={previewImage}
                alt="Preview"
              />
            </div>
          )}

          {/* Large Image Modal */}
          {isLarge && (
            <Backdrop open={isLarge}>
              <ClickAwayListener onClickAway={() => setIsLarge(false)}>
                <img
                  src={imageUrl}
                  alt="Large Preview"
                  className={style.modalImage}
                />
              </ClickAwayListener>
            </Backdrop>
          )}

          <button type="submit" className={style.submitButton}>
            Create Assignment
          </button>
        </form>
      </ClickAwayListener>
    </Backdrop>
  )
}

export default CreateAssignment