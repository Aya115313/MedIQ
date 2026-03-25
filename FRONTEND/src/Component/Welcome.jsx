import "./Welcome.css";
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="bigdiv">
      <div className="container">
        <div className="text-container">
          <h1>Welcome!</h1>
          <p>Enter your personal details to your account</p>
        </div>
        <div className="button-container">
          <Link to="/signup_patient" className="welcome-btn patient-btn">Patient</Link>
          <Link to="/signup_doctor" className="welcome-btn doctor-btn">Doctor</Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
