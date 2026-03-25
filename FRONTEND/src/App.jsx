import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './Component/Homepage.jsx';
import Doctors from './Component/doctors.jsx';
import Welcome from './Component/Welcome.jsx';
import Signup_doctor from './Component/Signup_doctor.jsx';
import Signup_patient from './Component/Signup_patient.jsx';
import Login from './Component/login.jsx';
import Addreview from './Component/Addreview.jsx';
import Appointment from './Component/Appointment.jsx';
import AppointmentRequest from './Component/AppointmentRequest.jsx';
import Chat from './Component/Chat.jsx';
import Dashboard from './Component/Dashboard.jsx';
import Booking from './Component/Booking.jsx';
import OnlineAppointment from './Component/online_apointement.jsx';
import Favorites from './Component/Favoutire.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return(
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/Doctors' element={<Doctors />} />
        <Route path='/Welcome' element={<Welcome />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup_doctor' element={<Signup_doctor />} />
        <Route path='/AboutUs' element={<OnlineAppointment />} />
        <Route path='/Booking' element={<Booking/>}></Route> 

        <Route path='/login' element={<Login/>}></Route>
        <Route path='/Signup_patient' element={<Signup_patient />} />
        <Route path='/Addreview' element={<Addreview />} />
        <Route path='/Appointement' element={<Appointment />} />
        <Route path='/AppointmentRequest' element={<AppointmentRequest />} />
        <Route path='/Chat' element={<Chat />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/online_apointement' element={<OnlineAppointment />} />
        <Route path='/favorites' element={<Favorites />} />
        
        {/* Add more routes as needed */}
      </Routes>
      
    </Router>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </>
  
  )
}



export default App;
