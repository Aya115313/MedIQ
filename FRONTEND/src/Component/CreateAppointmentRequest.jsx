import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../Services/appoitement';
import './CreateAppointmentRequest.css';

const CreateAppointmentRequest = ({ appointmentId, doctorId }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        doctorId,
        appointmentId,
        description,
        file
      };

      await AppointmentService.createAppointmentRequest(requestData);
      // Redirect to appointments list or show success message
      navigate('/appointments');
    } catch (err) {
      console.error('Error creating appointment request:', err);
      setError('Failed to create appointment request. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (loading) return <div>Creating request...</div>;

  return (
    <div className="create-request-container">
      <h2>Request Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your reason for the appointment..."
            required={!file}
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Attachment (optional):</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default CreateAppointmentRequest;