import "./online_apointement.css"
import schedule from "../assets/schedule.png"
import logo from "../assets/logo_online.png"
import { Link } from "react-router-dom";

function Online_apointement(){
    return <section className="online_apointement">
        <div className="upper">
            <div className="firstdiv">
                <img src={schedule}></img>
                <div className="sep"></div>
                <h2>Online Appointement </h2>
            </div>
            <div className="seconddiv">
                <div>Our platform offers a seamless and secure way to book medical appointments online. With</div>
                <div>an easy-to-use interface, instant booking confirmation, and access to top healthcare</div>
                <div>professionals. Enjoy features like video</div>
                <div>consultations, and automated reminders—all designed to save you</div>
                <div>time and provide the best healthcare experience</div>
            </div>
        </div>
            <div className="thirddiv">
            <img src={logo}></img>
            <div className="sep"></div>
            <div className="online-links">
                <Link to="/Welcome" className="Page">Signup</Link>
                <Link to="/Login" className="Page">Login</Link>
            <div className="links">

            </div>
        </div>
        </div>
    </section>
}

export default Online_apointement