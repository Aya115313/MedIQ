import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaFilePdf } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppointmentService from '../Services/appoitement';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const navigate = useNavigate();

  // Refs declarations at the top
  const fileInputRef = useRef(null);
  const hourFirstDigitRef = useRef(null);
  const hourSecondDigitRef = useRef(null);
  const minuteFirstDigitRef = useRef(null);
  const minuteSecondDigitRef = useRef(null);

  // State declarations
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    documentType: '',
    document: null,
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  // Helper constants
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Data arrays
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Generate calendar days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDayOfMonth }, () => null);

  // Validation functions
  const validateName = (name) => {
    return /^[a-zA-Z ]+$/.test(name);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateHour = (hour) => {
    const num = parseInt(hour, 10);
    return !isNaN(num) && num >= 0 && num <= 23;
  };

  const validateMinute = (minute) => {
    const num = parseInt(minute, 10);
    return !isNaN(num) && num >= 0 && num <= 59;
  };

  // Event handlers
  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentYear, parseInt(e.target.value), 1));
    setSelectedDate(null);
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setErrors(prev => ({ ...prev, date: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHourChange = (position, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      let newHour;
      if (position === 0) {
        newHour = value + selectedHour[1];
        // Auto-focus next input when first digit is entered
        if (value !== '' && hourSecondDigitRef.current) {
          hourSecondDigitRef.current.focus();
        }
      } else {
        newHour = selectedHour[0] + value;
      }
      
      // Validate and update if valid
      if (newHour === '' || validateHour(newHour)) {
        setSelectedHour(newHour.padStart(2, '0'));
        setErrors(prev => ({ ...prev, time: '' }));
      } else {
        setErrors(prev => ({ ...prev, time: 'Hour must be between 00-23' }));
      }
    }
  };

  const handleMinuteChange = (position, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      let newMinute;
      if (position === 0) {
        // First digit can't be more than 5
        if (value !== '' && parseInt(value) > 5) return;
        newMinute = value + selectedMinute[1];
        // Auto-focus next input when first digit is entered
        if (value !== '' && minuteSecondDigitRef.current) {
          minuteSecondDigitRef.current.focus();
        }
      } else {
        newMinute = selectedMinute[0] + value;
      }
      
      // Validate and update if valid
      if (newMinute === '' || validateMinute(newMinute)) {
        setSelectedMinute(newMinute.padStart(2, '0'));
        setErrors(prev => ({ ...prev, time: '' }));
      } else {
        setErrors(prev => ({ ...prev, time: 'Minute must be between 00-59' }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, document: e.target.files[0] }));
      setErrors(prev => ({ ...prev, document: '' }));
    }
  };

  // Automatically trigger file selection when document type changes
  useEffect(() => {
    if (formData.documentType && !formData.document) {
      const timer = setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [formData.documentType, formData.document]);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        setDoctorError('No doctor selected. Please select a doctor first.');
        setDoctorLoading(false);
        return;
      }

      try {
        setDoctorLoading(true);
        const doctor = await AppointmentService.getDoctor(doctorId);
        setSelectedDoctor(doctor);
        setDoctorError(null);
      } catch (error) {
        console.error('Failed to load doctor:', error);
        setDoctorError('Failed to load doctor information. Please try again.');
      } finally {
        setDoctorLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!selectedHour || !selectedMinute || !validateHour(selectedHour) || !validateMinute(selectedMinute)) {
      newErrors.time = 'Please select a valid time';
    }
    
    if (!formData.firstName || !validateName(formData.firstName)) {
      newErrors.firstName = 'Please enter a valid first name (letters only)';
    }
    
    if (!formData.lastName || !validateName(formData.lastName)) {
      newErrors.lastName = 'Please enter a valid last name (letters only)';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Please enter date of birth';
    }
    
    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.documentType && !formData.document) {
      newErrors.document = 'Please select a file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        await AppointmentService.createAppointment({
            title: `Appointment with Dr. ${selectedDoctor.fullName}`,
            doctor: selectedDoctor,
            schedule: `${selectedDate.toISOString().split('T')[0]} ${selectedHour}:${selectedMinute}`,
            file: formData.document
        });

        alert('Appointment booked successfully!');
        navigate('/'); // Changed to redirect to home page
      } catch (error) {
        console.error('Booking failed:', error);
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           'Failed to book appointment';
        alert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (doctorLoading) {
    return <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    }}>Loading doctor information...</div>;
  }

  if (doctorError) {
    return (
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{color: 'red'}}>{doctorError}</p>
        <button 
          onClick={() => navigate('/Doctors')}
          style={{
            padding: '10px',
            backgroundColor: 'rgb(151, 199, 215)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Return to Doctors List
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      fontFamily: 'Arial', 
      padding: '20px',
      backgroundColor:'white',
    }}>
      <h6 style={{ 
        fontWeight: "bold",
        textAlign: 'center', 
        marginBottom: '30px',
        color: 'rgb(151, 199, 215)'
      }}>Booking Page</h6>
      
      {/* Calendar Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0px',
          padding: '10px',
          border: '1px solid #ddd',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
        }}>
          <h6 style={{ margin: 0, fontWeight: "bold" }}>Calendar</h6>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <select 
                value={currentMonth} 
                onChange={handleMonthChange}
                style={{ 
                  marginRight: "-17px",
                  border: 'none',
                  outline: 'none',
                  appearance: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {monthNames.map((month, i) => (
                  <option key={month} value={i}>{month}</option>
                ))}
              </select>
              <FaChevronDown style={{ 
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} />
            </div>
            <div style={{ position: 'relative' }}>
              <select 
                value={currentYear} 
                onChange={handleYearChange}
                style={{ 
                  padding: '8px 25px 8px 10px',
                  border: 'none',
                  outline: 'none',
                  appearance: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <FaChevronDown style={{ 
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>
        </div>
        
        {/* Calendar Grid - Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          borderLeft: '1px solid #ddd',
          borderRight: '1px solid #ddd',
          borderTop: '1px solid #ddd',
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ padding: '10px' }}>{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid - Days */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          borderLeft: '1px solid #ddd',
          borderRight: '1px solid #ddd',
          borderBottom: '1px solid #eee',
          borderRadius: "3px"
        }}>
          {emptySlots.map((_, i) => (
            <div key={`empty-${i}`} style={{ 
              padding: '12px',
              minHeight: '40px'
            }}></div>
          ))}
          
          {days.map(day => {
            const isSelected = selectedDate?.getDate() === day && 
                            selectedDate.getMonth() === currentMonth && 
                            selectedDate.getFullYear() === currentYear;
            const isToday = new Date().getDate() === day && 
                          new Date().getMonth() === currentMonth && 
                          new Date().getFullYear() === currentYear;
  
            return (
              <div 
                key={day} 
                style={{ 
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: isToday ? 'transparent' : 'transparent',
                  borderBottom: '1px solid #eee',
                  minHeight: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => handleDateClick(day)}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'rgb(151, 199, 215)' : 'transparent',
                  color: isSelected ? '#fff' : isToday ? '#000' : 'inherit',
                  fontWeight: isToday ? 'bold' : 'normal'
                }}>
                  {day}
                </div>
              </div>
            );
          })}
        </div>
        {errors.date && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.date}</div>}
      </div>
      
      {/* Time Selection */}
      <div style={{ 
        marginBottom: '30px',
        padding: '15px',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', marginRight: '10px' }}>Time :</div>
          
          {/* Hour Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0px' }}>
              <input
                type="text"
                value={selectedHour[0]}
                onChange={(e) => handleHourChange(0, e.target.value)}
                ref={hourFirstDigitRef}
                style={{
                  width: '30px',
                  height: '30px',
                  padding: '5px',
                  backgroundColor: errors.time ? '#ffdddd' : 'rgb(124, 181, 199)',
                  border: errors.time ? "1px solid red" : "1px solid #ddd",
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px',
                  outline: 'none'
                }}
                maxLength={1}
              />
              <input
                type="text"
                value={selectedHour[1]}
                onChange={(e) => handleHourChange(1, e.target.value)}
                ref={hourSecondDigitRef}
                style={{
                  width: '30px',
                  height: '30px',
                  padding: '5px',
                  backgroundColor: errors.time ? '#ffdddd' : 'rgb(124, 181, 199)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px',
                  outline: 'none',
                  border: errors.time ? "1px solid red" : "1px solid #ddd"
                }}
                maxLength={1}
              />
            </div>
            <div style={{ 
              fontSize: '12px',
              color: '#666',
              marginTop: '5px'
            }}>Hour</div>
          </div>
          
          {/* Minute Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0px' }}>
              <input
                type="text"
                value={selectedMinute[0]}
                onChange={(e) => handleMinuteChange(0, e.target.value)}
                ref={minuteFirstDigitRef}
                style={{
                  width: '30px',
                  height: '30px',
                  padding: '5px',
                  backgroundColor: errors.time ? '#ffdddd' : 'rgb(124, 181, 199)',
                  borderRadius: '4px',
                  border: errors.time ? "1px solid red" : "1px solid #ddd",
                  textAlign: 'center',
                  fontSize: '14px',
                  outline: 'none'
                }}
                maxLength={1}
              />
              <input
                type="text"
                value={selectedMinute[1]}
                onChange={(e) => handleMinuteChange(1, e.target.value)}
                ref={minuteSecondDigitRef}
                style={{
                  width: '30px',
                  height: '30px',
                  padding: '5px',
                  backgroundColor: errors.time ? '#ffdddd' : 'rgb(124, 181, 199)',
                  border: errors.time ? "1px solid red" : "1px solid #ddd",
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px',
                  outline: 'none'
                }}
                maxLength={1}
              />
            </div>
            <div style={{ 
              fontSize: '12px',
              color: '#666',
              marginTop: '5px'
            }}>Min</div>
          </div>
        </div>
        {errors.time && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.time}</div>}
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* First row - 3 inputs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>First Name</div>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleInputChange} 
              required
              style={{ 
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: errors.firstName ? '1px solid red' : '1px solid #ddd',
                fontSize: '12px'
              }}
            />
            {errors.firstName && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.firstName}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>Last Name</div>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleInputChange} 
              required
              style={{ 
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: errors.lastName ? '1px solid red' : '1px solid #ddd',
                fontSize: '12px'
              }}
            />
            {errors.lastName && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.lastName}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>Phone Number</div>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              required
              style={{ 
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: errors.phone ? '1px solid red' : '1px solid #ddd',
                fontSize: '12px'
              }}
            />
            {errors.phone && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.phone}</div>}
          </div>
        </div>
        
        {/* Second row - 2 inputs + document upload */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>Gender</div>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange} 
              required
              style={{ 
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: errors.gender ? '1px solid red' : '1px solid #ddd',
                fontSize: '12px'
              }}
            >
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.gender}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>Date of Birth</div>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleInputChange} 
              required
              max={new Date().toISOString().split('T')[0]}
              style={{ 
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: errors.dob ? '1px solid red' : '1px solid #ddd',
                fontSize: '12px'
              }}
            />
            {errors.dob && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.dob}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>Add Important Document</div>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={(e) => setFormData(prev => ({...prev, documentType: e.target.value, document: null}))}
              style={{
                width: '100%',
                padding: '8px',
                border: errors.document ? '1px solid red' : '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '12px'
              }}
            >
              <option value="">Select document type...</option>
              <option value="pdf">PDF Document</option>
              <option value="image">Image (PNG/JPG)</option>
              <option value="word">Word Document</option>
            </select>

            <input 
              ref={fileInputRef}
              type="file" 
              name="document" 
              onChange={handleFileChange}
              accept={
                formData.documentType === 'pdf' ? '.pdf' :
                formData.documentType === 'image' ? '.png,.jpg,.jpeg' :
                formData.documentType === 'word' ? '.doc,.docx' : ''
              }
              style={{ display: 'none' }}
            />
            
            {formData.document ? (
              <div style={{ 
                marginTop: '4px', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FaFilePdf />
                <span>{formData.document.name}</span>
              </div>
            ) : formData.documentType ? (
              <div style={{ 
                marginTop: '4px', 
                fontSize: '12px', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                No file selected
              </div>
            ) : null}
            {errors.document && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.document}</div>}
          </div>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: '10px',
            backgroundColor: 'rgb(151, 199, 215)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '20%',
            fontSize: '15px',
            marginTop: '10px',
            marginLeft: "800px",
            fontWeight: '500'
          }}
        >
          {isLoading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default Booking;