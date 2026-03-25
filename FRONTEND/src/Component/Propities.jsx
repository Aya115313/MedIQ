import Vis1 from "../assets/photosandicons/Visit1.png"
import Vis2 from "../assets/photosandicons/Visit2.png"
import Vis3 from "../assets/photosandicons/Visit3.png"
import Doctor from "../assets/photosandicons/Doctor.png"
import spec1 from "../assets/photosandicons/spec1.png"
import spec2 from "../assets/photosandicons/spec2.png"
import spec3 from "../assets/photosandicons/spec3.png"

function Propities(){


    return(
        <div className="Prop">
            <div className="Visited-Doctors eff">
                <div>
                <p className="Review">
                    Visited Doctors
                </p>
                </div>
                <div className="Doctors-container eff">
                    <img src={Vis1} alt=""  className="VIS"/>
                    <img src={Vis2} alt="" className="VIS"/>
                    <img src={Vis3} alt="" className="VIS"/>
                </div>
                <p className="descrp">
                More than 1k doctor<br></br>
                at your service 
                </p>
            </div>
            
            <div className="Spec-container eff">
            <button className="Our-Doctors">Doctors</button>
            <p className="our-Spec">Doctors you have contacted</p>
            <div>
                <img src={spec3} alt="" className="spec"/>
                <img src={spec2} alt="" className="spec"/>
                <img src={spec1} alt="" className="spec"/>
            </div>
            </div>
            <div className="Connect eff">
                <p className="connect-descrp">
                why you should 
                choose our 
                web site
                MedIQ 
                </p>
                <button className="Connectbtn">
                    More about
                </button>
            </div>
            <img src={Doctor} alt="" className="Doctor eff"/>
            
        </div>
    )

}

export default Propities;