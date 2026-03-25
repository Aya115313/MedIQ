import React, { useState, useEffect } from 'react';
import './Appointment.css';
import AppointmentService from '../Services/appoitement';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getAppointmentRequests();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await AppointmentService.updateAppointmentStatus(id, newStatus);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Error updating appointment status:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
  };

  const handleViewAll = () => {
    setSearchTerm('');
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="appointment-container">
      <div className="header-row">
        <div className="left-side">
          <h6 className="appointment-title">Appointment</h6>
          <div className="date-box">
            <span>{formattedDate}</span>
          </div>
        </div>
        <div className="right-side">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <p className="all-paragraph" onClick={handleResetSearch}>
            All
          </p>
        </div>
      </div>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Visit ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient}</td>
              <td>{appointment.id}</td>
              <td>{appointment.schedule?.split('T')[0]}</td>
              <td>{appointment.schedule?.split('T')[1]?.substring(0, 5)}</td>
              <td>{appointment.status}</td>
              <td>
                {appointment.status === 'accepted' ? (
                  <button className="done-button" disabled>
                    Accepted
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'accepted')}
                      className="done-button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'declined')}
                      className="undone-button"
                    >
                      Decline
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          
          <tr className="view-all-row">
            <td colSpan="6">
              <p className="view-all-paragraph" onClick={handleViewAll}>
                View All
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Appointment;