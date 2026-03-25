import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; 
import "./login.css";
import instance, { clearAuthTokens } from "../Services/authSerivice";
import { serialize } from "cookie";


function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); 
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  // Regex for validation
  const usernameRegex = /^[a-zA-Z0-9._]{3,}$/; 
  const passwordMinLength = 8; // Minimum length check only

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
  
    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Username must be at least 3 characters (no spaces).";
    }
    if (formData.password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters long.`;
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Sending login request with:', formData);
        const response = await instance.post('/api/token/', {
          username: formData.username,
          password: formData.password,
        });

        console.log('Login response:', response.data);

        const { access, refresh } = response.data;

        document.cookie = serialize('accessToken', access, {
          path: '/',
          maxAge: 24 * 60 * 60, // 1 day
          httpOnly: false
        });

        document.cookie = serialize('refreshToken', refresh, {
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          httpOnly: false
        });

        setSuccessMessage("✅ Login successful! Redirecting...");

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        setErrors({ 
          general: error.response?.data?.detail || 
                  error.response?.data?.non_field_errors?.[0] || 
                  "Invalid username or password."
        });
      }
    }
  };
   
  return (
    <div className="login-container">
      <div className="login-card">
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="hello">
          <Link to="/" className="back-link">← Back</Link>
          <h2>Welcome back!</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {errors.username && <p className="error">{errors.username}</p>}

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <div className="hi">
            <div className="login-links">
              <Link>Forgot password?</Link>
              <span>
                No account? <Link to="/Welcome">Sign in</Link>
              </span>
            </div>

            <button type="submit" className="login-btn">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
