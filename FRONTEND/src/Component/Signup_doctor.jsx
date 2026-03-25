import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Signup_doctor.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import defaultPhoto from "../assets/photo-icon.png";
import axios from "axios";
import instance from "../Services/authSerivice";
function Signup_doctor() {
  const navigate = useNavigate(); // ✅ Initialize navigate
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    specialty: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    about: "",
    photo:""
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("photo set ");
      setFormData({ ...formData, photo: file });
    }
  };
  const validateForm = () => {
    let newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) newErrors.fullName = "Only letters & spaces allowed!";
    if (!formData.dob) newErrors.dob = "Date of birth is required!";
    if (!["Male", "Female"].includes(formData.gender)) newErrors.gender = "Only 'Male' or 'Female'!";
    if (!/^[A-Za-z\s]+$/.test(formData.specialty)) newErrors.specialty = "Only letters & spaces allowed!";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Must be 10 digits!";
    if (formData.username.length < 4) newErrors.username = "At least 4 characters required!";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format!";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/.test(formData.password)) 
      newErrors.password = "Must be 8+ chars, 1 upper, 1 lower, 1 number!";
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      // Create a FormData object
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Send the FormData object
      const response = await instance.post('/api/user/register/Doctor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/login');
      }, 2000);

      // Reset form data
      setFormData({
        fullName: "",
        dob: "",
        gender: "",
        specialty: "",
        phone: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        about: "",
        photo: "",
      });
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      setErrors(error.response?.data || { general: 'Signup failed' });
    }
  }
};
  
  return (
    <div className="bigdiv1">
      {showNotification && (
        <div className="notification">
          ✅ Signup Successful! Welcome, Doctor!
        </div>
      )}

      <div className="signup-container">
        <div className="header">
          <Link to="/Welcome" className="back-btn">← Back</Link>
          <h3>Hi, <span className="blue-text">Doctor!</span></h3>
          <div className="photo-upload" onClick={() => document.getElementById("photoInput").click()}>
            <img src={photo} alt="Upload" />
          </div>
          <input 
            type="file" 
            id="photoInput" 
            accept="image/*" 
            style={{ display: "none" }} 
            onChange={handlePhotoChange} 
          />
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <p className="upload-text">Upload <span className="blue-text">Your Photo</span></p>
          <input type="text" name="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          {errors.dob && <p className="error">{errors.dob}</p>}

          <input type="text" name="gender" placeholder="Gender (Male/Female)" value={formData.gender} onChange={handleChange} />
          {errors.gender && <p className="error">{errors.gender}</p>}

          <input type="text" name="specialty" placeholder="Speciality" value={formData.specialty} onChange={handleChange} />
          {errors.specialty && <p className="error">{errors.specialty}</p>}

          <input type="text" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          {errors.username && <p className="error">{errors.username}</p>}

          <input type="email" name="email" placeholder="Address email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <div className="password-field">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <div className="password-field">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
            </span>
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <textarea name="about" placeholder="About you" value={formData.about} onChange={handleChange}></textarea>

          <div className="terms-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I accept the <span className="blue-text">general terms of use*</span></label>
          </div>

          <button className="signup-btn" type="submit">CREATE ACCOUNT</button>

          <p className="login-text">
            You have an account? <Link to="/login" className="blue-text">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup_doctor;
