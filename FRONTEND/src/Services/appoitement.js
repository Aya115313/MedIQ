import instance from './authSerivice';


const AppointmentService = {
    // Get single doctor by ID
    getDoctor: async (id) => {
        try {
            const response = await instance.get(`/api/doctors/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            throw error;
        }
    },
    
    // Get all available doctors
    getDoctors: async () => {
        try {
            const response = await instance.get('/api/doctors/');
            return response.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    // Create a new appointment
    createAppointment: async (appointmentData) => {
        try {
            const formData = new FormData();
            formData.append('doctor_id', appointmentData.doctor.id);
            formData.append('title', appointmentData.title);
            formData.append('schedule', appointmentData.schedule);
            formData.append('description_text', appointmentData.description || '');
            
            if (appointmentData.file) {
                formData.append('description_file', appointmentData.file);
            }

            const response = await instance.post('/appointment/appointments/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Get appointment requests
    getAppointmentRequests: async () => {
        try {
            const response = await instance.get('appointment/appointment-requests/');
            return response.data;
        } catch (error) {
            console.error('Error fetching appointment requests:', error);
            throw error;
        }
    },

    // Get doctor's appointment requests
    getDoctorAppointmentRequests: async () => {
        try {
            const response = await instance.get('/appointment/doctor/enrollments/');
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor appointment requests:', error);
            throw error;
        }
    },

    // Create a new appointment request
    createAppointmentRequest: async (requestData) => {
        try {
            const formData = new FormData();
            formData.append('doctor_id', requestData.doctorId);
            formData.append('appointment_obj', requestData.appointment);
            formData.append('description_text', requestData.description || '');
            formData.append('schedule', requestData.schedule);
            formData.append("date", requestData.date);
            
            if (requestData.file) {
                formData.append('description_file', requestData.file);
            }

            const response = await instance.post('/appointment/request/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating appointment request:', error);
            throw error;
        }
    },

    // Get appointments for current user
    getUserAppointments: async () => {
        try {
            const response = await instance.get('/appointment/appointments/');
            return response.data;
        } catch (error) {
            console.error('Error fetching user appointments:', error);
            throw error;
        }
    },

    

    // Update appointment request status
    updateAppointmentStatus: async (id, status) => {
        try {
            const response = await instance.patch(`/appointment/enrollments/${id}/status/`, {
                status
            });
            return response.data;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }
};


// Add these methods to your AppointmentService
getAcceptedAppointments: async () => {
    try {
        const response = await instance.get('/appointment/appointments/accepted/');
        return response.data;
    } catch (error) {
        console.error('Error fetching accepted appointments:', error);
        throw error;
    }
}

getDeclinedAppointments: async () => {
    try {
        const response = await instance.get('/appointment/appointments/declined/');
        return response.data;
    } catch (error) {
        console.error('Error fetching declined appointments:', error);
        throw error;
    }
}
export default AppointmentService;