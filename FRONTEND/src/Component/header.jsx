import WebSiteLogo from "../assets/photosandicons/logo medical.png";
  import NotificationIcon from "../assets/photosandicons/bell-solid.svg";
  import Fasil from "../assets/photosandicons/fasil.png";
  import { Link } from "react-router-dom";
  import { useState } from "react";
  import Doc1 from "../assets/photosandicons/Doc1.jpg"
  import image from "../assets/photosandicons/schdule.png"
  import watch from "../assets/photosandicons/watch.png"
  import delay from "../assets/photosandicons/delay.png"
  import cancel from "../assets/photosandicons/cancel.png"

  function Header() {
      const [isnotify,setisnotify] = useState(false);
      function Notificationappear(){
        setisnotify(!isnotify);
        console.log(isnotify);
      }
    return (
      <div className="Header-container">
        <div className="Logo-container" style={{ color: "black" }}>
          <img src={WebSiteLogo} alt="Logo" className="Logo" />
          <Link to="/">
            <p className="WebSiteName">MEDIQ</p>
          </Link>
        </div>

        <div className="Pages">
          <Link to="/" className="Page">Home</Link>
          <Link to="/AboutUs" className="Page">About us</Link>
          <Link to="/Doctors" className="Page">Doctors</Link>
          <Link to="/favorites" className="Page">Favourite</Link>
          <Link to="/Dashboard" className="Page">D.Dashboard</Link>
        </div>

        <div className="Sign">
          <div className="Notification">
            <div className="Notification-icon">
            <img src={NotificationIcon} alt="Notification" className="Notification-icon" onClick={Notificationappear} />
            {isnotify? <div className="patient-notify" > 
                <p className="PNotifications"> 
                  P.Notification <span className="notification-number">[1]:</span>
                </p>
              <div className="one-notif">

                <div className="upper-info">
                <img src={Doc1} alt="" className="doc-notify-img" />
                <div>
                <p className="doctor-name">DR.c</p>
                <p>Onclogoist</p>
                </div>
              
                </div>
                
                <div className="midlle-info">
                <div className="delay ">
                  <img src={image} alt="" className="date-img" />
                  <p>mars,25,2025</p>
                </div>
                <div className="time-delay">
                  <img src={watch} className="watch-img" alt="" />
                  <p>9:00AM-10:00AM</p>

                </div>
        
                

                </div>
                <div className="final-info">
                  <div className="deli">
                    <p>
                      Delay
                    </p>
                    <img src={delay} className="delayAndCancel" alt="" />
                  </div>
                  <div className="cancel" >
                  <p>
                    Cancel
                  </p>
                  <img src={cancel} className="delayAndCancel" alt="" />
                  </div>

                </div>
              </div>

              <div className="Show-all-notifications">
              Show All
            </div>
            </div> :null}
            
            </div>

            <div className="Notification-count">+1</div>
          </div>
          <img src={Fasil} alt="Separator" className="fasil" />

          <div className="insecre-container">
            {/* Log in button with navigation */}
            <Link to="/login">
              <button className="insecre">Log in</button>
            </Link>
              {/* Sign in button */}
              <Link to="/Welcome">
                <button className="insecre">Sign in</button>
              </Link>
            </div>
          </div>
        </div>
    );
  }

  export default Header;
