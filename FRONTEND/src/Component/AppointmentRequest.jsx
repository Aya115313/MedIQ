import React, { useState, useEffect } from 'react';
import './AppointmentRequest.css';
import AppointmentService from '../Services/appoitement';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AppointmentRequest = ({ onUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const handleDownloadDocument = async (request) => {
  try {
    // First check for attached file
    if (request.description_file) {
      // If it's a file object (from FormData)
      if (request.description_file instanceof Blob) {
        const url = URL.createObjectURL(request.description_file);
        const a = document.createElement('a');
        a.href = url;
        a.download = request.description_file.name || `appointment_${request.id}_document`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Document downloaded successfully');
        return;
      }
      // If it's a URL string
      else if (typeof request.description_file === 'string') {
        window.open(request.description_file, '_blank');
        toast.success('Opening document...');
        return;
      }
    }

    // Fallback to description text if no file
    if (request.description_text) {
      const blob = new Blob([request.description_text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointment_${request.id}_notes.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Notes downloaded successfully');
      return;
    }

    toast.warning('No document available for this request');
  } catch (error) {
    console.error('Error downloading document:', error);
    toast.error('Failed to download document');
  }
};
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await AppointmentService.getDoctorAppointmentRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load appointment requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await AppointmentService.updateAppointmentStatus(id, 'accepted');
      toast.success('Appointment accepted successfully');
      fetchRequests(); // Refresh the list
      // Notify parent component (Dashboard) to update
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      toast.error('Failed to accept appointment');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await AppointmentService.updateAppointmentStatus(id, 'declined');
      toast.info('Appointment declined');
      fetchRequests(); // Refresh the list
      // Notify parent component (Dashboard) to update
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error('Failed to decline appointment');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleViewAll = () => {
    // View all functionality if needed
    console.log('View All clicked');
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="appointment-container">
      <div className="header-row">
        <div className="left-side">
          <h6 className="appointment-title">Appointment Requests</h6>
        </div>
      </div>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Visit ID</th>
            <th>Date &nbsp;&nbsp;   & &nbsp;&nbsp;&nbsp;  Time</th>
            <th>Chat</th>
            <th>Status</th>
            <th>Action</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.patient}</td>
              <td>{request.id}</td>
              <td>{request.schedule?.split('T')[0]}</td>
              <td><button className='chat-button'>Chat</button></td>
              <td>{request.status}</td>

              <td>
                {request.status === 'accepted' ? (
                  <span className="status-accepted">Accepted</span>
                ) : request.status === 'declined' ? (
                  <span className="status-rejected">Declined</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="accept-button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="reject-button"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
              <td><button className='Import-Document'  onClick={() => handleDownloadDocument(request)}>Import Document</button></td>
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

export default AppointmentRequest;