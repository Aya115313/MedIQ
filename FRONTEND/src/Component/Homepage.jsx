import Header from "./header.jsx";
import  Propities from "./Propities.jsx";
import Online_apointement from "./online_apointement.jsx";
import "./Homepage.css";
import Appointment from "./Appointment.jsx";
import Apointement from "./apointementSection.jsx";
function Homepage(){
return(
    <>
    <div className="Homepage">
    <Header/>
    <Apointement/>
    <Propities />
    </div>

    </>
    )
}
export default Homepage;
