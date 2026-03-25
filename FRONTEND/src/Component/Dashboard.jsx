import React, { useState } from 'react';
import './Dashboard.css';
import AppointmentRequest from "./AppointmentRequest";
import Appointment from './Appointment';
import Header from './header';

function Dashboard() {
  const [experience, setExperience] = useState(10);
  const [totalPatients, setTotalPatients] = useState(1500);
  const [reviews, setReviews] = useState(4.5);

  const handleExperienceClick = () => setExperience(experience + 1);
  const handlePatientsClick = () => setTotalPatients(totalPatients + 100);
  const handleReviewsClick = () => setReviews(reviews + 0.1);

  return (
    <>
      <div className="dashboard-container">
        <h2 style={{
          color: 'rgb(151, 199, 215)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>Doctor Dashboard</h2>

        <div className="dashboard-row">
          <div className="doctor-info">
            <img src='/picture/télécharger (1).png' alt='Doctor' className="doctor-image" />
            <div className="doctor-details">
              <h6 className="doctor-name">Pro.Dr.E</h6>
              <p className="speciality">Oncologiste</p>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-box" onClick={handleExperienceClick}>
              <img src='/picture/image (2) 2.png' alt='Experience' className="stat-image" />
              <div className="stat-text">
                <p className="stat-value">{experience} Years</p>
                <p className="stat-label">Experience</p>
              </div>
            </div>

            <div className="stat-box" onClick={handlePatientsClick}>
              <img src='/picture/Patient.png' alt='Total Patients' className="stat-image" />
              <div className="stat-text">
                <p className="stat-value">{totalPatients}</p>
                <p className="stat-label">Total Patients</p>
              </div>
            </div>

            <div className="stat-box" onClick={handleReviewsClick}>
              <img src='/picture/Star.png' alt='Reviews' className="stat-image" />
              <div className="stat-text">
                <p className="stat-value">{reviews.toFixed(1)} K</p>
                <p className="stat-label">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <AppointmentRequest />
      </div>

      <div>
        <Appointment />
      </div>
    </>
  );
}

export default Dashboard;
